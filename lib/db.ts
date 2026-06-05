import { addDays } from "./dates";
import { scoreFromMoodSlug } from "./moods";
import { getSupabase } from "./supabase";
import { computeStreak } from "./streak";
import { today } from "./today";
import type {
  Activity,
  Checkin,
  CheckinUpsert,
  CommunityEvent,
  CreateJournalEntryInput,
  JournalEntry,
  JournalEntryType,
  Profile,
  ProfileUpdate,
} from "./types";
import type { MoodSlug } from "./moods";

function formatError(message: string, details?: string): string {
  return details ? `${message}: ${details}` : message;
}

export async function getOrCreateProfile(userId: string): Promise<Profile> {
  const supabase = getSupabase();

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    throw new Error(formatError("Could not load profile", selectError.message));
  }

  if (existing) {
    return existing as Profile;
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(formatError("Could not create profile", insertError.message));
  }

  return created as Profile;
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(formatError("Could not update profile", error.message));
  }

  return data as Profile;
}

export async function getCompletedCheckinDates(profileId: string): Promise<string[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("checkins")
    .select("check_date")
    .eq("profile_id", profileId)
    .eq("completed", true);

  if (error) {
    throw new Error(formatError("Could not load check-in history", error.message));
  }

  const dates = (data ?? []).map((r: { check_date: string }) => r.check_date);
  return [...new Set(dates)];
}

export async function getTodayCheckin(profileId: string): Promise<Checkin | null> {
  const supabase = getSupabase();
  const todayStr = today();

  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("profile_id", profileId)
    .eq("check_date", todayStr)
    .maybeSingle();

  if (error) {
    throw new Error(formatError("Could not load today's check-in", error.message));
  }

  return (data as Checkin | null) ?? null;
}

export async function upsertTodayCheckin(
  profileId: string,
  partial: CheckinUpsert
): Promise<Checkin> {
  const supabase = getSupabase();
  const todayStr = today();

  const existing = await getTodayCheckin(profileId);

  if (existing) {
    const { data, error } = await supabase
      .from("checkins")
      .update(partial)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(formatError("Could not update check-in", error.message));
    }
    return data as Checkin;
  }

  const { data, error } = await supabase
    .from("checkins")
    .insert({
      profile_id: profileId,
      check_date: todayStr,
      ...partial,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(formatError("Could not create check-in", error.message));
  }

  return data as Checkin;
}

export async function completeCheckIn(profile: Profile): Promise<Profile> {
  const todayStr = today();
  const dates = await getCompletedCheckinDates(profile.id);
  const withToday = [...new Set([...dates, todayStr])];
  const streak = computeStreak(withToday, todayStr);

  return updateProfile(profile.id, {
    last_checkin_date: todayStr,
    streak,
    longest_streak: Math.max(profile.longest_streak, streak),
  });
}

export async function getSuggestedActivities(
  moodSlug: MoodSlug,
  limit = 3,
  excludeSlugs: string[] = []
): Promise<Activity[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase.rpc("suggest_activities_for_mood", {
    p_mood_slug: moodSlug,
    p_limit: limit,
    p_exclude_slugs: excludeSlugs,
  });

  if (error) {
    throw new Error(formatError("Could not load activities", error.message));
  }

  return (data ?? []) as Activity[];
}

export async function createJournalEntry(
  profileId: string,
  input: CreateJournalEntryInput
): Promise<JournalEntry> {
  const supabase = getSupabase();
  const todayStr = today();

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      profile_id: profileId,
      entry_date: todayStr,
      title: input.title ?? null,
      note: input.note,
      mood: input.mood ?? null,
      end_mood: input.endMood ?? null,
      entry_type: input.entryType ?? "reflection",
      tags: input.tags ?? [],
      photo_url: input.photoUrl ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(formatError("Could not save journal entry", error.message));
  }

  return data as JournalEntry;
}

export async function getJournalEntries(
  profileId: string,
  limit = 4,
  offset = 0,
  entryType?: JournalEntryType
): Promise<JournalEntry[]> {
  const supabase = getSupabase();

  let query = supabase
    .from("journal_entries")
    .select("*")
    .eq("profile_id", profileId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (entryType) {
    query = query.eq("entry_type", entryType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(formatError("Could not load journal entries", error.message));
  }

  return (data ?? []) as JournalEntry[];
}

export async function resetToday(profileId: string): Promise<void> {
  const supabase = getSupabase();
  const todayStr = today();

  const { error } = await supabase
    .from("checkins")
    .delete()
    .eq("profile_id", profileId)
    .eq("check_date", todayStr);

  if (error) {
    throw new Error(formatError("Could not reset today", error.message));
  }
}

export async function resetAll(profileId: string): Promise<void> {
  const supabase = getSupabase();

  const { error: checkinsError } = await supabase
    .from("checkins")
    .delete()
    .eq("profile_id", profileId);

  if (checkinsError) {
    throw new Error(formatError("Could not clear check-ins", checkinsError.message));
  }

  const { error: journalError } = await supabase
    .from("journal_entries")
    .delete()
    .eq("profile_id", profileId);

  if (journalError) {
    throw new Error(formatError("Could not clear journal", journalError.message));
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ streak: 0, longest_streak: 0, last_checkin_date: null })
    .eq("id", profileId);

  if (profileError) {
    throw new Error(formatError("Could not reset profile", profileError.message));
  }
}

const SEED_MOODS: MoodSlug[] = [
  "low_tired",
  "anxious",
  "neutral",
  "good_content",
  "awesome",
  "good_content",
  "awesome",
];

export async function seedWeek(profileId: string): Promise<void> {
  const supabase = getSupabase();
  const todayStr = today();

  for (let i = 7; i >= 1; i--) {
    const date = addDays(todayStr, -i);
    const mood = SEED_MOODS[7 - i];
    const activities = await getSuggestedActivities(mood, 1);
    const activity = activities[0];

    const { error } = await supabase.from("checkins").upsert(
      {
        profile_id: profileId,
        check_date: date,
        start_mood: mood,
        start_mood_score: scoreFromMoodSlug(mood),
        end_mood: mood,
        end_mood_score: scoreFromMoodSlug(mood),
        activity_slug: activity?.activity_slug ?? null,
        suggested_activity: activity
          ? `${activity.title} — ${activity.description}`
          : null,
        completed: true,
      },
      { onConflict: "profile_id,check_date" }
    );

    if (error) {
      throw new Error(formatError(`Could not seed check-in for ${date}`, error.message));
    }
  }

  const journalSeeds: CreateJournalEntryInput[] = [
    {
      title: "Evening reflection",
      note: "Started heavy, ended a little lighter after a short walk.",
      mood: "low_tired",
      endMood: "neutral",
      entryType: "reflection",
      tags: ["Walk", "Mindful"],
      photoUrl: null,
    },
    {
      title: "Grateful moment",
      note: "Tea, sunshine, and one kind text from a friend.",
      mood: "good_content",
      entryType: "gratitude",
      tags: ["Gratitude"],
    },
    {
      title: "Small milestone",
      note: "Finished a project slice without burning out.",
      mood: "awesome",
      entryType: "milestone",
      tags: ["Work", "Win"],
    },
    {
      title: "Quiet morning",
      note: "Sat with coffee and let the day arrive slowly.",
      mood: "neutral",
      entryType: "reflection",
      tags: ["Morning"],
      photoUrl: "https://images.unsplash.com/photo-1495474472287-4d489bcfe4c0?w=400&q=80",
    },
  ];

  const journalDates = [addDays(todayStr, -6), addDays(todayStr, -4), addDays(todayStr, -2), addDays(todayStr, -1)];

  for (let i = 0; i < journalSeeds.length; i++) {
    const seed = journalSeeds[i];
    const { error } = await supabase.from("journal_entries").insert({
      profile_id: profileId,
      entry_date: journalDates[i],
      title: seed.title ?? null,
      note: seed.note,
      mood: seed.mood ?? null,
      end_mood: seed.endMood ?? null,
      entry_type: seed.entryType ?? "reflection",
      tags: seed.tags ?? [],
      photo_url: seed.photoUrl ?? null,
    });
    if (error) {
      throw new Error(formatError("Could not seed journal entry", error.message));
    }
  }

  await updateProfile(profileId, {
    last_checkin_date: addDays(todayStr, -1),
    streak: 7,
    longest_streak: 7,
  });
}

export async function getCommunityEvents(
  category?: string
): Promise<CommunityEvent[]> {
  const supabase = getSupabase();

  let query = supabase
    .from("community_events")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("starts_at", { ascending: true });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(formatError("Could not load events", error.message));
  }

  return (data ?? []) as CommunityEvent[];
}

export async function createCommunityEvent(
  event: Pick<
    CommunityEvent,
    "title" | "blurb" | "category" | "mood_vibe" | "location_name"
  >
): Promise<CommunityEvent> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("community_events")
    .insert({
      title: event.title,
      blurb: event.blurb,
      category: event.category,
      mood_vibe: event.mood_vibe,
      location_name: event.location_name,
      starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      distance_miles: 1.0,
      attendee_count: 1,
      is_featured: false,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(formatError("Could not create event", error.message));
  }

  return data as CommunityEvent;
}

export async function getMyEventRsvps(profileId: string): Promise<string[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("event_id")
    .eq("profile_id", profileId);

  if (error) {
    throw new Error(formatError("Could not load RSVPs", error.message));
  }

  return (data ?? []).map((r: { event_id: string }) => r.event_id);
}

/** TODO: stretch — sync attendee_count via DB trigger; for now bump count on RSVP. */
export async function toggleEventRsvp(
  profileId: string,
  eventId: string,
  currentlyJoined: boolean
): Promise<void> {
  const supabase = getSupabase();

  if (currentlyJoined) {
    const { error } = await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("profile_id", profileId);
    if (error) {
      throw new Error(formatError("Could not leave event", error.message));
    }
    return;
  }

  const { error } = await supabase.from("event_rsvps").insert({
    event_id: eventId,
    profile_id: profileId,
  });

  if (error) {
    throw new Error(formatError("Could not join event", error.message));
  }
}
