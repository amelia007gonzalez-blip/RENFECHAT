import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Falta configuración de Supabase en Vercel.');
}

export const supabase = createClient(
  supabaseUrl || 'https://supabase.co-xfypjsvpicmlrolwupvz',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeXBqc3ZwaWNtbHJvbHd1cHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyOTA0ODQsImV4cCI6MjA0Njg2NjQ4NH0.2Zf639w63U4177Zk4O247V7F7F7F7F7F7F7F7F7F7F7'
);
