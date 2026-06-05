"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDemo } from "@/components/DemoProvider";
import { AppShell } from "@/components/AppShell";
import { CharacterSprite } from "@/components/CharacterSprite";
import { JournalEntryCard } from "@/components/JournalEntryCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { getJournalEntries } from "@/lib/db";
import type { JournalEntry, JournalEntryType, Profile } from "@/lib/types";

const FILTERS: { id: "all" | JournalEntryType; label: string }[] = [
  { id: "all", label: "All Entries" },
  { id: "milestone", label: "Milestones" },
  { id: "gratitude", label: "Gratitude" },
  { id: "reflection", label: "Reflection" },
];

export default function JournalPage() {
  return (
    <AppShell>
      {({ profile }) => <JournalContent profile={profile} />}
    </AppShell>
  );
}

function JournalContent({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<"all" | JournalEntryType>("all");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const { refreshKey } = useDemo();
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 4;

  const loadPage = useCallback(
    async (nextOffset: number, append: boolean) => {
      setLoading(true);
      try {
        const data = await getJournalEntries(
          profile.id,
          pageSize,
          nextOffset,
          filter === "all" ? undefined : filter
        );
        setEntries((prev) => (append ? [...prev, ...data] : data));
        setHasMore(data.length === pageSize);
        setOffset(nextOffset + data.length);
      } finally {
        setLoading(false);
      }
    },
    [profile.id, filter]
  );

  useEffect(() => {
    setOffset(0);
    void loadPage(0, false);
  }, [filter, loadPage, refreshKey]);

  return (
    <main className="relative mx-auto w-full max-w-content px-margin-mobile pb-24 pt-stack-md md:px-margin-desktop md:py-stack-lg">
      <header className="mb-stack-lg flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-display text-on-surface mb-2">Looking back</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Reflection is the gentle way to grow.
          </p>
        </div>
        {/* TODO: stretch — Monthly Growth stat when sufficient end_mood_score history */}
      </header>

      <div className="no-scrollbar mb-stack-md flex gap-3 overflow-x-auto pb-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-6 py-2 font-label-lg transition-transform active:scale-95 ${
              filter === f.id
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {entries.length === 0 && !loading ? (
        <div className="flex flex-col items-center gap-stack-md py-stack-lg text-center">
          <CharacterSprite state="idle" />
          <p className="font-body-lg text-on-surface-variant">
            No entries yet — your story starts today.
          </p>
          <Link href="/journal/new">
            <PrimaryButton>Write your first note</PrimaryButton>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
            {entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
          {hasMore ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => void loadPage(offset, true)}
              className="mx-auto mt-stack-lg block rounded-full bg-surface-container-high px-8 py-3 font-label-lg text-on-surface-variant hover:bg-secondary-container/40 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Show more memories"}
            </button>
          ) : null}
        </>
      )}

      <Link
        href="/journal/new"
        className="fixed bottom-8 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-on-primary soft-shadow md:right-12"
        aria-label="New journal entry"
      >
        ✏️
      </Link>
    </main>
  );
}
