"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SoftCard } from "@/components/ui/SoftCard";
import {
  createCommunityEvent,
  getCommunityEvents,
  getMyEventRsvps,
  toggleEventRsvp,
} from "@/lib/db";
import { getMood } from "@/lib/moods";
import type { CommunityEvent, Profile } from "@/lib/types";
import type { MoodSlug } from "@/lib/moods";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "coworking", label: "Coworking" },
  { id: "mindfulness", label: "Mindfulness" },
  { id: "coffee", label: "Coffee" },
  { id: "movement", label: "Movement" },
  { id: "creative", label: "Creative" },
] as const;

function formatEventTime(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day}, ${time}`;
}

export default function CommunityPage() {
  return (
    <AppShell>
      {({ profile }) => <CommunityContent profile={profile} />}
    </AppShell>
  );
}

function CommunityContent({ profile }: { profile: Profile }) {
  const [category, setCategory] = useState("all");
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [rsvps, setRsvps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBlurb, setNewBlurb] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ev, mine] = await Promise.all([
        getCommunityEvents(category === "all" ? undefined : category),
        getMyEventRsvps(profile.id),
      ]);
      setEvents(ev);
      setRsvps(new Set(mine));
    } finally {
      setLoading(false);
    }
  }, [category, profile.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const featured = events.find((e) => e.is_featured);
  const grid = events.filter((e) => !e.is_featured);

  async function handleRsvp(eventId: string) {
    const joined = rsvps.has(eventId);
    try {
      await toggleEventRsvp(profile.id, eventId, joined);
      setRsvps((prev) => {
        const next = new Set(prev);
        if (joined) next.delete(eventId);
        else next.add(eventId);
        return next;
      });
      // TODO: stretch — persist attendee_count via trigger; local bump for demo
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, attendee_count: e.attendee_count + (joined ? -1 : 1) }
            : e
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "RSVP failed");
    }
  }

  return (
    <main className="mx-auto w-full max-w-content space-y-stack-lg px-margin-mobile py-stack-md md:px-margin-desktop md:py-stack-lg">
      <section className="space-y-stack-md">
        <div>
          <h1 className="font-display text-display text-on-surface">Activities Near You</h1>
          <p className="mt-2 max-w-lg font-body-lg text-on-surface-variant">
            Discover local gatherings that nurture your mind, body, and creative flow.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-6 py-3 font-label-lg transition-transform ${
                category === c.id
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-secondary-container"
              }`}
            >
              {c.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 font-label-lg text-on-surface-variant">
            <span aria-hidden>📍</span>
            Miami, FL
          </div>
        </div>
      </section>

      {loading ? (
        <p className="text-on-surface-variant">Loading gatherings…</p>
      ) : null}

      {featured ? (
        <FeaturedCard
          event={featured}
          joined={rsvps.has(featured.id)}
          onJoin={() => void handleRsvp(featured.id)}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
        {grid.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            joined={rsvps.has(event.id)}
            onJoin={() => void handleRsvp(event.id)}
          />
        ))}
      </div>

      <SoftCard className="flex flex-col items-center gap-4 bg-secondary-container/30 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Have an idea for a gathering?
          </h3>
          <p className="font-body-md text-on-surface-variant">
            Share a cozy meetup idea with the community.
          </p>
        </div>
        <PrimaryButton onClick={() => setModalOpen(true)}>Create Activity</PrimaryButton>
      </SoftCard>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4">
          <SoftCard className="w-full max-w-md space-y-4">
            <h3 className="font-headline-md text-headline-md">Create Activity</h3>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-full border-2 border-outline-variant/40 px-4 py-3"
            />
            <textarea
              value={newBlurb}
              onChange={(e) => setNewBlurb(e.target.value)}
              placeholder="Short description"
              rows={3}
              className="w-full rounded-[20px] border-2 border-outline-variant/40 px-4 py-3"
            />
            <div className="flex gap-3">
              <PrimaryButton
                disabled={!newTitle.trim()}
                onClick={async () => {
                  try {
                    await createCommunityEvent({
                      title: newTitle.trim(),
                      blurb: newBlurb.trim() || newTitle.trim(),
                      category: "creative",
                      mood_vibe: "good_content",
                      location_name: "Miami, FL",
                    });
                    setModalOpen(false);
                    setNewTitle("");
                    setNewBlurb("");
                    await load();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Could not create");
                  }
                }}
              >
                Save
              </PrimaryButton>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full px-4 py-3 text-on-surface-variant"
              >
                Cancel
              </button>
            </div>
          </SoftCard>
        </div>
      ) : null}

      {error ? <p className="text-sm text-error">{error}</p> : null}
    </main>
  );
}

function MoodVibeChip({ slug }: { slug: MoodSlug }) {
  const m = getMood(slug);
  return (
    <span className="rounded-full bg-secondary-container px-3 py-1 font-label-md text-on-secondary-container">
      {m?.emoji} {m?.label ?? slug}
    </span>
  );
}

function FeaturedCard({
  event,
  joined,
  onJoin,
}: {
  event: CommunityEvent;
  joined: boolean;
  onJoin: () => void;
}) {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-card soft-shadow md:h-[480px]">
      {event.image_url ? (
        <Image src={event.image_url} alt="" fill className="object-cover" unoptimized />
      ) : (
        <div className="absolute inset-0 bg-surface-container" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-4 text-white md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <MoodVibeChip slug={event.mood_vibe} />
          <h2 className="font-display text-headline-lg text-white">{event.title}</h2>
          <p className="font-body-md opacity-90">
            {formatEventTime(event.starts_at)} · {event.distance_miles} mi
          </p>
        </div>
        <PrimaryButton onClick={onJoin}>{joined ? "Joined ✓" : "Join Session"}</PrimaryButton>
      </div>
    </div>
  );
}

function EventCard({
  event,
  joined,
  onJoin,
}: {
  event: CommunityEvent;
  joined: boolean;
  onJoin: () => void;
}) {
  return (
    <SoftCard className="space-y-3">
      {event.image_url ? (
        <div className="relative -mx-stack-md -mt-stack-md mb-2 h-40 overflow-hidden rounded-t-card">
          <Image src={event.image_url} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : null}
      <MoodVibeChip slug={event.mood_vibe} />
      <h3 className="font-headline-md text-headline-md text-on-surface">{event.title}</h3>
      <p className="line-clamp-2 font-body-md text-on-surface-variant">{event.blurb}</p>
      <p className="font-label-md text-secondary">
        {formatEventTime(event.starts_at)} · {event.location_name} · {event.distance_miles} mi
      </p>
      <p className="font-label-md text-on-surface-variant">
        {event.attendee_count} attending
      </p>
      <button
        type="button"
        onClick={onJoin}
        className="w-full rounded-full border-2 border-primary py-3 font-label-lg text-primary hover:bg-primary-fixed/30"
      >
        {joined ? "View Event ✓" : "View Event"}
      </button>
    </SoftCard>
  );
}
