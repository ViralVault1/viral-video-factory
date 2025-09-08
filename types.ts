  chatHistory: ChatMessage[];
  isChatProcessing: boolean;
}

export type WorkflowAction =
  | { type: 'SET_STATE'; payload: Partial<WorkflowState> }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_SCENES'; payload: Scene[] | null }
  | { type: 'UPDATE_SCENE'; payload: { sceneId: string, updates: Partial<Scene> } }
  | { type: 'UPDATE_SCENE_VISUALS'; payload: { sceneId: string, searchQuery: string, selectedVideo: StockVideo | null } }
  | { type: 'DELETE_SCENE'; payload: string }
  | { type: 'ADD_SCENE'; payload: Scene }
  | { type: 'RESET_GENERATION_STATE' };

// Supabase Auth (simplified types, the library will provide full types)
export interface User {
  id: string;
  email?: string;
  credits?: number;
  isGuest?: boolean;
  // other properties from Supabase user object
}

export interface Session {
  access_token: string;
  user: User;
  // other properties from Supabase session object
}

// Stripe & Subscriptions
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';

export interface Subscription {
  id: string; // Subscription ID from Stripe
  user_id: string; // Matched to Supabase user ID
  status: SubscriptionStatus;
  price_id: string; // Price ID from Stripe
  current_period_end?: string; // The end date of the current billing period, as an ISO 8601 string
}

// License Keys
export interface LicenseKey {
    id: string;
    created_at: string;
    key_code: string;
    duration_days: number;
    plan_price_id: string;
    status: 'active' | 'redeemed' | 'expired';
    redeemed_by_user_id: string | null;
    redeemed_at: string | null;
    description: string | null;
}

// Gallery Creations
export interface GalleryItem {
  id: number;
  created_at: string;
  asset_url: string;
  type: 'image' | 'video';
  prompt_or_script: string;
  user_id: string;
}

// Social Connections
export interface SocialConnection {
  id: number;
  created_at: string;
  user_id: string;
  platform: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
}

// Live Analytics
export interface PostAnalytics {
    title: string;
    views: number;
    platform: string;
}

export interface AnalyticsData {
    impressions: { value: number; change: number };
    engagementRate: { value: number; change: number };
    followerGrowth: { value: number; change: number };
    performance: number[];
    topPosts: PostAnalytics[];
    aiSuggestions: string[];
}


// Content Calendar
export interface CalendarDay {
  day: number;
  title: string;
  hook: string;
}

export interface CalendarContent {
  ideas: CalendarDay[];
