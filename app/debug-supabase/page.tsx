"use client";

import { useCallback, useState } from "react";
import { formatAuthError } from "@/lib/auth-errors";
import { getSupabaseEnvDiagnostics } from "@/lib/supabase-config";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type DebugResult = {
  label: string;
  ok: boolean;
  detail: string;
};

export default function DebugSupabasePage() {
  const env = getSupabaseEnvDiagnostics();
  const [results, setResults] = useState<DebugResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = useCallback(async () => {
    setRunning(true);
    const next: DebugResult[] = [];

    next.push({
      label: "Env URL loaded",
      ok: env.urlLoaded,
      detail: env.url,
    });
    next.push({
      label: "Env key loaded",
      ok: env.keyLoaded,
      detail: env.keyPrefix,
    });
    next.push({
      label: "Project ref (from URL)",
      ok: Boolean(env.projectRef),
      detail: env.projectRef ?? "Could not parse",
    });

    if (!isSupabaseConfigured()) {
      next.push({
        label: "Supabase client",
        ok: false,
        detail: "Missing env vars",
      });
      setResults(next);
      setRunning(false);
      return;
    }

    try {
      const supabase = getSupabase();

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      next.push({
        label: "getSession()",
        ok: !sessionError,
        detail: sessionError
          ? sessionError.message
          : sessionData.session
            ? `user ${sessionData.session.user.id.slice(0, 8)}… (anonymous: ${String(sessionData.session.user.is_anonymous)})`
            : "no session",
      });

      if (!sessionData.session) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInAnonymously();
        if (signInError) {
          console.error("[debug] signInAnonymously:", signInError);
          const formatted = formatAuthError(
            signInError,
            process.env.NEXT_PUBLIC_SUPABASE_URL
          );
          next.push({
            label: "signInAnonymously()",
            ok: false,
            detail: `${formatted.code ?? "error"} (${formatted.status ?? "?"}): ${signInError.message}`,
          });
        } else {
          next.push({
            label: "signInAnonymously()",
            ok: true,
            detail: `Created user ${signInData.user?.id?.slice(0, 8)}… — check Authentication → Users in dashboard`,
          });
        }
      } else {
        next.push({
          label: "signInAnonymously()",
          ok: true,
          detail: "Skipped — session already exists",
        });
      }
    } catch (e) {
      const formatted = formatAuthError(
        e,
        process.env.NEXT_PUBLIC_SUPABASE_URL
      );
      next.push({
        label: "Unexpected error",
        ok: false,
        detail: formatted.message,
      });
    }

    setResults(next);
    setRunning(false);
  }, [env]);

  return (
    <main className="flex min-h-dvh flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold">Supabase debug</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Use this page to confirm env vars match the project where you enabled
          anonymous sign-ins.
        </p>
      </div>

      <button
        type="button"
        onClick={runTests}
        disabled={running}
        className="rounded-2xl bg-cta px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {running ? "Running…" : "Run auth tests"}
      </button>

      <ul className="flex flex-col gap-3">
        {results.map((r) => (
          <li
            key={r.label}
            className={`rounded-2xl px-4 py-3 text-sm ${r.ok ? "bg-mint/40" : "bg-peach/50"}`}
          >
            <span className="font-medium">{r.ok ? "✓" : "✗"} {r.label}</span>
            <pre className="mt-1 whitespace-pre-wrap break-words font-sans text-foreground/80">
              {r.detail}
            </pre>
          </li>
        ))}
      </ul>

      <a href="/" className="text-center text-sm text-cta underline">
        Back to Pulse
      </a>
    </main>
  );
}
