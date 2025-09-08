declare const process: {
  env: {
    API_KEY?: string;
    PEXELS_API_KEY?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    LUMA_API_KEY?: string;
    TWITTER_CLIENT_ID?: string;
  }
};

export const API_KEY = process.env.API_KEY;
export const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const LUMA_API_KEY = process.env.LUMA_API_KEY;
export const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;

export const isGeminiConfigured = !!API_KEY;
export const isPexelsConfigured = !!PEXELS_API_KEY;
export const isStripeConfigured = !!STRIPE_PUBLISHABLE_KEY;
export const isLumaConfigured = !!LUMA_API_KEY;
export const isTwitterConfigured = !!TWITTER_CLIENT_ID;
