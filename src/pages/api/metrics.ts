// The metrics refresh (sections 6.6, 8.1, 12). Vercel's cron sends a GET with
// "Authorization: Bearer <CRON_SECRET>"; nothing else is accepted. Each
// source that has its key runs, the results are upserted into site_metrics
// (one row per metric), and the production deploy hook is posted so the new
// figures are baked into the static pages. Every missing key turns its step
// off with one log line and the function still answers.
import type { APIRoute } from "astro";
import { createSign } from "node:crypto";
import { env, missing } from "../../lib/server/env";
import { secretClient } from "../../lib/server/supabase";

export const prerender = false;

type MetricRow = { key: string; value: number; label: string; source: string; as_of: string };

/** OAuth access token for a service account, signed with its private key. No SDK needed. */
async function googleAccessToken(serviceAccountJson: string, scope: string): Promise<string> {
  const account = JSON.parse(serviceAccountJson) as { client_email: string; private_key: string };
  const now = Math.floor(Date.now() / 1000);
  const base64url = (input: string | Buffer) =>
    Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64url(signer.sign(account.private_key));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token request failed: ${res.status}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

/** FF Beacon recorded no search data before this date, so it stands in for the launch. */
const FF_BEACON_LAUNCH = "2026-06-01";

/** FF Beacon clicks and impressions since launch from Search Console. */
async function searchConsole(): Promise<MetricRow[]> {
  const json = env("GSC_SERVICE_ACCOUNT_JSON");
  if (!json) {
    missing("GSC_SERVICE_ACCOUNT_JSON", "Search Console figures are not refreshed");
    return [];
  }
  const token = await googleAccessToken(
    json,
    "https://www.googleapis.com/auth/webmasters.readonly",
  );
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2); // Search Console data lags about two days.
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const site = encodeURIComponent("sc-domain:ffbeacon.com");
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: FF_BEACON_LAUNCH, endDate: iso(end), dimensions: [] }),
    },
  );
  if (!res.ok)
    throw new Error(
      `Search Console query failed: ${res.status} ${(await res.text()).slice(0, 200)}`,
    );
  const data = (await res.json()) as { rows?: { clicks: number; impressions: number }[] };
  const row = data.rows?.[0];
  if (!row) return [];
  const asOf = `${iso(end)}T00:00:00Z`;
  const source = "Search Console, all time";
  return [
    {
      key: "ffbeacon_gsc_impressions_total",
      value: Math.round(row.impressions),
      label: "FF Beacon impressions",
      source,
      as_of: asOf,
    },
    {
      key: "ffbeacon_gsc_clicks_total",
      value: Math.round(row.clicks),
      label: "FF Beacon clicks",
      source,
      as_of: asOf,
    },
  ];
}

const todayAsOf = () => `${new Date().toISOString().slice(0, 10)}T00:00:00Z`;

/** FF Beacon's Discord member count from the public invite, which needs no bot token. */
async function discord(): Promise<MetricRow[]> {
  const code = env("FFBEACON_DISCORD_INVITE") ?? "scrhgHNWfe";
  const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`);
  if (!res.ok) throw new Error(`Discord invite lookup failed: ${res.status}`);
  const data = (await res.json()) as { approximate_member_count?: number };
  if (typeof data.approximate_member_count !== "number") return [];
  return [
    {
      key: "ffbeacon_discord_members",
      value: data.approximate_member_count,
      label: "FF Beacon Discord members",
      source: "Discord",
      as_of: todayAsOf(),
    },
  ];
}

/**
 * Leagues synced into FF Beacon, counted with the project's publishable key.
 * The leagues table is readable by anyone, so the key can only read.
 */
async function ffbeaconLeagues(): Promise<MetricRow[]> {
  const url = env("FFBEACON_SUPABASE_URL");
  const key = env("FFBEACON_SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) {
    missing(
      "FFBEACON_SUPABASE_URL and FFBEACON_SUPABASE_PUBLISHABLE_KEY",
      "the leagues synced figure is not refreshed",
    );
    return [];
  }
  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/leagues?select=id`, {
    method: "HEAD",
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
  });
  if (!res.ok) throw new Error(`FF Beacon leagues count failed: ${res.status}`);
  const total = Number(res.headers.get("content-range")?.split("/")[1]);
  if (!Number.isFinite(total)) return [];
  return [
    {
      key: "ffbeacon_leagues_synced",
      value: total,
      label: "FF Beacon leagues synced",
      source: "FF Beacon database",
      as_of: todayAsOf(),
    },
  ];
}

export const GET: APIRoute = async ({ request }) => {
  const secret = env("CRON_SECRET");
  if (!secret) {
    missing("CRON_SECRET", "the metrics function refuses every call until it is set");
    return new Response("Not configured", { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows: MetricRow[] = [];
  const errors: string[] = [];
  for (const [name, source] of [
    ["searchConsole", searchConsole],
    ["discord", discord],
    ["ffbeaconLeagues", ffbeaconLeagues],
  ] as const) {
    try {
      rows.push(...(await source()));
    } catch (error) {
      errors.push(`${name}: ${(error as Error).message}`);
      console.error(`metrics ${name} failed: ${(error as Error).message}`);
    }
  }
  let written = 0;
  const db = secretClient();
  if (db && rows.length) {
    const { error } = await db.from("site_metrics").upsert(rows, { onConflict: "key" });
    if (error) errors.push(`upsert: ${error.message}`);
    else written = rows.length;
  }

  let deployed = false;
  const hook = env("VERCEL_DEPLOY_HOOK_URL");
  if (!hook) missing("VERCEL_DEPLOY_HOOK_URL", "no rebuild is triggered after a metrics refresh");
  else if (written > 0) {
    const res = await fetch(hook, { method: "POST" });
    deployed = res.ok;
    if (!res.ok) errors.push(`deploy hook: ${res.status}`);
  }

  return new Response(JSON.stringify({ ok: errors.length === 0, written, deployed, errors }), {
    status: errors.length ? 207 : 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
};
