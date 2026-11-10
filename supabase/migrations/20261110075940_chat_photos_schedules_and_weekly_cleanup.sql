/*
# Chat photos, editable schedules and stations, 7-day cleanup

1. Modified Tables
- `messages`: new optional column `image_path` pointing to a photo in private storage. Text is now allowed to be empty when a photo is attached (a message must have text or a photo, max 500 characters of text).

2. New Storage
- Private bucket `chat-photos`: JPEG, PNG or WebP only, max 5 MB per file. Files are stored in a folder named after the uploader.
- Signed-in users can read photos in the bucket (the app only requests a link when a user taps "Toca para verla").
- Users can upload only into their own folder and delete only their own photos.

3. New Tables (editable from the Supabase table editor, no code)
- `train_schedules`: departures per direction (tgn-bcn / bcn-tgn), with departure and arrival times, stations, train type, active flag and sort order.
- `stations`: station name, zone, lines served, services (for example Bar, WiFi), active flag and sort order.
- Both are readable by visitors and signed-in users. The app cannot write to them.

4. Automatic Cleanup
- Function `purge_expired_chat()` permanently deletes messages older than 7 days, together with their photos.
- Scheduled hourly with pg_cron. It runs with database owner rights, so it is not callable from the app.

5. Notes
- Statements are idempotent and safe to re-run.
- Existing schedule and station data from the app is seeded once, only when the tables are empty.
*/

ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_path text CHECK (image_path IS NULL OR char_length(image_path) <= 300);

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_text_check;
ALTER TABLE messages ADD CONSTRAINT messages_text_check CHECK (
  char_length(text) <= 500 AND (char_length(text) > 0 OR image_path IS NOT NULL)
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('chat-photos', 'chat-photos', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "members_read_chat_photos" ON storage.objects;
CREATE POLICY "members_read_chat_photos" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'chat-photos');

DROP POLICY IF EXISTS "authors_upload_chat_photos" ON storage.objects;
CREATE POLICY "authors_upload_chat_photos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'chat-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "authors_delete_chat_photos" ON storage.objects;
CREATE POLICY "authors_delete_chat_photos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'chat-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE TABLE IF NOT EXISTS train_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL CHECK (direction IN ('tgn-bcn', 'bcn-tgn')),
  departs time NOT NULL,
  arrives time NOT NULL,
  from_station text NOT NULL CHECK (char_length(from_station) BETWEEN 1 AND 80),
  to_station text NOT NULL CHECK (char_length(to_station) BETWEEN 1 AND 80),
  train_type text NOT NULL DEFAULT 'R13' CHECK (char_length(train_type) BETWEEN 1 AND 20),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 1 AND 80),
  zone text NOT NULL CHECK (char_length(zone) BETWEEN 1 AND 20),
  lines text[] NOT NULL DEFAULT '{}',
  services text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE train_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON train_schedules TO anon, authenticated;
GRANT SELECT ON stations TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_active_schedules" ON train_schedules;
CREATE POLICY "public_read_active_schedules" ON train_schedules FOR SELECT
  TO anon, authenticated USING (active = true);

DROP POLICY IF EXISTS "public_read_active_stations" ON stations;
CREATE POLICY "public_read_active_stations" ON stations FOR SELECT
  TO anon, authenticated USING (active = true);

INSERT INTO train_schedules (direction, departs, arrives, from_station, to_station, sort_order)
SELECT v.direction, v.departs::time, v.arrives::time, v.from_station, v.to_station, v.sort_order
FROM (VALUES
  ('tgn-bcn', '05:51', '07:06', 'Tarragona', 'Barcelona Sants', 1),
  ('tgn-bcn', '06:21', '07:36', 'Tarragona', 'Barcelona Sants', 2),
  ('tgn-bcn', '06:51', '08:06', 'Tarragona', 'Barcelona Sants', 3),
  ('tgn-bcn', '07:21', '08:36', 'Tarragona', 'Barcelona Sants', 4),
  ('tgn-bcn', '07:51', '09:06', 'Tarragona', 'Barcelona Sants', 5),
  ('tgn-bcn', '08:21', '09:36', 'Tarragona', 'Barcelona Sants', 6),
  ('tgn-bcn', '09:21', '10:36', 'Tarragona', 'Barcelona Sants', 7),
  ('tgn-bcn', '10:21', '11:36', 'Tarragona', 'Barcelona Sants', 8),
  ('bcn-tgn', '06:13', '07:28', 'Barcelona Sants', 'Tarragona', 9),
  ('bcn-tgn', '07:13', '08:28', 'Barcelona Sants', 'Tarragona', 10),
  ('bcn-tgn', '08:13', '09:28', 'Barcelona Sants', 'Tarragona', 11),
  ('bcn-tgn', '09:13', '10:28', 'Barcelona Sants', 'Tarragona', 12),
  ('bcn-tgn', '10:13', '11:28', 'Barcelona Sants', 'Tarragona', 13),
  ('bcn-tgn', '17:13', '18:28', 'Barcelona Sants', 'Tarragona', 14),
  ('bcn-tgn', '18:13', '19:28', 'Barcelona Sants', 'Tarragona', 15),
  ('bcn-tgn', '19:13', '20:28', 'Barcelona Sants', 'Tarragona', 16)
) AS v(direction, departs, arrives, from_station, to_station, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM train_schedules);

INSERT INTO stations (name, zone, lines, services, sort_order) VALUES
  ('Tarragona', 'C-6', '{R13,R14,R16,RT1,RT2}', '{Consigna,WiFi,Bar}', 1),
  ('Camp de Tarragona (AVE)', 'AVE', '{AVE,LD}', '{Parking,WiFi,Bar,Taxi}', 2),
  ('Reus', 'C-6', '{R14,RT1}', '{WiFi,Bar}', 3),
  ('Salou', 'C-6', '{R14,RT2}', '{WiFi}', 4),
  ('Cambrils', 'C-6', '{R14}', '{Bar}', 5),
  ('L''Hospitalet de l''Infant', 'C-6', '{R16}', '{}', 6),
  ('Vandellòs', 'C-6', '{R16}', '{}', 7),
  ('Tortosa', 'C-6', '{R16}', '{Bar}', 8),
  ('L''Arboç', 'C-6', '{RT2}', '{}', 9)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE messages ALTER COLUMN text SET DEFAULT '';

CREATE OR REPLACE FUNCTION purge_expired_chat()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  removed integer;
BEGIN
  DELETE FROM storage.objects o
  USING messages m
  WHERE o.bucket_id = 'chat-photos'
    AND o.name = m.image_path
    AND m.created_at < now() - interval '7 days';

  DELETE FROM messages WHERE created_at < now() - interval '7 days';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END;
$$;

REVOKE EXECUTE ON FUNCTION purge_expired_chat() FROM PUBLIC, anon, authenticated;

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge_expired_chat') THEN
    PERFORM cron.unschedule('purge_expired_chat');
  END IF;
  PERFORM cron.schedule('purge_expired_chat', '0 * * * *', 'SELECT public.purge_expired_chat()');
END $$;
