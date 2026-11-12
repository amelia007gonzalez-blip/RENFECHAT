import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.warn('⚠️ VITE_SUPABASE_URL no detectada en entorno, usando URL de respaldo.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY no detectada en entorno, usando clave de respaldo.');
}

export const supabase = createClient(
  (supabaseUrl && supabaseUrl !== 'undefined') ? supabaseUrl : 'https://supabase.co',
  (supabaseAnonKey && supabaseAnonKey !== 'undefined') ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeXBqc3ZwaWNsbXJvbHd1cHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjU2MDIsImV4cCI6MjA5MDAwMTYwMn0.7t_iE9-EtzFfoUp-Yp6FrD8d14tTbSNTcFm1-PcE0os'
);
