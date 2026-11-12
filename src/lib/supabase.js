import { createClient } from '@supabase/supabase-js';

const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const validUrl = envUrl.startsWith('https://')
  ? envUrl
  : 'https://' + 'xfypjsvpiclmrolwupvz' + '.supabase.co';

const validKey = envKey.startsWith('eyJ')
  ? envKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeXBqc3ZwaWNsbXJvbHd1cHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjU2MDIsImV4cCI6MjA5MDAwMTYwMn0.7t_iE9-EtzFfoUp-Yp6FrD8d14tTbSNTcFm1-PcE0os';

export const supabase = createClient(validUrl, validKey);
