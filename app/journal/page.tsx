"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDemo } from "@/components/DemoProvider";
import { AppShell } from "@/components/AppShell";
import { CharacterSprite } from "@/components/CharacterSprite";
import { JournalBottomNav } from "@/components/JournalBottomNav";
import { MaterialIcon } from "@/components/MaterialIcon";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getJournalEntries } from "@/lib/db";
import {
  computeWeeklyGrowth,
  countEntriesInMonth,
} from "@/lib/journalGrowth";
import { getMood } from "@/lib/moods";
import type { JournalEntry, Profile } from "@/lib/types";

const PAGE_SIZE = 5;
const STATS_LIMIT = 200;

const TAG_STYLES = [
  "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  "bg-secondary-fixed text-on-secondary-fixed-variant",
  "bg-primary-fixed text-on-primary-fixed-variant",
] as const;

function formatDateStamp(dateStr: string): { month: string; day: string } {
  const d = new Date(`${dateStr}T12:00:00`);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.getDate().toString(),
  };
}

function JournalEntryRow({ entry }: { entry: JournalEntry }) {
  const { month, day } = formatDateStamp(entry.entry_date);
  const start = getMood(entry.mood);
  const end = getMood(entry.end_mood);
  const excerpt = entry.note?.trim() ?? "";

  return (
    <article className="rounded-[28px] border border-surface-container-low bg-surface-container-lowest p-5 soft-shadow">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-secondary-fixed-dim/20 text-secondary">
          <span className="font-label-lg text-[10px] leading-none">{month}</span>
          <span className="font-headline-md text-lg leading-none">{day}</span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          {(start || end) ? (
            <div className="flex items-center gap-2">
              {start ? <span className="text-2xl">{start.emoji}</span> : null}
              {start && end && end.slug !== start.slug ? (
                <>
                  <span className="font-body-md text-on-surface-variant">→</span>
                  <span className="text-2xl">{end.emoji}</span>
                </>
              ) : null}
              {!start && end ? <span className="text-2xl">{end.emoji}</span> : null}
            </div>
          ) : null}
          {excerpt ? (
            <p className="line-clamp-2 font-body-md text-body-md italic text-on-surface-variant">
              &ldquo;{excerpt}&rdquo;
            </p>
          ) : null}
          {entry.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`rounded-full px-3 py-1 font-label-md ${TAG_STYLES[i % TAG_STYLES.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EmptyStateHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-cream px-margin-mobile md:hidden">
      <div className="flex items-center gap-2">
        <MaterialIcon name="cloud" className="text-2xl text-primary" />
        <span className="font-display text-display text-primary tracking-tight">Pulse</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 text-on-surface-variant transition-transform active:scale-95"
        >
          <MaterialIcon name="notifications" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="p-2 text-on-surface-variant transition-transform active:scale-95"
        >
          <MaterialIcon name="settings" />
        </button>
      </div>
    </header>
  );
}

function PopulatedStateHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-cream px-margin-mobile md:hidden">
      <h1 className="font-headline-md text-headline-md text-primary">Looking back</h1>
      <button
        type="button"
        aria-label="Calendar"
        className="p-2 text-secondary transition-transform active:scale-95"
      >
        <MaterialIcon name="calendar_today" />
      </button>
    </header>
  );
}

function JournalEmptyState() {
  return (
    <>
      <EmptyStateHeader />
      <div className="mx-auto w-full max-w-md space-y-stack-lg px-margin-mobile pb-36 pt-4 text-center md:max-w-xl md:pb-24 md:pt-stack-md">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
          Looking back
        </h2>

        <div className="relative flex justify-center py-stack-sm">
          <div
            className="absolute inset-0 scale-75 rounded-full bg-secondary-container/20 opacity-50 blur-3xl"
            aria-hidden
          />
          <CharacterSprite state="idle" size="large" className="relative" />
        </div>

        <div className="space-y-stack-sm px-2">
          <p className="font-headline-md text-headline-md text-on-secondary-container">
            No entries yet — your story starts today.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant opacity-70">
            Take a moment to check in with yourself. Every small reflection is a step towards
            understanding.
          </p>
        </div>

        <Link href="/journal/new" className="block pt-stack-sm">
          <PrimaryButton fullWidth className="gap-2 shadow-lg">
            <MaterialIcon name="add_circle" />
            + Create Your First Entry
          </PrimaryButton>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/journal/new?prompt=random"
            className="flex flex-col items-start gap-2 rounded-2xl bg-surface-container p-stack-md transition-transform active:scale-95 hover:-translate-y-1"
          >
            <MaterialIcon name="lightbulb" className="text-primary" filled />
            <span className="text-left font-label-md text-label-md">Daily Prompt</span>
          </Link>
          <Link
            href="/journal/new?mode=mood"
            className="flex flex-col items-start gap-2 rounded-2xl bg-tertiary-container/20 p-stack-md transition-transform active:scale-95 hover:-translate-y-1"
          >
            <MaterialIcon name="mood" className="text-tertiary" filled />
            <span className="text-left font-label-md text-label-md">Quick Mood Log</span>
          </Link>
        </div>
      </div>
      <JournalBottomNav />
    </>
  );
}

function JournalPopulatedState({
  profile,
  entries,
  statsEntries,
  loading,
  hasMore,
  onLoadMore,
}: {
  profile: Profile;
  entries: JournalEntry[];
  statsEntries: JournalEntry[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const { todayStr } = useDemo();
  const name = profile.name?.trim() || "friend";
  const growth = computeWeeklyGrowth(statsEntries, todayStr);
  const monthCount = countEntriesInMonth(statsEntries, todayStr);

  return (
    <>
      <PopulatedStateHeader />
      <div className="relative mx-auto w-full max-w-md px-margin-mobile pb-36 pt-4 md:max-w-xl md:pb-28 md:pt-stack-md">
        <header className="mb-stack-md hidden items-center justify-between md:flex">
          <h1 className="font-headline-md text-headline-md text-primary">Looking back</h1>
          <button
            type="button"
            aria-label="Calendar"
            className="p-2 text-secondary transition-transform active:scale-95"
          >
            <MaterialIcon name="calendar_today" />
          </button>
        </header>

        <div className="mb-stack-lg space-y-stack-md">
          <div className="rounded-[28px] border border-secondary-container/20 bg-secondary-container/30 p-stack-md soft-shadow">
            <span className="font-label-lg text-label-lg uppercase tracking-widest text-secondary">
              Monthly Growth
            </span>
            {growth.computable && growth.headline ? (
              <h2 className="mt-2 font-headline-lg-mobile text-headline-lg-mobile text-on-secondary-container md:font-headline-lg md:text-headline-lg">
                {growth.headline}
              </h2>
            ) : (
              <div className="mt-stack-sm flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-tertiary-container text-base">
                    😊
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-primary-container text-base">
                    💛
                  </span>
                </div>
                <p className="font-headline-md text-headline-md text-on-secondary-container">
                  Keep going, {name}!
                </p>
              </div>
            )}
            {growth.computable ? (
              <div className="mt-stack-sm flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-tertiary-container text-base">
                    😊
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-primary-container text-base">
                    💛
                  </span>
                </div>
                <p className="font-body-md text-secondary">Keep going, {name}!</p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-center rounded-[28px] border border-surface-container-highest bg-surface-container-high p-stack-md text-center soft-shadow">
            <div className="mb-stack-sm flex h-16 w-16 items-center justify-center rounded-full bg-secondary-fixed">
              <MaterialIcon name="auto_stories" className="text-3xl text-secondary" />
            </div>
            <p className="font-headline-md text-headline-md text-on-surface">{monthCount}</p>
            <p className="font-label-md text-label-md text-secondary">Entries this month</p>
          </div>
        </div>

        <div className="space-y-6">
          {entries.map((entry) => (
            <JournalEntryRow key={entry.id} entry={entry} />
          ))}
        </div>

        {hasMore ? (
          <div className="relative mt-stack-lg flex items-center justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={onLoadMore}
              className="rounded-full border-2 border-dashed border-secondary-container/40 px-8 py-4 font-label-lg text-label-lg uppercase tracking-wide text-secondary transition-colors hover:bg-secondary-container/10 disabled:opacity-50"
            >
              {loading ? "Loading…" : "SEE OLDER MEMORIES"}
            </button>
            <Link
              href="/journal/new"
              className="fixed bottom-28 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-10"
              aria-label="New journal entry"
            >
              <MaterialIcon name="add" className="text-3xl" />
            </Link>
          </div>
        ) : (
          <Link
            href="/journal/new"
            className="fixed bottom-28 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-10"
            aria-label="New journal entry"
          >
            <MaterialIcon name="add" className="text-3xl" />
          </Link>
        )}
      </div>
      <JournalBottomNav />
    </>
  );
}

function JournalContent({ profile }: { profile: Profile }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [statsEntries, setStatsEntries] = useState<JournalEntry[]>([]);
  const { refreshKey } = useDemo();
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const loadPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      setLoading(true);
      try {
        const data = await getJournalEntries(profile.id, PAGE_SIZE, nextOffset);
        setEntries((prev) => (append ? [...prev, ...data] : data));
        setHasMore(data.length === PAGE_SIZE);
        setOffset(nextOffset + data.length);
      } finally {
        setLoading(false);
      }
    },
    [profile.id]
  );

  useEffect(() => {
    let cancelled = false;
    setInitializing(true);
    setOffset(0);

    void (async () => {
      const stats = await getJournalEntries(profile.id, STATS_LIMIT, 0);
      if (cancelled) return;
      setStatsEntries(stats);

      if (stats.length === 0) {
        setEntries([]);
        setHasMore(false);
        setInitializing(false);
        return;
      }

      await loadPage(0, false);
      if (!cancelled) setInitializing(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadPage, profile.id, refreshKey]);

  if (initializing) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-margin-mobile">
        <p className="font-body-md text-on-surface-variant">Loading your memories…</p>
      </div>
    );
  }

  if (statsEntries.length === 0) {
    return <JournalEmptyState />;
  }

  return (
    <JournalPopulatedState
      profile={profile}
      entries={entries}
      statsEntries={statsEntries}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={() => void loadPage(offset, true)}
    />
  );
}

export default function JournalPage() {
  return (
    <AppShell hideNavOnMobile>
      {({ profile }) => <JournalContent profile={profile} />}
    </AppShell>
  );
}
