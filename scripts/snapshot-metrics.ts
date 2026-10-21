// Refreshes src/data/metrics-snapshot.json from the public metrics view, so
// the committed fallback stays close to the live numbers. Needs SUPABASE_URL
// and SUPABASE_PUBLISHABLE_KEY in the environment; without them it says so and
// leaves the file alone.
//   npx tsx scripts/snapshot-metrics.ts
import { readFileSync, writeFileSync } from "node:fs";
import { fetchAll, publicClient } from "../src/lib/server/supabase";

const file = "src/data/metrics-snapshot.json";
const db = publicClient();
if (!db) {
  console.log("snapshot-metrics: Supabase is not configured here; the snapshot is unchanged.");
  process.exit(0);
}
const rows = await fetchAll(() => db.from("site_metrics_public").select("*"), "key");
if (!rows.length) {
  console.log("snapshot-metrics: the view is empty; the snapshot is unchanged.");
  process.exit(0);
}
const current = JSON.parse(readFileSync(file, "utf8")) as { note: string };
const next = {
  snapshotTakenAt: new Date().toISOString().slice(0, 10),
  note: current.note,
  metrics: rows.map((r) => ({
    key: r.key,
    value: Number(r.value),
    label: r.label,
    source: r.source,
    as_of: (r.as_of ?? "").slice(0, 10),
  })),
};
writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
console.log(`snapshot-metrics: wrote ${rows.length} metrics to ${file}`);
