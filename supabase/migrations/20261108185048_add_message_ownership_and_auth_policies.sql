/*
# Message ownership, sign-in required for chat, public incident feed

1. Modified Tables
- `messages`: new column `user_id` linking each message to the signed-in author. It defaults to the current user, so inserts from the app are attributed automatically. Table is empty at migration time, so the NOT NULL constraint is safe.
- `incidents`: new column `user_id` with the same behaviour.

2. Security
- Chat messages: only signed-in users can read the chat, post, and delete. Deletion is limited to the author's own messages.
- Chat messages cannot be edited.
- Incidents: anyone can read the public incident feed. Only signed-in users can report, and each report is tied to its author. Incidents cannot be deleted from the app.
- The old anonymous write policies are removed. Anonymous users lose access to messages and incident writes.

3. Notes
- Statements are idempotent so the migration can be safely re-run.
- Existing rows: none (both tables are empty).
*/

ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE incidents ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS messages_user_idx ON messages (user_id);
CREATE INDEX IF NOT EXISTS incidents_user_idx ON incidents (user_id);

REVOKE ALL ON messages FROM anon;
REVOKE ALL ON incidents FROM anon;
REVOKE ALL ON messages FROM authenticated;
REVOKE ALL ON incidents FROM authenticated;

GRANT SELECT, INSERT, DELETE ON messages TO authenticated;
GRANT SELECT ON incidents TO anon, authenticated;
GRANT INSERT ON incidents TO authenticated;

DROP POLICY IF EXISTS "public_select_messages" ON messages;
DROP POLICY IF EXISTS "public_insert_messages" ON messages;
DROP POLICY IF EXISTS "public_select_incidents" ON incidents;
DROP POLICY IF EXISTS "public_insert_incidents" ON incidents;

DROP POLICY IF EXISTS "members_select_messages" ON messages;
CREATE POLICY "members_select_messages" ON messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "members_insert_own_messages" ON messages;
CREATE POLICY "members_insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id AND is_system = false);

DROP POLICY IF EXISTS "authors_delete_own_messages" ON messages;
CREATE POLICY "authors_delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_select_incidents" ON incidents;
CREATE POLICY "public_select_incidents" ON incidents FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "members_insert_own_incidents" ON incidents;
CREATE POLICY "members_insert_own_incidents" ON incidents FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime SET (publish = 'insert, update, delete');
