import { addDays, isToday, isYesterday, missedYesterday } from "./dates";
import type { CharacterState } from "./types";

export interface HealthInfo {
  state: CharacterState;
  statusLine: string;
}

/**
 * Derive creature health from completed check-in dates + simulated today.
 */
export function deriveHealthFromDates(
  completedDates: string[],
  todayStr: string,
  petName: string,
  streak: number
): HealthInfo {
  const pet = petName || "Pulse";
  const lastCompleted = completedDates.length
    ? [...completedDates].sort().reverse()[0]
    : null;

  if (isToday(lastCompleted, todayStr)) {
    return {
      state: streak >= 3 ? "happy" : "content",
      statusLine: `${pet} is glowing today!`,
    };
  }

  if (missedYesterday(lastCompleted, todayStr)) {
    return {
      state: "sad",
      statusLine: `${pet} missed you — one gentle check-in helps us both feel better.`,
    };
  }

  if (isYesterday(lastCompleted, todayStr) || !lastCompleted) {
    return {
      state: "idle",
      statusLine: `${pet} is waiting for you.`,
    };
  }

  return {
    state: "idle",
    statusLine: `${pet} is here whenever you're ready.`,
  };
}

// TODO: stretch — birthday surprise when check_date matches profile.birthdate
export function isBirthdayCheckin(_birthdate: string | null, _checkDate: string): boolean {
  return false;
}
