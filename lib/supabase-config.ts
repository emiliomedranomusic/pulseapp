/** Safe diagnostics — never expose full API keys. */

export function getSupabaseProjectRef(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

export function getKeyPrefix(key: string): string {
  if (!key) return "(empty)";
  if (key.startsWith("sb_publishable_")) return `sb_publishable_…${key.slice(-4)}`;
  if (key.startsWith("eyJ")) return `jwt…${key.slice(-4)}`;
  return `…${key.slice(-4)}`;
}

export function getSupabaseEnvDiagnostics(): {
  urlLoaded: boolean;
  keyLoaded: boolean;
  url: string;
  projectRef: string | null;
  keyPrefix: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return {
    urlLoaded: Boolean(url),
    keyLoaded: Boolean(key),
    url: url || "(not set)",
    projectRef: url ? getSupabaseProjectRef(url) : null,
    keyPrefix: getKeyPrefix(key),
  };
}

/** User-facing steps when Supabase returns anonymous_provider_disabled. */
export function anonymousSignInHelpMessage(projectRef: string | null): string {
  const ref = projectRef ?? "your-project";
  return [
    "Anonymous sign-ins are off for this Supabase project.",
    "",
    `Project in .env.local: ${ref}`,
    "",
    "Fix in the dashboard (same project as the URL above):",
    "1. Authentication → Sign In / Up (or General)",
    '2. Turn on "Allow anonymous sign-ins"',
    "3. Save — then restart npm run dev and hard-refresh the browser",
    "",
    "No email login needed for the demo — just enable this toggle.",
  ].join("\n");
}
