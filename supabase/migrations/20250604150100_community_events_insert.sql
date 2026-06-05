-- Allow authenticated users to create community events from the modal

CREATE POLICY "community_events_insert_authenticated"
  ON public.community_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

GRANT INSERT ON public.community_events TO authenticated;
