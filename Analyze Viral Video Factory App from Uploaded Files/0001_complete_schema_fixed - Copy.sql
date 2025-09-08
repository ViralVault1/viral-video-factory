-- =====================================================================================
-- VIRAL VIDEO FACTORY - COMPLETE DATABASE SCHEMA (CORRECTED)
-- =====================================================================================
-- Run this script in your Supabase SQL Editor to set up the complete database schema
-- This fixes the column reference issues

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
-- Store video projects and their metadata
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    description text,
    script text,
    voice_settings jsonb DEFAULT '{"voice": "alloy", "volume": 0.8}'::jsonb,
    music_settings jsonb DEFAULT '{"url": null, "volume": 0.3}'::jsonb,
    scenes jsonb DEFAULT '[]'::jsonb,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
    video_url text,
    thumbnail_url text,
    duration integer, -- in seconds
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- CREDIT TRANSACTIONS TABLE
-- =====================================================================================
-- Track credit usage and purchases
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    amount integer NOT NULL, -- positive for credits added, negative for credits used
    transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'bonus', 'refund')),
    description text,
    reference_id text, -- stripe payment intent, project id, etc.
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================================================
-- Store subscription information
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_subscription_id text UNIQUE NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone NOT NULL,
    plan_id text NOT NULL,
    plan_name text NOT NULL,
    price_amount integer NOT NULL, -- in cents
    currency text DEFAULT 'usd',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
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
    redeemed_by_user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    redeemed_at timestamp with time zone,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view license keys they redeemed" ON public.license_keys
    FOR SELECT USING (auth.uid() = redeemed_by_user_id);

-- =====================================================================================
-- SOCIAL ACCOUNTS TABLE
-- =====================================================================================
-- Store connected social media accounts
CREATE TABLE IF NOT EXISTS public.social_accounts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    platform text NOT NULL CHECK (platform IN ('twitter', 'instagram', 'tiktok', 'youtube', 'linkedin')),
    platform_user_id text NOT NULL,
    username text NOT NULL,
    access_token text,
    refresh_token text,
    token_expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, platform)
);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own social accounts" ON public.social_accounts
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- PUBLISHED POSTS TABLE
-- =====================================================================================
-- Track posts published to social media
CREATE TABLE IF NOT EXISTS public.published_posts (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    social_account_id uuid REFERENCES public.social_accounts(id) ON DELETE CASCADE NOT NULL,
    platform_post_id text NOT NULL,
    caption text,
    hashtags text[],
    scheduled_for timestamp with time zone,
    published_at timestamp with time zone,
    status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed')),
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.published_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own published posts" ON public.published_posts
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- POST ANALYTICS TABLE
-- =====================================================================================
-- Store analytics data for published posts
CREATE TABLE IF NOT EXISTS public.post_analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
    published_post_id uuid REFERENCES public.published_posts(id) ON DELETE CASCADE NOT NULL,
    platform text NOT NULL,
    views integer DEFAULT 0,
    likes integer DEFAULT 0,
    comments integer DEFAULT 0,
    shares integer DEFAULT 0,
    saves integer DEFAULT 0,
    click_through_rate decimal(5,2),
    engagement_rate decimal(5,2),
    reach integer DEFAULT 0,
    impressions integer DEFAULT 0,
    collected_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post analytics" ON public.post_analytics
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- USER ANALYTICS TABLE
-- =====================================================================================
-- Store user behavior analytics
CREATE TABLE IF NOT EXISTS public.user_analytics (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_id text NOT NULL,
    event_name text NOT NULL,
    event_properties jsonb DEFAULT '{}'::jsonb,
    page_url text,
    user_agent text,
    ip_address inet,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON public.user_analytics
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- TEMPLATES TABLE
-- =====================================================================================
-- Store video templates for quick starts
CREATE TABLE IF NOT EXISTS public.templates (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    thumbnail_url text,
    script_template text NOT NULL,
    scenes_template jsonb NOT NULL,
    voice_settings jsonb DEFAULT '{"voice": "alloy", "volume": 0.8}'::jsonb,
    tags text[],
    estimated_duration integer, -- in seconds
    is_public boolean DEFAULT true,
    created_by uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    usage_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view public templates" ON public.templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage own templates" ON public.templates
    FOR ALL USING (auth.uid() = created_by);

-- =====================================================================================
-- FUNCTIONS
-- =====================================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================================================
-- TRIGGERS
-- =====================================================================================

-- Add updated_at triggers for tables that need them
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_kits_updated_at BEFORE UPDATE ON public.brand_kits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================================
-- INDEXES
-- =====================================================================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_published_posts_user_id ON public.published_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_user_id ON public.post_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_session_id ON public.user_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON public.templates(is_public);

-- =====================================================================================
-- INITIAL DATA
-- =====================================================================================

-- Insert default templates
INSERT INTO public.templates (name, description, category, script_template, scenes_template, tags, estimated_duration) VALUES
('How-To Tutorial', 'Step-by-step educational content template', 'educational', 
 'Today I''ll show you how to [TOPIC]. This simple method will help you [BENEFIT]. Let''s get started with step one...', 
 '[{"script": "Hook: Did you know that [SURPRISING FACT]? Today I''ll show you exactly how to [ACHIEVE GOAL]."}, {"script": "Step 1: First, you need to [ACTION]. This is crucial because [REASON]."}, {"script": "Step 2: Next, [ACTION]. Make sure to [IMPORTANT TIP]."}, {"script": "Step 3: Finally, [ACTION]. This will [RESULT]."}, {"script": "That''s it! You now know how to [TOPIC]. Try this method and let me know how it works for you!"}]',
 ARRAY['tutorial', 'education', 'how-to'], 45),

('Mind-Blowing Facts', 'Engaging facts that capture attention', 'entertainment',
 'Here are 5 mind-blowing facts that will change how you see the world...',
 '[{"script": "Here are 5 facts that will blow your mind. Number 3 will shock you!"}, {"script": "Fact 1: [AMAZING FACT]. This means that [IMPLICATION]."}, {"script": "Fact 2: [SURPRISING FACT]. Scientists discovered this by [METHOD]."}, {"script": "Fact 3: [SHOCKING FACT]. This completely changes our understanding of [TOPIC]."}, {"script": "Fact 4: [INTERESTING FACT]. The implications are [CONSEQUENCE]."}, {"script": "Fact 5: [FINAL FACT]. What do you think about these facts? Comment below!"}]',
 ARRAY['facts', 'viral', 'entertainment'], 50),

('Product Showcase', 'Professional product demonstration', 'business',
 'Introducing [PRODUCT NAME] - the solution you''ve been waiting for...',
 '[{"script": "Meet [PRODUCT NAME] - the game-changing solution for [PROBLEM]."}, {"script": "The problem: [PAIN POINT]. This affects millions of people daily."}, {"script": "Our solution: [PRODUCT] solves this by [HOW IT WORKS]."}, {"script": "Key benefits: [BENEFIT 1], [BENEFIT 2], and [BENEFIT 3]."}, {"script": "Ready to transform your [AREA]? Get [PRODUCT] today and see the difference!"}]',
 ARRAY['product', 'business', 'demo'], 40);

-- =====================================================================================
-- COMPLETION MESSAGE
-- =====================================================================================

-- This completes the database schema setup for Viral Video Factory
-- All tables, policies, triggers, and initial data have been created

