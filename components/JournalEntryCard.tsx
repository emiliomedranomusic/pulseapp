import Image from "next/image";
import { getMood } from "@/lib/moods";
import type { JournalEntry } from "@/lib/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const start = getMood(entry.mood);
  const end = getMood(entry.end_mood);
  const title = entry.title ?? "Journal entry";
  const body = entry.note ?? "";

  return (
    <article className="soft-card group flex h-full cursor-pointer flex-col justify-between rounded-card border border-surface-container-low bg-white p-stack-md">
      <div>
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <span className="font-label-md text-label-md text-secondary">{formatDate(entry.entry_date)}</span>
            <h3 className="mt-1 font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
              {title}
            </h3>
          </div>
          {start ? (
            <div className="flex shrink-0 items-center gap-2 rounded-full bg-secondary-container/30 px-3 py-1.5">
              <span className="text-xl">{start.emoji}</span>
              {end && end.slug !== start.slug ? (
                <>
                  <span className="text-on-surface-variant">→</span>
                  <span className="text-xl">{end.emoji}</span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        {entry.photo_url ? (
          <div className="relative mb-4 h-28 w-full overflow-hidden rounded-[20px]">
            <Image
              src={entry.photo_url}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
        <p className="mb-4 line-clamp-3 font-body-md text-body-md text-on-surface-variant">{body}</p>
      </div>
      {entry.tags?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-tertiary-fixed px-3 py-1 font-label-md text-on-tertiary-fixed-variant"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
