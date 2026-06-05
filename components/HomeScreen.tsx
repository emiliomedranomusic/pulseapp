"use client";

import { useState } from "react";
import { useDemo } from "@/components/DemoProvider";
import { useDerivedStreak } from "@/components/useDerivedStreak";
import { getCompanionLine } from "@/lib/dialogue";
import { deriveHealthFromDates } from "@/lib/health";
import type { Checkin, Profile } from "@/lib/types";
import { CharacterSprite } from "./CharacterSprite";
import { CheckInFlow } from "./CheckInFlow";
import { CompanionShell } from "./CompanionShell";
import { PrimaryButton } from "./ui/PrimaryButton";

interface HomeScreenProps {
  profile: Profile;
  checkin: Checkin | null;
  onUpdate: () => void;
}

export function HomeScreen({ profile, checkin, onUpdate }: HomeScreenProps) {
  const [inFlow, setInFlow] = useState(false);
  const { todayStr } = useDemo();
  const { streak, dates } = useDerivedStreak(profile.id);
  const health = deriveHealthFromDates(dates, todayStr, profile.pet_name, streak);
  const pet = profile.pet_name || "Pulse";
  const name = profile.name?.trim() || "friend";
  const doneToday = Boolean(checkin?.completed);
  const needsFarewell =
    Boolean(checkin?.completed && checkin?.end_mood) &&
    profile.last_checkin_date !== todayStr;

  if (doneToday && !needsFarewell) {
    return (
      <div className="mx-auto w-full max-w-content px-margin-mobile py-stack-md md:px-margin-desktop md:py-stack-lg">
        <div className="mb-stack-md flex items-center justify-between rounded-card bg-surface-container-low px-4 py-3">
          <span className="font-label-lg text-label-lg text-on-surface-variant">Streak</span>
          <span className="font-headline-md text-headline-md text-on-surface">
            🔥 {streak} {streak === 1 ? "day" : "days"}
          </span>
        </div>
        <CompanionShell
          spriteState="happy"
          speech={`You're done for today, ${name} — see you tomorrow 💛`}
        />
      </div>
    );
  }

  if (inFlow || needsFarewell) {
    return (
      <div className="mx-auto w-full max-w-content px-margin-mobile py-stack-md md:px-margin-desktop">
        <CheckInFlow
          profile={profile}
          checkin={checkin}
          onUpdate={onUpdate}
          onExit={() => setInFlow(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-content px-margin-mobile py-stack-md md:px-margin-desktop md:py-stack-lg">
      <div className="mb-stack-md flex items-center justify-between rounded-card bg-surface-container-low px-4 py-3">
        <span className="font-label-lg text-label-lg text-on-surface-variant">Streak</span>
        <span className="font-headline-md text-headline-md text-on-surface">
          🔥 {streak} {streak === 1 ? "day" : "days"}
        </span>
      </div>

      <div className="mb-stack-lg flex flex-col items-center gap-3">
        <CharacterSprite state={health.state} />
        <p className="text-center font-headline-md text-headline-md">{health.statusLine}</p>
        <p className="text-center font-body-md text-body-md text-on-surface-variant">
          {getCompanionLine("greeting", name)}
        </p>
      </div>

      <PrimaryButton fullWidth onClick={() => setInFlow(true)}>
        Check in with {pet}
      </PrimaryButton>
    </div>
  );
}
