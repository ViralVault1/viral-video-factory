
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CreditAction } from '../types';

/*
  ==================================================================================
  DEVELOPER NOTE: Backend Setup for Secure Credit System
  ==================================================================================
  This service communicates with a secure Supabase Edge Function to deduct credits.
  This server-side enforcement is critical to prevent users from bypassing client-side
  checks and using unlimited AI resources.

  1. CREATE A NEW TABLE in Supabase named `user_profiles`.
     This table will store user-specific data, including their credit balance.

     SQL Schema:
     -----------------------------------------------------------------------------
     -- Create the table to store user profiles
     CREATE TABLE public.user_profiles (
       id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
       credits integer DEFAULT 100 NOT NULL
     );
     
     -- Enable Row Level Security (RLS)
     ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

     -- RLS Policy: Allow users to read their own profile
     CREATE POLICY "Allow users to read their own profile"
     ON public.user_profiles FOR SELECT
     USING (auth.uid() = id);

     -- Function to automatically create a profile for new users
     CREATE OR REPLACE FUNCTION public.handle_new_user()
     RETURNS trigger AS $$
     BEGIN
       INSERT INTO public.user_profiles (id, credits)
       VALUES (new.id, 100); -- New users start with 100 credits
       RETURN new;
     END;
     $$ LANGUAGE plpgsql SECURITY DEFINER;

     -- Trigger to call the function when a new user signs up
     CREATE TRIGGER on_auth_user_created
       AFTER INSERT ON auth.users
       FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
     -----------------------------------------------------------------------------

  2. CREATE A NEW SUPABASE EDGE FUNCTION named `consume-credits`.
     - This function must be created in your Supabase project.
     - You can use the full code provided in:
