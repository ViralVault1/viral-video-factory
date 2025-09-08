
declare const process: {
  env: {
    API_KEY?: string;
    PEXELS_API_KEY?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    LUMA_API_KEY?: string;
    TWITTER_CLIENT_ID?: string;
  }
};

// =================================================================================
// API KEYS CONFIGURATION
// =================================================================================
// This file centralizes all third-party API keys. All keys are read from
// secure environment variables for production deployment.
//
// Required Environment Variables:
// - `API_KEY`: Gemini API key for AI content generation
// - `SUPABASE_URL`: Your Supabase project URL
// - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
//
// Optional Environment Variables (features will be disabled if not provided):
// - `PEXELS_API_KEY`: For stock video search functionality
// - `STRIPE_PUBLISHABLE_KEY`: For payment processing
// - `LUMA_API_KEY`: For Luma Dream Machine video generation
// - `TWITTER_CLIENT_ID`: For X (Twitter) OAuth integration
// =================================================================================

// Core API Keys
export const API_KEY = process.env.API_KEY;

// Optional Service API Keys
export const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const LUMA_API_KEY = process.env.LUMA_API_KEY;
export const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;

// Configuration checks
export const isGeminiConfigured = !!API_KEY;
export const isPexelsConfigured = !!PEXELS_API_KEY;
export const isStripeConfigured = !!STRIPE_PUBLISHABLE_KEY;
export const isLumaConfigured = !!LUMA_API_KEY;
export const isTwitterConfigured = !!TWITTER_CLIENT_ID;
