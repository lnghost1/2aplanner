import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazy initialization to avoid build-time errors when ENV vars are missing
let supabaseInstance: any = null;

export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
}
