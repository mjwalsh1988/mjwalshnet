// The contact form's Vercel function (sections 8.1, 12). Validates with Zod,
// checks Turnstile when its secret is set, rate limits by hashed IP through
// the contact_messages table when Supabase is set, stores a copy in Supabase,
// mails it through Resend, and never echoes input back unescaped. Each
// missing key turns its step off with one log line. Without JavaScript the
// browser posts the form here and is redirected back with a status.
import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { createHash } from "node:crypto";
import { env, missing } from "../../lib/server/env";
import { secretClient } from "../../lib/server/supabase";

export const prerender = false;

const TOPICS = ["work", "writing", "accessibility", "football", "privacy", "other"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Please tell me your name.").max(200),
  email: z.email("That email address does not look right.").trim().max(320),
  topic: z.enum(TOPICS).catch("other"),
  page: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().min(10, "Say a little more than that.").max(10000),
  // The honeypot. People never see it; scripts fill it in.
  website: z.string().max(0).optional().default(""),
  "cf-turnstile-response": z.string().optional().default(""),
});

export type ContactResult =
  { ok: true; message: string } | { ok: false; message: string; errors?: Record<string, string> };

const MAX_PER_HOUR = 5;

function wantsJson(request: Request): boolean {
  return (
    request.headers.get("accept")?.includes("application/json") === true ||
    request.headers.get("x-requested-with") === "fetch"
  );
}

function respond(request: Request, status: number, result: ContactResult): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(result), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  const url = new URL("/contact", request.url);
  url.searchParams.set("status", result.ok ? "sent" : "error");
  if (!result.ok) url.searchParams.set("reason", result.message);
  return Response.redirect(url.toString(), 303);
}

function hashIp(ip: string): string {
  const salt = env("CRON_SECRET") ?? "mjwalsh.net";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret) {
    missing("TURNSTILE_SECRET_KEY", "the contact form relies on the honeypot and rate limit only");
    return true;
  }
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

async function sendMail(input: {
  name: string;
  email: string;
  topic: string;
  page: string;
  message: string;
}): Promise<boolean> {
  const key = env("RESEND_API_KEY");
  const to = env("CONTACT_TO_EMAIL");
  if (!key || !to) {
    missing(
      key ? "CONTACT_TO_EMAIL" : "RESEND_API_KEY",
      "contact mail is off, messages are stored only",
    );
    return false;
  }
  const site = new URL(env("PUBLIC_SITE_URL") ?? "https://mjwalsh.net").hostname;
  const text = [
    `From: ${input.name} <${input.email}>`,
    `Topic: ${input.topic}`,
    input.page ? `Page: ${input.page}` : "",
    "",
    input.message,
  ]
    .filter((line, i) => line !== "" || i > 2)
    .join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${site} contact form <no-reply@${site}>`,
      to: [to],
      reply_to: input.email,
      subject: `[${input.topic}] Message from ${input.name}`,
      text,
    }),
  });
  if (!res.ok) console.error(`Resend returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.ok;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let raw: Record<string, string> = {};
  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) {
      raw = (await request.json()) as Record<string, string>;
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) raw[k] = typeof v === "string" ? v : "";
    }
  } catch {
    return respond(request, 400, { ok: false, message: "I could not read that submission." });
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    if (errors.website) {
      // A filled honeypot: pretend it worked and drop it.
      return respond(request, 200, { ok: true, message: "Thanks. Your message is on its way." });
    }
    return respond(request, 400, { ok: false, message: "Please check the form.", errors });
  }
  const data = parsed.data;

  let ip = "unknown";
  try {
    ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress;
  } catch {
    // clientAddress throws when the adapter cannot supply it; the hash of "unknown" still rate limits.
  }
  const ipHash = hashIp(ip);

  if (!(await verifyTurnstile(data["cf-turnstile-response"], ip))) {
    return respond(request, 400, {
      ok: false,
      message: "The anti-spam check did not pass. Please try again, or email me directly.",
    });
  }

  const db = secretClient();
  let stored = false;
  if (db) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await db
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (countError) console.error(`rate limit count failed: ${countError.message}`);
    if ((count ?? 0) >= MAX_PER_HOUR) {
      return respond(request, 429, {
        ok: false,
        message: "That is a lot of messages in an hour. Please wait a while, or email me directly.",
      });
    }
    const { error } = await db.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      message: `[${data.topic}]${data.page ? ` [${data.page}]` : ""}\n\n${data.message}`,
      ip_hash: ipHash,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    });
    if (error) console.error(`contact_messages insert failed: ${error.message}`);
    else stored = true;
  }

  const mailed = await sendMail(data);

  if (!stored && !mailed) {
    console.error("Contact message received but neither Supabase nor Resend is configured.");
    return respond(request, 503, {
      ok: false,
      message: "The form is not connected yet. Please email me directly instead.",
    });
  }
  return respond(request, 200, { ok: true, message: "Thanks. Your message is on its way." });
};

export const GET: APIRoute = () =>
  new Response("Send the contact form with POST.", { status: 405, headers: { Allow: "POST" } });
