import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { supabaseConfig } from './env';

export function adminClient(): SupabaseClient | null {
  const config = supabaseConfig();
  if (!config) return null;
  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
