"use client";

import { MOODS } from "@/lib/moods";
import type { MoodSlug } from "@/lib/moods";

interface MoodPickerProps {
  onSelect: (mood: MoodSlug) => void;
  disabled?: boolean;
  selected?: MoodSlug | null;
  label?: string;
}

export function MoodPicker({
  onSelect,
  disabled,
  selected,
  label = "How are you feeling?",
}: MoodPickerProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      {label ? (
        <p className="font-label-lg text-label-lg uppercase tracking-widest text-on-surface-variant">
          {label}
        </p>
      ) : null}
      <div className="flex w-full flex-wrap justify-center gap-3 md:gap-4">
        {MOODS.map(({ slug, emoji, label: moodLabel, accent }) => {
          const isSelected = selected === slug;
          return (
            <button
              key={slug}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(slug)}
              title={moodLabel}
              className={`flex h-16 w-16 items-center justify-center rounded-full text-4xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 md:h-20 md:w-20 md:text-5xl ${accent} ${
                isSelected ? "scale-110 mood-glow" : "scale-100 opacity-90"
              }`}
              aria-label={`Mood: ${moodLabel}`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
