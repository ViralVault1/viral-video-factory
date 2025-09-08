import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const process: {
  env: {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
  }
};

// SECURITY: Use environment variables for Supabase credentials
export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// This will be true if the environment variables are not set.
export const isSupabaseCredentialsPlaceholder = !isSupabaseConfigured;


let supabaseSingleton: SupabaseClient;

if (isSupabaseConfigured) {
  // If the credentials are provided, create a real Supabase client.
  supabaseSingleton = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  // If credentials are NOT configured, create a minimal mock client.
  // This prevents the application from crashing on import (e.g., in AuthContext)
  // before the configuration check in App.tsx has a chance to run and display
  // the proper setup instructions to the user.
  console.warn(
    'Supabase credentials not found. Using mock client to prevent app crash. ' +
    'The app should display a configuration error message.'
  );
  supabaseSingleton = {
    auth: {
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
  } as any;
}

export const supabase = supabaseSingleton;