/*
# Chat messages and train incidents by zone

1. New Tables
- `messages`: chat messages sent in a route room. Columns: id, room_id, zone (neighbourhood or town of origin), user_name, user_avatar, text, is_system, created_at.
- `incidents`: train status reports from passengers. Columns: id, line_id, zone, severity (low, medium, high), description, user_name, created_at.

2. Realtime
- Both tables are added to the realtime publication so new rows reach open screens instantly.

3. Security
- Row level security is enabled on both tables.
- The app has no sign-in screen, so requests run as the anonymous role. Policies therefore target anon and authenticated.
- Only SELECT and INSERT are granted. Messages and incidents cannot be edited or deleted from the app.
- Text length and severity values are enforced by the database.

4. Notes
- This is a new schema; no existing data is modified.
- Statements are idempotent so the migration can be safely re-run.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL CHECK (char_length(room_id) BETWEEN 1 AND 50),
  zone text NOT NULL CHECK (char_length(zone) BETWEEN 1 AND 80),
  user_name text NOT NULL CHECK (char_length(user_name) BETWEEN 1 AND 40),
  user_avatar text NOT NULL DEFAULT '' CHECK (char_length(user_avatar) <= 500),
  text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_room_created_idx ON messages (room_id, created_at);

CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id text NOT NULL CHECK (char_length(line_id) BETWEEN 1 AND 50),
  zone text NOT NULL CHECK (char_length(zone) BETWEEN 1 AND 80),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 500),
  user_name text NOT NULL CHECK (char_length(user_name) BETWEEN 1 AND 40),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS incidents_created_idx ON incidents (created_at DESC);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON messages TO anon, authenticated;
GRANT SELECT, INSERT ON incidents TO anon, authenticated;

DROP POLICY IF EXISTS "public_select_messages" ON messages;
CREATE POLICY "public_select_messages" ON messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_messages" ON messages;
CREATE POLICY "public_insert_messages" ON messages FOR INSERT
  TO anon, authenticated WITH CHECK (is_system = false);

DROP POLICY IF EXISTS "public_select_incidents" ON incidents;
CREATE POLICY "public_select_incidents" ON incidents FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_incidents" ON incidents;
CREATE POLICY "public_insert_incidents" ON incidents FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'incidents') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
  END IF;
END $$;
