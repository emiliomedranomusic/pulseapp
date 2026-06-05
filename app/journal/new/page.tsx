"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CharacterSprite } from "@/components/CharacterSprite";
import { MoodPicker } from "@/components/MoodPicker";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SoftCard } from "@/components/ui/SoftCard";
import { createJournalEntry } from "@/lib/db";
import { JOURNAL_PROMPTS } from "@/lib/journalPrompts";
import type { MoodSlug } from "@/lib/moods";

function JournalNewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moodMode = searchParams.get("mode") === "mood";
  const promptRandom = searchParams.get("prompt") === "random";

  const [mood, setMood] = useState<MoodSlug | null>(null);
  const [note, setNote] = useState("");
  const [showTextarea, setShowTextarea] = useState(!moodMode);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryApplied, setQueryApplied] = useState(false);

  useEffect(() => {
    if (queryApplied) return;
    if (promptRandom) {
      const pick = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)];
      setNote(pick);
    }
    if (moodMode) {
      setShowTextarea(false);
    }
    setQueryApplied(true);
  }, [promptRandom, moodMode, queryApplied]);

  const canSave = Boolean(note.trim() || mood);

  return (
    <AppShell>
      {({ profile }) => (
        <main className="mx-auto grid w-full max-w-content gap-stack-lg px-margin-mobile py-stack-md md:grid-cols-2 md:px-margin-desktop md:py-stack-lg">
          <section className="flex flex-col items-center justify-center gap-stack-md text-center md:items-start md:text-left">
            <CharacterSprite state="content" size="large" />
            <h1 className="font-display text-headline-lg-mobile text-on-surface md:text-display">
              Anything on your mind?
            </h1>
            <p className="max-w-sm font-body-lg text-body-lg text-on-surface-variant">
              Take a moment to breathe and let your thoughts flow onto the page.
            </p>
          </section>

          <SoftCard className="space-y-stack-md">
            <MoodPicker
              selected={mood}
              onSelect={setMood}
              label="HOW ARE YOU FEELING?"
            />

            {showTextarea ? (
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Start typing here…"
                  rows={8}
                  className="w-full resize-none rounded-[20px] border-2 border-outline-variant/50 bg-surface px-6 py-4 font-body-md text-on-surface focus:border-primary-container focus:outline-none focus:ring-4 focus:ring-primary-container/15"
                />
                <p className="mt-2 text-right font-label-md text-label-md text-on-surface-variant">
                  {note.length} characters
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowTextarea(true)}
                className="w-full rounded-[20px] border-2 border-dashed border-outline-variant/40 px-6 py-8 font-body-md text-on-surface-variant transition-colors hover:border-primary-container/50 hover:bg-surface-container-low"
              >
                Tap to add a note (optional)
              </button>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="cursor-pointer rounded-full bg-surface-container px-4 py-2 font-label-lg text-secondary hover:bg-secondary-container">
                Add photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // TODO: stretch — upload to Supabase Storage; preview only for now
                    setPhotoPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              <Link href="/journal" className="font-body-md text-on-surface-variant underline">
                Skip
              </Link>
              <PrimaryButton
                disabled={saving || !canSave}
                onClick={async () => {
                  setSaving(true);
                  setError(null);
                  try {
                    await createJournalEntry(profile.id, {
                      note: note.trim() || "Quick mood log",
                      mood: mood ?? undefined,
                      photoUrl: photoPreview,
                      entryType: "reflection",
                    });
                    router.push("/journal");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Could not save");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Saving…" : "Save note"}
              </PrimaryButton>
            </div>

            {photoPreview ? (
              <div className="relative h-32 w-full overflow-hidden rounded-card">
                <Image src={photoPreview} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            ) : null}

            {error ? <p className="text-sm text-error">{error}</p> : null}

            <div>
              <p className="mb-3 font-label-lg text-label-lg uppercase tracking-widest text-on-surface-variant">
                Prompts for you
              </p>
              <div className="flex flex-col gap-2">
                {JOURNAL_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setShowTextarea(true);
                      setNote((n) => (n ? `${n}\n\n${prompt}` : prompt));
                    }}
                    className="rounded-full bg-surface-container-high px-4 py-3 text-left font-body-md text-on-surface-variant transition-colors hover:bg-secondary-container/50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </SoftCard>
        </main>
      )}
    </AppShell>
  );
}

export default function JournalNewPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <p className="text-on-surface-variant">Loading…</p>
        </main>
      }
    >
      <JournalNewForm />
    </Suspense>
  );
}
