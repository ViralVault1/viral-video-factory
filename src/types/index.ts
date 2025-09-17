export type GenerationMode = 'ai' | 'stock' | 'kinetic';

export type AdTemplate = 'UGC' | 'Luxury' | 'Tech Demo';

export interface BrandKit {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  font: 'font-sans' | 'font-serif' | 'font-mono';
  n8nWebhookUrl: string | null;
}

export interface KineticStyle {
  font: 'font-sans' | 'font-serif' | 'font-mono';
  palette: 'black-white' | 'neon' | 'pastel';
  animation: 'highlight' | 'fade' | 'popup';
  background: string;
}

export interface InspirationContent {
  title: string;
  url: string; // A realistic but fictional source URL
  summary: string; // A short summary of the video to be used as a script base
}

export interface NextSteps {
  tiktok: { caption: string };
  instagram: { caption: string };
  youtube: { title: string; description: string };
  x: { caption: string };
  linkedin: { caption: string };
  blog: { title: string; idea: string };
}

export interface TextOverlay {
  text: string;
  position: 'top' | 'middle' | 'bottom';
  color: string;
}

export interface LogoOverlay {
  url: string | null;
  size: number; // as a percentage of video width
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface VideoConcept {
  title: string;
  hook: string;
}

export interface ContentIdeas {
  viralAngles: string[];
  videoConcepts: VideoConcept[];
}

export interface StockVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
}

export interface Scene {
  id: string;
  script: string;
  searchQuery: string;
  selectedVideo: StockVideo | null;
  isLoading: boolean;
}

export interface ViralOptimization {
  hook: string;
  strategy: string;
}

export interface ViralOptimizations {
  hooks: ViralOptimization[];
  titles: string[];
}

export interface SocialCopy {
  tiktok: string;
  x: string;
  linkedin: string;
  instagram: string;
  youtube: string;
}

export interface ProductHuntReport {
  productName: string;
  tagline: string;
  oneLiner: string;
  targetAudience: string;
  painPoints: string[];
  viralHooks: string[];
  videoScript: string;
  socialCopy: SocialCopy;
}

export interface ProductAdReport {
  productName: string;
  targetAudience: string;
  videoScript: string;
  videoPrompt: string;
}

export interface CharacterStoryReport {
  characterName: string;
  backstory: string;
  videoScript: string;
  videoPrompt: string;
}

// For Viral Video Deconstructor
export interface YouTubeRemixKit {
  viralAnalysis: string;
  suggestedTitles: string[];
  rewrittenScripts: {
    title: string;
    script: string;
  }[];
}

// For Toast Notifications
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// For AI Creative Director Chat
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// For AI Model Selection
export type AiModel = 'veo' | 'luma' | 'veo3';
export type VideoLength = 'short-clip' | 'extended-scene' | 'short-film';

// For Credit System
export type CreditAction = 
  | 'veoVideoGeneration' 
  | 'lumaVideoGeneration'
  | 'veo3VideoGeneration'
  | 'klingShortFilm'
  | 'imageGeneration'
  | 'contentPlanGeneration'
  | 'contentDraftGeneration';

// For Workflow State Management
export interface WorkflowState {
  searchTopic: string;
  isSearching: boolean;
  inspirationResults: InspirationContent[];
  
  videoLink: string;
  headlines: string[];
  isLoadingHeadlines: boolean;
  
  script: string;
  isGeneratingScript: boolean;
  isRewriting: boolean;
  isOptimizing: boolean;
  viralOptimizations: ViralOptimizations | null;
  
  selectedVoice: string;
  selectedMusic: string;
  backgroundMusicUrl: string | null;

  generationMode: GenerationMode;
  selectedAiModel: AiModel;
  selectedVideoLength: VideoLength;
  visualPrompt: string;
  soundEffects: string;
  isGeneratingVideo: boolean;
  videoUrl: string | null;
  audioUrl: string | null;
  silentVideoUrl: string | null; // For AI and Stock modes
  voiceoverUrl: string | null;   // For all modes
  scenes: Scene[] | null;
  kineticStyle: KineticStyle;
  kineticPreviewReady: boolean;
  subtitles: string | null;
  isGeneratingSubtitles: boolean;

  isEditing: boolean;
  textOverlay: TextOverlay;
  logoOverlay: LogoOverlay;
  voiceoverVolume: number;
  musicVolume: number;
  
  nextSteps: NextSteps | null;
  isGeneratingNextSteps: boolean;

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
}

// Content Suite
export interface ContentPlan {
  pillars: string[];
  ideas: PostIdea[];
}

export interface PostIdea {
  title: string;
  description: string;
}

export interface ContentDrafts {
  tiktokScript: string;
  linkedinPost: string;
  xPost: string;
  facebookPost: string;
}

// Live Scheduler
export interface ScheduledPost {
    id: number;
    created_at: string;
    user_id: string;
    platform: string;
    content: string;
    scheduled_at: string;
    status: 'queued' | 'posted' | 'failed';
    error_message: string | null;
}

// AI Influencer Studio
export interface AIPersona {
  name: string;
  backstory: string;
  personalityTraits: string;
  visualStyle: string;
}

export interface AIContentStrategy {
  pillars: string[];
  postIdeas: PostIdea[];
}

export interface AIPersonaContentPackage {
  instagramPost: string;
  fanvueTeaser: string;
  videoScript: string;
}

// AI Autopilot
export interface AutopilotSettings {
  user_id: string;
  status: 'active' | 'inactive';
  frequency: number;
  niche: string;
  tone: string;
  mix: {
    educational: number;
    promotional: number;
    engagement: number;
  };
}

