-- Phase 4: community events (static seed, no geolocation)

CREATE TABLE public.community_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  blurb text NOT NULL,
  category text NOT NULL CHECK (
    category IN ('coworking', 'mindfulness', 'coffee', 'movement', 'creative')
  ),
  mood_vibe text NOT NULL CHECK (
    mood_vibe IN ('low_tired', 'anxious', 'neutral', 'good_content', 'awesome')
  ),
  starts_at timestamptz NOT NULL,
  location_name text NOT NULL,
  distance_miles numeric(5, 1) NOT NULL DEFAULT 0,
  image_url text,
  attendee_count int NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.event_rsvps (
  event_id uuid NOT NULL REFERENCES public.community_events (id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, profile_id)
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_events_select_all"
  ON public.community_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "event_rsvps_select_own"
  ON public.event_rsvps FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "event_rsvps_insert_own"
  ON public.event_rsvps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "event_rsvps_delete_own"
  ON public.event_rsvps FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);

GRANT SELECT ON public.community_events TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.event_rsvps TO authenticated;

-- Seed ~8 events (Miami, FL — static location)
INSERT INTO public.community_events (
  title, blurb, category, mood_vibe, starts_at, location_name, distance_miles,
  image_url, attendee_count, is_featured
) VALUES
  (
    'Morning Co-working & Matcha',
    'A bright coworking morning with matcha, plants, and gentle focus.',
    'coworking',
    'good_content',
    now() + interval '1 day',
    'Wynwood Creative Hub, Miami',
    0.8,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    24,
    true
  ),
  (
    'Silent Meditation Circle',
    'Twenty minutes of guided silence in a cozy studio.',
    'mindfulness',
    'anxious',
    now() + interval '2 days',
    'Coconut Grove Studio, Miami',
    1.2,
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    12,
    false
  ),
  (
    'Digital Nomad Coffee Hour',
    'Low-pressure coffee chat for remote workers and creatives.',
    'coffee',
    'neutral',
    now() + interval '3 days',
    'South Beach Café, Miami',
    2.1,
    'https://images.unsplash.com/photo-1495474472287-4d489bcfe4c0?w=800&q=80',
    18,
    false
  ),
  (
    'Creative Flow Workshop',
    'Watercolor prompts and gentle music — no experience needed.',
    'creative',
    'awesome',
    now() + interval '4 days',
    'Little Haiti Arts Loft, Miami',
    3.4,
    'https://images.unsplash.com/photo-1460668267107-6a34936d36fb?w=800&q=80',
    9,
    false
  ),
  (
    'Sunset Beach Walk & Breathe',
    'Slow-paced shoreline walk with three breathing pauses.',
    'movement',
    'low_tired',
    now() + interval '5 days',
    'South Pointe Park, Miami Beach',
    4.0,
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    31,
    false
  ),
  (
    'Gentle Yoga in the Park',
    'Outdoor mats, soft stretches, and tea afterward.',
    'movement',
    'good_content',
    now() + interval '6 days',
    'Bayfront Park, Miami',
    1.5,
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    22,
    false
  ),
  (
    'Gratitude Journaling Meetup',
    'Share one line of gratitude — optional, always gentle.',
    'mindfulness',
    'neutral',
    now() + interval '7 days',
    'Coral Gables Library Room, Miami',
    2.8,
    'https://images.unsplash.com/photo-1455390573462-506c258527c7?w=800&q=80',
    8,
    false
  ),
  (
    'Neighborhood Sketch & Sip',
    'Sketch what you see, sip something warm, no critique.',
    'creative',
    'awesome',
    now() + interval '8 days',
    'Brickell Riverwalk, Miami',
    1.0,
    'https://images.unsplash.com/photo-1513364776144-609b932f000f?w=800&q=80',
    14,
    false
  );
