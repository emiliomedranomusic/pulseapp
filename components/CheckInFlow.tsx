"use client";

import { useCallback, useEffect, useState } from "react";
import { useToday } from "@/components/DemoProvider";
import { activityCompanionLine, indoorOutdoorHint } from "@/lib/activities";
import {
  completeCheckIn,
  createJournalEntry,
  getSuggestedActivities,
  upsertTodayCheckin,
} from "@/lib/db";
import { getCompanionLine } from "@/lib/dialogue";
import { isMoodSlug, scoreFromMoodSlug } from "@/lib/moods";
import type { Activity, Checkin, CheckInStep, Profile } from "@/lib/types";
import type { MoodSlug } from "@/lib/moods";
import { CompanionShell } from "./CompanionShell";
import { MoodPicker } from "./MoodPicker";
import { PrimaryButton } from "./ui/PrimaryButton";
import { SoftCard } from "./ui/SoftCard";

function initialStep(
  checkin: Checkin | null,
  profile: Profile,
  todayStr: string
): CheckInStep | null {
  if (!checkin) return "mood-in";
  if (checkin.completed && checkin.end_mood) {
    if (profile.last_checkin_date !== todayStr) return "farewell";
    return null;
  }
  if (checkin.completed) return null;
  if (checkin.activity_slug || checkin.suggested_activity) return "activity";
  if (checkin.start_mood && isMoodSlug(checkin.start_mood)) return "activity";
  return "mood-in";
}

interface CheckInFlowProps {
  profile: Profile;
  checkin: Checkin | null;
  onUpdate: () => void;
  onExit: () => void;
}

export function CheckInFlow({
  profile,
  checkin,
  onUpdate,
  onExit,
}: CheckInFlowProps) {
  const todayStr = useToday();
  const pet = profile.pet_name || "Pulse";
  const [step, setStep] = useState<CheckInStep>(
    () => initialStep(checkin, profile, todayStr) ?? "mood-in"
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Activity | null>(null);
  const [excludeSlugs, setExcludeSlugs] = useState<string[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const startMoodSlug: MoodSlug | null =
    checkin?.start_mood && isMoodSlug(checkin.start_mood)
      ? checkin.start_mood
      : null;

  const loadActivity = useCallback(
    async (mood: MoodSlug, exclude: string[]) => {
      setLoadingActivity(true);
      setError(null);
      try {
        const suggestions = await getSuggestedActivities(mood, 1, exclude);
        const top = suggestions[0];
        if (!top) {
          setError("No activities found for this mood yet.");
          return;
        }
        setChosen(top);
        await upsertTodayCheckin(profile.id, {
          start_mood: mood,
          start_mood_score: scoreFromMoodSlug(mood),
          activity_slug: top.activity_slug,
          suggested_activity: `${top.title} — ${top.description}`,
        });
        onUpdate();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoadingActivity(false);
      }
    },
    [profile.id, onUpdate]
  );

  useEffect(() => {
    if (step !== "activity" || chosen || !startMoodSlug) return;
    const slug = checkin?.activity_slug;
    if (slug && checkin?.suggested_activity) {
      setChosen({
        activity_id: 0,
        activity_slug: slug,
        title: checkin.suggested_activity.split(" — ")[0] ?? slug,
        description: checkin.suggested_activity.split(" — ").slice(1).join(" — ") || "",
        category_slug: "",
        duration_min_minutes: 5,
        duration_max_minutes: 15,
        energy_level: "low",
        indoor: true,
        outdoor: false,
      });
      return;
    }
    void loadActivity(startMoodSlug, excludeSlugs);
  }, [step, chosen, startMoodSlug, checkin, excludeSlugs, loadActivity]);

  const handleMoodIn = useCallback(
    async (mood: MoodSlug) => {
      setBusy(true);
      setError(null);
      setExcludeSlugs([]);
      setChosen(null);
      try {
        await loadActivity(mood, []);
        setStep("activity");
      } finally {
        setBusy(false);
      }
    },
    [loadActivity]
  );

  const handleShuffle = useCallback(async () => {
    if (!startMoodSlug) return;
    const nextExclude = chosen
      ? [...excludeSlugs, chosen.activity_slug]
      : excludeSlugs;
    setExcludeSlugs(nextExclude);
    setChosen(null);
    await loadActivity(startMoodSlug, nextExclude);
  }, [startMoodSlug, chosen, excludeSlugs, loadActivity]);

  const handleDidIt = useCallback(() => setStep("mood-out"), []);

  const handleMaybeLater = useCallback(() => onExit(), [onExit]);

  const handleMoodOut = useCallback(
    async (mood: MoodSlug) => {
      setBusy(true);
      setError(null);
      try {
        await upsertTodayCheckin(profile.id, {
          end_mood: mood,
          end_mood_score: scoreFromMoodSlug(mood),
          completed: true,
        });

        const startMood = checkin?.start_mood && isMoodSlug(checkin.start_mood)
          ? checkin.start_mood
          : undefined;

        await createJournalEntry(profile.id, {
          title: "Daily check-in",
          note: "Anything on your mind? A gentle moment together today.",
          mood: startMood ?? mood,
          endMood: mood,
          entryType: "reflection",
          tags: ["Check-in"],
        });

        onUpdate();
        setStep("farewell");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setBusy(false);
      }
    },
    [profile.id, checkin?.start_mood, onUpdate]
  );

  const handleFarewellDone = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await completeCheckIn(profile);
      onUpdate();
      onExit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }, [profile, onUpdate, onExit]);

  if (step === "mood-in") {
    return (
      <CompanionShell spriteState="idle" speech="How are you feeling today?">
        <MoodPicker onSelect={handleMoodIn} disabled={busy} label="" />
        {error ? <p className="mt-4 text-center text-sm text-error">{error}</p> : null}
      </CompanionShell>
    );
  }

  if (step === "activity") {
    const line = chosen
      ? activityCompanionLine(chosen)
      : `${pet} is picking something gentle for you…`;

    return (
      <CompanionShell spriteState="activity" speech={line}>
        {loadingActivity || !chosen ? (
          <p className="text-center text-body-md text-on-surface-variant">Finding an activity…</p>
        ) : (
          <SoftCard className="mb-4 space-y-3">
            <h3 className="font-headline-md text-headline-md text-on-surface">{chosen.title}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{chosen.description}</p>
            <p className="font-label-md text-label-md text-secondary">
              {chosen.duration_min_minutes}–{chosen.duration_max_minutes} min · {indoorOutdoorHint(chosen)}
            </p>
          </SoftCard>
        )}
        <div className="flex flex-col gap-3">
          <PrimaryButton
            fullWidth
            disabled={busy || loadingActivity || !chosen}
            onClick={handleDidIt}
          >
            I did it ✓
          </PrimaryButton>
          <button
            type="button"
            disabled={busy || loadingActivity || !startMoodSlug}
            onClick={() => void handleShuffle()}
            className="rounded-full px-6 py-3 font-label-lg text-secondary hover:bg-surface-container-high"
          >
            Shuffle
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleMaybeLater}
            className="rounded-full px-6 py-3 font-body-md text-on-surface-variant hover:bg-surface-container-low"
          >
            Maybe later
          </button>
        </div>
        {error ? <p className="mt-2 text-center text-sm text-error">{error}</p> : null}
      </CompanionShell>
    );
  }

  if (step === "mood-out") {
    return (
      <CompanionShell spriteState="content" speech="How do you feel now?">
        <MoodPicker onSelect={handleMoodOut} disabled={busy} label="" />
        {error ? <p className="mt-4 text-center text-sm text-error">{error}</p> : null}
      </CompanionShell>
    );
  }

  if (step === "farewell") {
    const thanks = getCompanionLine("farewell", profile.name ?? undefined);
    return (
      <CompanionShell spriteState="celebrating" speech={thanks}>
        <PrimaryButton fullWidth disabled={busy} onClick={() => void handleFarewellDone()}>
          {busy ? "Saving…" : "See you tomorrow 💛"}
        </PrimaryButton>
        {error ? <p className="mt-2 text-center text-sm text-error">{error}</p> : null}
      </CompanionShell>
    );
  }

  return null;
}
