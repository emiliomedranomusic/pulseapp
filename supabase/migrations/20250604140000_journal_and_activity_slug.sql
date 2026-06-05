-- Phase 1: journal fields + activity_slug on checkins

ALTER TABLE public.checkins
  ADD COLUMN IF NOT EXISTS activity_slug text,
  ADD COLUMN IF NOT EXISTS journal_title text,
  ADD COLUMN IF NOT EXISTS journal_note text,
  ADD COLUMN IF NOT EXISTS journal_tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS journal_photo_url text,
  ADD COLUMN IF NOT EXISTS entry_type text
    CHECK (
      entry_type IS NULL
      OR entry_type IN ('reflection', 'gratitude', 'milestone')
    );

COMMENT ON COLUMN public.checkins.start_mood IS 'Mood slug: low_tired, anxious, neutral, good_content, awesome';
COMMENT ON COLUMN public.checkins.end_mood IS 'Mood slug: low_tired, anxious, neutral, good_content, awesome';
COMMENT ON COLUMN public.checkins.activity_slug IS 'Chosen activity from activities.slug';
