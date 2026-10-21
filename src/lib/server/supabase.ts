// Supabase access for the server routes and the build. Two clients: the
// public one (publishable key, reads the public view only) and the secret one
// (server routes only, never shipped to the browser). Every read goes through
// fetchAll, which pages with range() and orders by a unique column, per the
// house rule, even where a table cannot reach 1000 rows today.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../supabase/types/database";
import { env, missing } from "./env";

export type Db = SupabaseClient<Database>;

const PAGE_SIZE = 1000;

export function publicClient(): Db | null {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !key) {
    missing(
      url ? "SUPABASE_PUBLISHABLE_KEY" : "SUPABASE_URL",
      "live reads are off, the committed snapshot is used",
    );
    return null;
  }
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

export function secretClient(): Db | null {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SECRET_KEY");
  if (!url || !key) {
    missing(url ? "SUPABASE_SECRET_KEY" : "SUPABASE_URL", "server writes are off");
    return null;
  }
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

type Query<T> = {
  order: (column: string, options?: { ascending?: boolean }) => Query<T>;
  range: (
    from: number,
    to: number,
  ) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>;
};

/**
 * Read every row of a query, a page at a time, until a page comes back
 * shorter than the page size. `uniqueColumn` is added as the final ordering so
 * pages never skip or repeat rows.
 */
export async function fetchAll<T>(
  build: () => Query<T>,
  uniqueColumn: string,
  pageSize = PAGE_SIZE,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await build()
      .order(uniqueColumn, { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    const page = data ?? [];
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}
