// Server-side environment access for the Vercel functions. Reads process.env
// first (set in the Vercel project at runtime) and falls back to the values
// Astro inlined at build. Every caller treats a missing value as "feature
// off" and says so in one log line (section 8.4, and rule 2 of the build).

const seen = new Set<string>();

export function env(name: string): string | undefined {
  const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
  const value = fromProcess || (import.meta.env as Record<string, string | undefined>)[name];
  return value && value.trim() ? value.trim() : undefined;
}

/** Log once per missing variable per process, so the function log stays readable. */
export function missing(name: string, consequence: string): void {
  if (seen.has(name)) return;
  seen.add(name);
  console.info(`${name} is not set: ${consequence}`);
}
