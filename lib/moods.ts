/** Single source of truth for the 5 mood slugs (matches DB `moods` table). */

export type MoodSlug =
  | "low_tired"
  | "anxious"
  | "neutral"
  | "good_content"
  | "awesome";

export interface MoodDefinition {
  slug: MoodSlug;
  label: string;
  emoji: string;
  accent: string;
  sortOrder: number;
}

export const MOODS: readonly MoodDefinition[] = [
  {
    slug: "low_tired",
    label: "Low / tired",
    emoji: "😫",
    accent: "bg-secondary-container/60 ring-secondary/40",
    sortOrder: 1,
  },
  {
    slug: "anxious",
    label: "Anxious / tense",
    emoji: "😰",
    accent: "bg-primary-fixed/80 ring-primary-container/50",
    sortOrder: 2,
  },
  {
    slug: "neutral",
    label: "Okay / neutral",
    emoji: "😐",
    accent: "bg-surface-container-high ring-outline-variant/40",
    sortOrder: 3,
  },
  {
    slug: "good_content",
    label: "Good / content",
    emoji: "😊",
    accent: "bg-tertiary-fixed/80 ring-tertiary/30",
    sortOrder: 4,
  },
  {
    slug: "awesome",
    label: "Awesome!",
    emoji: "🤩",
    accent: "bg-secondary-fixed/80 ring-secondary/30",
    sortOrder: 5,
  },
] as const;

export function getMood(slug: string | null | undefined): MoodDefinition | undefined {
  return MOODS.find((m) => m.slug === slug);
}

export function isMoodSlug(value: string): value is MoodSlug {
  return MOODS.some((m) => m.slug === value);
}

export function scoreFromMoodSlug(slug: MoodSlug): number {
  return getMood(slug)?.sortOrder ?? 3;
}

export function moodSlugFromScore(score: number): MoodSlug {
  const found = MOODS.find((m) => m.sortOrder === score);
  return found?.slug ?? "neutral";
}
