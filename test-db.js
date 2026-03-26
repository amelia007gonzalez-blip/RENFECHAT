import { createClient } from '@supabase/supabase-js';

// VITE_SUPABASE_URL from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// VITE_SUPABASE_ANON_KEY from .env
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log("Testing Supabase connection to:", supabaseUrl);
  
  // 1. Try to fetch messages
  const { data, error } = await supabase.from('messages').select('*').limit(5);
  if (error) {
    console.error("❌ READ ERROR:", error);
  } else {
    console.log("✅ READ SUCCESS. Row count:", data.length);
  }

  // 2. Try to insert a test message
  console.log("Attempting to insert a test message...");
  const { error: insertError } = await supabase.from('messages').insert([{
    room_id: 'TEST_ROOM',
    user_name: 'TestBot',
    text: 'This is a test message to verify permissions.'
  }]);

  if (insertError) {
    console.error("❌ INSERT ERROR:", insertError);
  } else {
    console.log("✅ INSERT SUCCESS. You have write permissions.");
  }
}

checkDatabase();
