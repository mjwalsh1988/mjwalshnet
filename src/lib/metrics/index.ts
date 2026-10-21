// Live, sourced numbers (section 6.6). At build the site reads the public
// metrics view through the paging helper; if Supabase is not configured or
// the read fails, the committed snapshot is used and one line is logged. Days
// since the last post is computed from the content, not stored.
import snapshot from "../../data/metrics-snapshot.json";
import { fetchAll, publicClient } from "../server/supabase";

export type Metric = {
  key: string;
  value: number;
  label: string;
  source: string;
  asOf: string;
  live: boolean;
};

let cache: Promise<Metric[]> | undefined;

async function load(): Promise<Metric[]> {
  const fromSnapshot = (): Metric[] =>
    snapshot.metrics.map((m) => ({
      key: m.key,
      value: m.value,
      label: m.label,
      source: m.source,
      asOf: m.as_of,
      live: false,
    }));
  const db = publicClient();
  if (!db) return fromSnapshot();
  try {
    const rows = await fetchAll(() => db.from("site_metrics_public").select("*"), "key");
    if (!rows.length) {
      console.info("site_metrics_public is empty: using the committed snapshot");
      return fromSnapshot();
    }
    return rows.map((r) => ({
      key: r.key ?? "",
      value: Number(r.value ?? 0),
      label: r.label ?? "",
      source: r.source ?? "",
      asOf: (r.as_of ?? "").slice(0, 10),
      live: true,
    }));
  } catch (error) {
    console.info(`metrics read failed (${(error as Error).message}): using the committed snapshot`);
    return fromSnapshot();
  }
}

export function getMetrics(): Promise<Metric[]> {
  if (!cache) cache = load();
  return cache;
}

export async function getMetric(key: string): Promise<Metric | undefined> {
  return (await getMetrics()).find((m) => m.key === key);
}

export function formatValue(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function daysSince(date: Date, now = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / 86_400_000));
}
