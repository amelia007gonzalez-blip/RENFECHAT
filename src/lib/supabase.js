import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.warn('⚠️ VITE_SUPABASE_URL no detectada en entorno, usando URL de respaldo.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.error('🔴 VITE_SUPABASE_ANON_KEY no está definida en Vercel.');
}

export const supabase = createClient(
  (supabaseUrl && supabaseUrl !== 'undefined') ? supabaseUrl : 'https://xfypjsvpicmlrolwupvz.supabase.co',
  (supabaseAnonKey && supabaseAnonKey !== 'undefined') ? supabaseAnonKey : ''
);
