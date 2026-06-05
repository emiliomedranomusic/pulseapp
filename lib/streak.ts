import { addDays } from "./dates";

/**
 * Count consecutive completed check-in days ending at todayStr or yesterday.
 * Distinct dates should be sorted newest-first or any order (we sort internally).
 */
export function computeStreak(
  distinctCheckinDates: string[],
  todayStr: string
): number {
  if (distinctCheckinDates.length === 0) return 0;

  const set = new Set(distinctCheckinDates);
  let cursor = set.has(todayStr) ? todayStr : addDays(todayStr, -1);
  if (!set.has(cursor)) return 0;

  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
