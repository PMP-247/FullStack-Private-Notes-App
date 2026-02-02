import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env file');
}

// 1. Static client for general operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 2. Dynamic client for Authenticated requests
 * This attaches the user's JWT token so RLS policies work correctly.
 */
export const getSupabaseWithAuth = (token) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};