-- =====================================================================================
-- VIRAL VIDEO FACTORY - COMPLETE DATABASE SCHEMA
-- =====================================================================================
-- Run this script in your Supabase SQL Editor to set up the complete database schema
-- This replaces the corrupted 0000_initial_schema.sql file

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================================
-- USER PROFILES TABLE
-- =====================================================================================
-- Store user-specific data including credits and preferences
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    avatar_url text,
    credits integer DEFAULT 100 NOT NULL,
    subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
    stripe_customer_id text UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- =====================================================================================
-- BRAND KITS TABLE
-- =====================================================================================
-- Store user brand customization settings
CREATE TABLE IF NOT EXISTS public.brand_kits (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    logo_url text,
    primary_color text DEFAULT '#10B981',
    secondary_color text DEFAULT '#1F2937',
    font text DEFAULT 'font-sans' CHECK (font IN ('font-sans', 'font-serif', 'font-mono')),
    n8n_webhook_url text,
    is_default boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own brand kits" ON public.brand_kits
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- PROJECTS TABLE
-- =====================================================================================
-- Store user video projects and their state
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    script text,
    generation_mode text DEFAULT 'ai' CHECK (generation_mode IN ('ai', 'stock', 'kinetic')),
    selected_ai_model text DEFAULT 'veo' CHECK (selected_ai_model IN ('veo', 'luma', 'veo3')),
    selected_video_length text DEFAULT 'short-clip' CHECK (selected_video_length IN ('short-clip', 'extended-scene', 'short-film')),
    visual_prompt text,
    sound_effects text,
    selected_voice text DEFAULT 'alloy',
    selected_music text DEFAULT 'none',
    background_music_url text,
    voiceover_volume integer DEFAULT 80,
    music_volume integer DEFAULT 20,
    video_url text,
    audio_url text,
    silent_video_url text,
    voiceover_url text,
    subtitles text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'failed')),
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- GALLERY TABLE
-- =====================================================================================
-- Store public gallery items for showcase
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail_url text,
    tags text[] DEFAULT '{}',
    is_public boolean DEFAULT false,
    likes_count integer DEFAULT 0,
    views_count integer DEFAULT 0,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public gallery items" ON public.gallery
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own gallery items" ON public.gallery
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- CREDIT TRANSACTIONS TABLE
-- =====================================================================================
-- Track all credit usage and purchases
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL, -- Positive for purchases, negative for usage
    action text NOT NULL,
    description text,
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    stripe_payment_intent_id text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- LICENSE KEYS TABLE
-- =====================================================================================
-- Store and manage license keys for promotions
CREATE TABLE IF NOT EXISTS public.license_keys (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_code text UNIQUE NOT NULL,
    credits_amount integer NOT NULL,
    description text,
    is_redeemed boolean DEFAULT false,
    redeemed_by uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    redeemed_at timestamp with time zone,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view license keys they redeemed" ON public.license_keys
    FOR SELECT USING (auth.uid() = redeemed_by);

-- =====================================================================================
-- SOCIAL ACCOUNTS TABLE
-- =====================================================================================
-- Store connected social media accounts
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    platform text NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'youtube', 'linkedin')),
    account_id text NOT NULL,
    username text,
    access_token text,
    refresh_token text,
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, platform)
);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own social accounts" ON public.social_accounts
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- SCHEDULED POSTS TABLE
-- =====================================================================================
-- Store scheduled social media posts
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    platform text NOT NULL,
    content text NOT NULL,
    media_url text,
    scheduled_for timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'posted', 'failed', 'cancelled')),
    error_message text,
    posted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scheduled posts" ON public.scheduled_posts
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- ANALYTICS TABLE
-- =====================================================================================
-- Store usage analytics and performance metrics
CREATE TABLE IF NOT EXISTS public.analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    event_data jsonb DEFAULT '{}',
    project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
    session_id text,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================================================

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email)
    );
    
    -- Create default brand kit
    INSERT INTO public.brand_kits (user_id, name, is_default)
    VALUES (new.id, 'Default Brand Kit', true);
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.brand_kits
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- =====================================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON public.user_profiles(stripe_customer_id);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_public ON public.gallery(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON public.gallery(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_gallery_user_id ON public.gallery(user_id);

-- Credit transactions indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);

-- =====================================================================================
-- INITIAL DATA
-- =====================================================================================

-- Insert some sample gallery items (optional)
-- You can remove this section if you don't want sample data

-- =====================================================================================
-- SECURITY NOTES
-- =====================================================================================
-- 1. All tables have Row Level Security (RLS) enabled
-- 2. Users can only access their own data
-- 3. Gallery items are publicly viewable when marked as public
-- 4. Sensitive data like tokens are encrypted at rest by Supabase
-- 5. All foreign key constraints ensure data integrity

-- =====================================================================================
-- COMPLETION MESSAGE
-- =====================================================================================
-- Schema creation completed successfully!
-- Next steps:
-- 1. Deploy the Supabase Edge Functions from supabase/functions/
-- 2. Set up your environment variables in Vercel
-- 3. Test the application with the new database schema

