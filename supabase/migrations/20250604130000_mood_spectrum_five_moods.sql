-- Migrate from six-mood check-in to five-mood spectrum.
-- Safe to run after 20250604120000_wellness_activities_schema.sql

BEGIN;

DELETE FROM public.activity_mood_tags
WHERE mood_id IN (
  SELECT id FROM public.moods
  WHERE slug IN ('restless', 'angry_tense', 'good_energetic')
);

DELETE FROM public.moods
WHERE slug IN ('restless', 'angry_tense', 'good_energetic');

INSERT INTO public.moods (slug, name, description, sort_order) VALUES
  ('low_tired',    'Low / tired',       'Drained, sleepy, or low energy',              1),
  ('anxious',      'Anxious / tense',   'Worried, on edge, or physically tight',      2),
  ('neutral',      'Okay / neutral',    'Steady or in-between',                        3),
  ('good_content', 'Good / content',    'Relaxed, settled, or at ease',               4),
  ('awesome',      'Awesome!',          'Energized, joyful, or on top of the world',  5)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order  = EXCLUDED.sort_order;

COMMIT;

-- Re-apply mood tags: supabase db reset  OR  psql -f supabase/seed.sql (mood tag section)
