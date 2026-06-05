"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AppNav } from "@/components/AppNav";
import { useDerivedStreak } from "@/components/useDerivedStreak";
import { getOrCreateProfile } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

interface AppShellProps {
  children: (ctx: { profile: Profile; refetch: () => Promise<void> }) => React.ReactNode;
  hideNavLinks?: boolean;
  /** Journal mobile layout supplies its own header; desktop keeps AppNav. */
  hideNavOnMobile?: boolean;
}

export function AppShell({ children, hideNavLinks, hideNavOnMobile }: AppShellProps) {
  const { session, ready, error: authError, retry } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { streak } = useDerivedStreak(profile?.id);

  const refetch = useCallback(async () => {
    if (!session?.user.id) return;
    setLoadError(null);
    try {
      const p = await getOrCreateProfile(session.user.id);
      setProfile(p);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Could not load profile");
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (!ready || !session?.user.id || !isSupabaseConfigured()) return;
    void refetch();
  }, [ready, session?.user.id, refetch]);

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="font-body-lg text-on-surface-variant">Pulse is waking up…</p>
      </main>
    );
  }

  if (!isSupabaseConfigured() || authError) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-margin-mobile text-center">
        <p className="whitespace-pre-wrap text-sm text-on-surface-variant">{authError}</p>
        <button type="button" onClick={retry} className="rounded-full bg-primary px-6 py-3 text-on-primary">
          Try again
        </button>
      </main>
    );
  }

  if (!session || !profile) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-on-surface-variant">{loadError ?? "Loading…"}</p>
      </main>
    );
  }

  return (
    <>
      <AppNav
        profile={profile}
        streak={streak}
        hideLinks={hideNavLinks}
        hideOnMobile={hideNavOnMobile}
      />
      {children({ profile, refetch })}
    </>
  );
}
