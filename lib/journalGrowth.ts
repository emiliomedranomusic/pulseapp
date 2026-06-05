import { isMoodSlug, scoreFromMoodSlug } from "./moods";
import type { JournalEntry } from "./types";

function entryMoodScore(entry: JournalEntry): number | null {
  const slug = entry.end_mood ?? entry.mood;
  if (!slug || !isMoodSlug(slug)) return null;
  return scoreFromMoodSlug(slug);
}

function parseDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export interface WeeklyGrowthResult {
  computable: boolean;
  /** Clamped ±99; positive = improved mood scores */
  percent: number | null;
  headline: string | null;
}

export function computeWeeklyGrowth(
  entries: JournalEntry[],
  todayStr: string
): WeeklyGrowthResult {
  const today = parseDate(todayStr);

  const thisWeekScores: number[] = [];
  const priorWeekScores: number[] = [];

  for (const entry of entries) {
    const score = entryMoodScore(entry);
    if (score === null) continue;

    const daysAgo = daysBetween(today, parseDate(entry.entry_date));
    if (daysAgo >= 0 && daysAgo <= 6) {
      thisWeekScores.push(score);
    } else if (daysAgo >= 7 && daysAgo <= 13) {
      priorWeekScores.push(score);
    }
  }

  if (thisWeekScores.length < 2 || priorWeekScores.length < 2) {
    return { computable: false, percent: null, headline: null };
  }

  const thisAvg =
    thisWeekScores.reduce((sum, s) => sum + s, 0) / thisWeekScores.length;
  const priorAvg =
    priorWeekScores.reduce((sum, s) => sum + s, 0) / priorWeekScores.length;

  if (priorAvg === 0) {
    return { computable: false, percent: null, headline: null };
  }

  const raw = Math.round(((thisAvg - priorAvg) / priorAvg) * 100);
  const percent = Math.max(-99, Math.min(99, raw));
  const abs = Math.abs(percent);

  const headline =
    percent >= 0
      ? `You're feeling ${abs}% more balanced this week.`
      : `You're feeling ${abs}% less balanced this week.`;

  return { computable: true, percent, headline };
}

export function countEntriesInMonth(
  entries: JournalEntry[],
  todayStr: string
): number {
  const [year, month] = todayStr.split("-");
  const prefix = `${year}-${month}`;
  return entries.filter((e) => e.entry_date.startsWith(prefix)).length;
}
