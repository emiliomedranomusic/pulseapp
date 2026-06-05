"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useDemo } from "@/components/DemoProvider";
import { useDerivedStreak } from "@/components/useDerivedStreak";
import {
  getOrCreateProfile,
  resetAll,
  resetToday,
  seedWeek,
} from "@/lib/db";

export function DemoPanel() {
  const router = useRouter();
  const { session } = useAuth();
  const { todayStr, nextDay, prevDay, setDay, triggerRefresh } = useDemo();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileId = session?.user.id;
  const { streak } = useDerivedStreak(profileId);

  const runAction = useCallback(
    async (action: () => Promise<void>, resetOffset = false) => {
      if (!profileId) return;
      setBusy(true);
      setError(null);
      try {
        await action();
        if (resetOffset) setDay(0);
        triggerRefresh();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Demo action failed");
      } finally {
        setBusy(false);
      }
    },
    [profileId, setDay, triggerRefresh, router]
  );

  if (!session) return null;

  return (
    <div className="fixed bottom-6 left-4 z-[60] md:left-6">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border-2 border-dashed border-outline/50 bg-surface-container-lowest/90 px-4 py-2 font-label-md text-on-surface-variant shadow-sm backdrop-blur-sm hover:border-secondary"
        >
          🧪 Demo
        </button>
      ) : (
        <div className="w-72 rounded-card border-2 border-dashed border-outline/40 bg-surface-container-lowest p-4 soft-shadow">
          <div className="mb-3 flex items-start justify-between gap-2">
            <p className="font-label-lg text-label-lg text-secondary">Presenter tools</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-on-surface-variant hover:text-on-surface"
              aria-label="Close demo panel"
            >
              ✕
            </button>
          </div>
          <p className="mb-4 font-label-md text-label-md text-on-surface-variant">
            Simulated date: <strong className="text-on-surface">{todayStr}</strong>
            <br />
            Streak: <strong className="text-on-surface">{streak}</strong>
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={prevDay}
                className="flex-1 rounded-full bg-surface-container-high px-3 py-2 font-label-md hover:bg-secondary-container/50 disabled:opacity-50"
              >
                ← Prev day
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={nextDay}
                className="flex-1 rounded-full bg-surface-container-high px-3 py-2 font-label-md hover:bg-secondary-container/50 disabled:opacity-50"
              >
                Next day →
              </button>
            </div>
            <button
              type="button"
              disabled={busy || !profileId}
              onClick={() =>
                void runAction(async () => {
                  const p = await getOrCreateProfile(profileId!);
                  await resetToday(p.id);
                })
              }
              className="rounded-full bg-primary-fixed/60 px-4 py-2 font-label-md text-on-primary-fixed-variant hover:bg-primary-fixed disabled:opacity-50"
            >
              Reset today
            </button>
            <button
              type="button"
              disabled={busy || !profileId}
              onClick={() =>
                void runAction(async () => {
                  const p = await getOrCreateProfile(profileId!);
                  await seedWeek(p.id);
                })
              }
              className="rounded-full bg-tertiary-fixed/80 px-4 py-2 font-label-md text-on-tertiary-fixed-variant hover:bg-tertiary-fixed disabled:opacity-50"
            >
              Seed a week
            </button>
            <button
              type="button"
              disabled={busy || !profileId}
              onClick={() =>
                void runAction(async () => {
                  const p = await getOrCreateProfile(profileId!);
                  await resetAll(p.id);
                }, true)
              }
              className="rounded-full border border-error/30 bg-error-container/40 px-4 py-2 font-label-md text-on-error-container hover:bg-error-container/70 disabled:opacity-50"
            >
              Reset all
            </button>
          </div>
          {error ? <p className="mt-2 text-xs text-error">{error}</p> : null}
        </div>
      )}
    </div>
  );
}
