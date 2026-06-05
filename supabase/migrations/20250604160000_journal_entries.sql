-- Journaling gets its own table so users can log MANY entries per day.

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  entry_date  date NOT NULL DEFAULT (current_date),
  title       text,
  note        text,
  mood        text,
  end_mood    text,
  entry_type  text CHECK (entry_type IN ('reflection', 'gratitude', 'milestone')),
  tags        text[] NOT NULL DEFAULT '{}',
  photo_url   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_profile_date
  ON public.journal_entries (profile_id, entry_date DESC, created_at DESC);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own journal entries - select"
  ON public.journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "own journal entries - insert"
  ON public.journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "own journal entries - update"
  ON public.journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id);

CREATE POLICY "own journal entries - delete"
  ON public.journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO authenticated;
