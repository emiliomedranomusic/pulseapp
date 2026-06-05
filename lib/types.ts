import type { MoodSlug } from "./moods";

export type { MoodSlug };

export type JournalEntryType = "reflection" | "gratitude" | "milestone";

export type CharacterState =
  | "idle"
  | "happy"
  | "content"
  | "sleepy"
  | "sad"
  | "celebrating"
  | "activity";

export type CheckInStep =
  | "mood-in"
  | "activity"
  | "mood-out"
  | "farewell"
  | "done-today";

export interface Profile {
  id: string;
  name: string | null;
  pet_name: string;
  birthdate: string | null;
  streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
  created_at: string;
}

export interface Checkin {
  id: string;
  profile_id: string;
  check_date: string;
  start_mood: string | null;
  start_mood_score: number | null;
  suggested_activity: string | null;
  activity_slug: string | null;
  completed: boolean;
  end_mood: string | null;
  end_mood_score: number | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  profile_id: string;
  entry_date: string;
  title: string | null;
  note: string | null;
  mood: string | null;
  end_mood: string | null;
  entry_type: JournalEntryType | null;
  tags: string[];
  photo_url: string | null;
  created_at: string;
}

export interface Mood {
  id: number;
  slug: MoodSlug;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface ActivityCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Activity {
  activity_id: number;
  activity_slug: string;
  title: string;
  description: string;
  category_slug: string;
  duration_min_minutes: number;
  duration_max_minutes: number;
  energy_level: string;
  indoor: boolean;
  outdoor: boolean;
  suitability?: string;
  weight?: number;
  suggestion_score?: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  blurb: string;
  category: "coworking" | "mindfulness" | "coffee" | "movement" | "creative";
  mood_vibe: MoodSlug;
  starts_at: string;
  location_name: string;
  distance_miles: number;
  image_url: string | null;
  attendee_count: number;
  is_featured: boolean;
  created_at: string;
}

export type ProfileUpdate = Partial<
  Pick<Profile, "name" | "pet_name" | "birthdate" | "streak" | "longest_streak" | "last_checkin_date">
>;

export type CheckinUpsert = Partial<
  Pick<
    Checkin,
    | "start_mood"
    | "start_mood_score"
    | "suggested_activity"
    | "activity_slug"
    | "completed"
    | "end_mood"
    | "end_mood_score"
  >
>;

export interface CreateJournalEntryInput {
  title?: string | null;
  note: string;
  mood?: MoodSlug | null;
  endMood?: MoodSlug | null;
  entryType?: JournalEntryType | null;
  tags?: string[];
  photoUrl?: string | null;
}
