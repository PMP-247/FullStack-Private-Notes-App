import { supabase } from './supabaseClient.js';
import 'dotenv/config';

async function testConnection() {
  console.log("Testing connection to:", process.env.SUPABASE_URL);

  // Attempt to fetch from the notes table
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .limit(1);

  if (error) {
    console.error("❌ Connection Failed:", error.message);
  } else {
    console.log("✅ Connection Successful! Found:", data.length, "notes (empty is okay).");
  }
}

testConnection();
