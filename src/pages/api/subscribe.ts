// Newsletter sign-up (section 6.12): the form posts here so no third-party
// script loads on the page. The address goes to Buttondown and a mirror row
// to the subscribers table. Without BUTTONDOWN_API_KEY the function says the
// newsletter is not live yet; without Supabase the mirror is skipped.
import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { env, missing } from "../../lib/server/env";
import { secretClient } from "../../lib/server/supabase";

export const prerender = false;

const schema = z.object({
  email: z.email("That email address does not look right.").trim().max(320),
  website: z.string().max(0).optional().default(""),
});

type Result = { ok: boolean; message: string };

function respond(request: Request, status: number, result: Result): Response {
  const json =
    request.headers.get("accept")?.includes("application/json") ||
    request.headers.get("x-requested-with") === "fetch";
  if (json) {
    return new Response(JSON.stringify(result), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  const back = new URL(request.headers.get("referer") ?? "/blog", request.url);
  back.searchParams.set("subscribe", result.ok ? "ok" : "error");
  back.searchParams.set("reason", result.message);
  return Response.redirect(back.toString(), 303);
}

export const POST: APIRoute = async ({ request }) => {
  let raw: Record<string, string> = {};
  try {
    if ((request.headers.get("content-type") ?? "").includes("application/json")) {
      raw = (await request.json()) as Record<string, string>;
    } else {
      for (const [k, v] of (await request.formData()).entries())
        raw[k] = typeof v === "string" ? v : "";
    }
  } catch {
    return respond(request, 400, { ok: false, message: "I could not read that." });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return respond(request, 200, { ok: true, message: "Check your inbox to confirm." });
    }
    return respond(request, 400, {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the address.",
    });
  }
  const { email } = parsed.data;

  const key = env("BUTTONDOWN_API_KEY");
  if (!key) {
    missing(
      "BUTTONDOWN_API_KEY",
      "the newsletter is not live; sign-ups are refused with a clear message",
    );
    return respond(request, 503, {
      ok: false,
      message: "The newsletter is not live yet. Check back soon.",
    });
  }
  const res = await fetch("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: { Authorization: `Token ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email_address: email, type: "unactivated", tags: ["mjwalsh.net"] }),
  });
  if (!res.ok && res.status !== 400) {
    console.error(`Buttondown returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return respond(request, 502, {
      ok: false,
      message: "The newsletter service did not answer. Please try again later.",
    });
  }
  // 400 from Buttondown usually means the address already exists; that is fine to report as done.

  const db = secretClient();
  if (db) {
    const { error } = await db
      .from("subscribers")
      .upsert({ email, source: "site", status: "pending" }, { onConflict: "email" });
    if (error) console.error(`subscribers upsert failed: ${error.message}`);
  }
  return respond(request, 200, { ok: true, message: "Check your inbox to confirm." });
};

export const GET: APIRoute = () =>
  new Response("Send the subscribe form with POST.", { status: 405, headers: { Allow: "POST" } });
