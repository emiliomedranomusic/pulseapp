-- Wellness creature: activities + mood-based suggestion tags
-- Run: supabase db reset (local) or supabase migration up

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.energy_level AS ENUM ('low', 'medium', 'high');

CREATE TYPE public.mood_suitability AS ENUM (
  'recommended',  -- strong match for this mood
  'suitable',     -- reasonable match
  'avoid'         -- usually not suggested for this mood
);

-- ---------------------------------------------------------------------------
-- Reference tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.activity_categories (
  id         smallserial PRIMARY KEY,
  slug       text        NOT NULL UNIQUE,
  name       text        NOT NULL,
  description text,
  sort_order smallint    NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activity_categories IS
  'Grouping for activities (breath, meditation, movement, etc.).';

CREATE TABLE public.moods (
  id          smallserial PRIMARY KEY,
  slug        text        NOT NULL UNIQUE,
  name        text        NOT NULL,
  description text,
  sort_order  smallint    NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.moods IS
  'Five check-in moods on a spectrum from low energy to awesome (see sort_order).';

CREATE TABLE public.activities (
  id                   serial PRIMARY KEY,
  slug                 text             NOT NULL UNIQUE,
  title                text             NOT NULL,
  description          text             NOT NULL,
  category_id          smallint         NOT NULL REFERENCES public.activity_categories (id),
  duration_min_minutes smallint         NOT NULL DEFAULT 5
    CHECK (duration_min_minutes >= 1),
  duration_max_minutes smallint         NOT NULL DEFAULT 20
    CHECK (duration_max_minutes >= duration_min_minutes),
  energy_level         public.energy_level NOT NULL DEFAULT 'low',
  indoor               boolean          NOT NULL DEFAULT true,
  outdoor              boolean          NOT NULL DEFAULT false,
  sort_order           smallint         NOT NULL DEFAULT 0,
  is_active            boolean          NOT NULL DEFAULT true,
  created_at           timestamptz      NOT NULL DEFAULT now(),
  updated_at           timestamptz      NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activities IS
  'Wellness activities the creature can suggest and do alongside the user.';

CREATE INDEX idx_activities_category ON public.activities (category_id);
CREATE INDEX idx_activities_energy ON public.activities (energy_level);
CREATE INDEX idx_activities_active ON public.activities (is_active) WHERE is_active = true;

-- ---------------------------------------------------------------------------
-- Mood tagging (many-to-many with suitability + weight)
-- ---------------------------------------------------------------------------

CREATE TABLE public.activity_mood_tags (
  activity_id  integer              NOT NULL
    REFERENCES public.activities (id) ON DELETE CASCADE,
  mood_id      smallint             NOT NULL
    REFERENCES public.moods (id) ON DELETE CASCADE,
  suitability  public.mood_suitability NOT NULL DEFAULT 'suitable',
  weight       smallint             NOT NULL DEFAULT 5
    CHECK (weight BETWEEN 1 AND 10),
  PRIMARY KEY (activity_id, mood_id)
);

COMMENT ON TABLE public.activity_mood_tags IS
  'Links activities to moods. Higher weight + recommended suitability rank first in suggestions.';

CREATE INDEX idx_activity_mood_tags_mood_lookup
  ON public.activity_mood_tags (mood_id, suitability, weight DESC);

CREATE INDEX idx_activity_mood_tags_activity
  ON public.activity_mood_tags (activity_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER activities_set_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Suggestion helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.activity_mood_suggestions AS
SELECT
  m.slug            AS mood_slug,
  m.name            AS mood_name,
  a.id              AS activity_id,
  a.slug            AS activity_slug,
  a.title,
  a.description,
  c.slug            AS category_slug,
  c.name            AS category_name,
  a.duration_min_minutes,
  a.duration_max_minutes,
  a.energy_level,
  a.indoor,
  a.outdoor,
  amt.suitability,
  amt.weight,
  CASE amt.suitability
    WHEN 'recommended' THEN amt.weight + 10
    WHEN 'suitable'    THEN amt.weight
    ELSE 0
  END               AS suggestion_score
FROM public.activity_mood_tags amt
JOIN public.moods m ON m.id = amt.mood_id
JOIN public.activities a ON a.id = amt.activity_id
JOIN public.activity_categories c ON c.id = a.category_id
WHERE a.is_active = true
  AND amt.suitability <> 'avoid';

COMMENT ON VIEW public.activity_mood_suggestions IS
  'Denormalized view for mood-based activity ranking in the app.';

CREATE OR REPLACE FUNCTION public.suggest_activities_for_mood(
  p_mood_slug text,
  p_limit integer DEFAULT 5,
  p_exclude_slugs text[] DEFAULT '{}'::text[]
)
RETURNS TABLE (
  activity_id integer,
  activity_slug text,
  title text,
  description text,
  category_slug text,
  duration_min_minutes smallint,
  duration_max_minutes smallint,
  energy_level public.energy_level,
  indoor boolean,
  outdoor boolean,
  suitability public.mood_suitability,
  weight smallint,
  suggestion_score integer
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    s.activity_id,
    s.activity_slug,
    s.title,
    s.description,
    s.category_slug,
    s.duration_min_minutes,
    s.duration_max_minutes,
    s.energy_level,
    s.indoor,
    s.outdoor,
    s.suitability,
    s.weight,
    s.suggestion_score
  FROM public.activity_mood_suggestions s
  WHERE s.mood_slug = p_mood_slug
    AND NOT (s.activity_slug = ANY (p_exclude_slugs))
  ORDER BY s.suggestion_score DESC, random()
  LIMIT GREATEST(p_limit, 1);
$$;

COMMENT ON FUNCTION public.suggest_activities_for_mood IS
  'Return ranked activities for a mood slug. Pass recent slugs in p_exclude_slugs to reduce repeats.';

-- ---------------------------------------------------------------------------
-- Row Level Security (reference data: read-only for clients)
-- ---------------------------------------------------------------------------

ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_mood_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_categories are readable by everyone"
  ON public.activity_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "moods are readable by everyone"
  ON public.moods FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "activities are readable by everyone"
  ON public.activities FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "activity_mood_tags are readable by everyone"
  ON public.activity_mood_tags FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.activity_categories TO anon, authenticated;
GRANT SELECT ON public.moods TO anon, authenticated;
GRANT SELECT ON public.activities TO anon, authenticated;
GRANT SELECT ON public.activity_mood_tags TO anon, authenticated;
GRANT SELECT ON public.activity_mood_suggestions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.suggest_activities_for_mood TO anon, authenticated;
