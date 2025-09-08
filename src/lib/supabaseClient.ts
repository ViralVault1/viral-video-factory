import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
export const isSupabaseCredentialsPlaceholder = !isSupabaseConfigured;

let supabaseSingleton: SupabaseClient;

if (isSupabaseConfigured) {
  supabaseSingleton = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  supabaseSingleton = {
    auth: {
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  } as any;
}

export const supabase = supabaseSingleton;
