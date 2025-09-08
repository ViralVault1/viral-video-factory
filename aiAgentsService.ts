// Core AI Agents Service - Multi-LLM Architecture
import { getAiClient } from './geminiService';
import { supabase } from '../lib/supabaseClient';
import { userAnalyticsService } from './userAnalyticsService';
import { cacheService } from './cacheService';

// Types for AI Agents
export interface AgentRequest {
  type: 'content-strategy' | 'script-optimization' | 'brand-consistency' | 'performance-analytics';
  action: string;
  data: any;
  context: UserContext;
}

export interface AgentResponse {
  success: boolean;
  data: any;
  confidence: number;
  suggestions?: string[];
  metadata?: any;
}

export interface UserContext {
  userId: string;
  profile: UserProfile;
  history: ContentHistory[];
  preferences: UserPreferences;
  performance: PerformanceMetrics;
  brandKit?: BrandKit;
}

export interface UserProfile {
  id: string;
  contentType: string;
  voicePreference: string;
  videoStyle: string;
  targetAudience: string;
  niche: string;
  goals: string[];
}

export interface ContentHistory {
  id: string;
  script: string;
  performance: {
    views: number;
    engagement: number;
    shares: number;
    platform: string;
  };
  createdAt: string;
}

export interface UserPreferences {
  platforms: string[];
  contentLength: 'short' | 'medium' | 'long';
  postingFrequency: number;
  preferredTopics: string[];
}

export interface PerformanceMetrics {
  avgViews: number;
  avgEngagement: number;
  bestPerformingTopics: string[];
  optimalPostingTimes: string[];
  audienceInsights: any;
}

export interface BrandKit {
  name: string;
  voice: string;
  tone: string;
  values: string[];
  colors: {
    primary: string;
    secondary: string;
  };
  targetAudience: string;
}

// Multi-LLM Configuration
export interface LLMConfig {
  provider: 'gemini' | 'openai' | 'claude' | 'local';
  model: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
}

export const LLM_CONFIGS: Record<string, LLMConfig> = {
  // Primary LLM - Google Gemini (already configured)
  'gemini-flash': {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    temperature: 0.7
  },
  'gemini-pro': {
    provider: 'gemini',
    model: 'gemini-pro',
    temperature: 0.8
  },
  // OpenAI for specialized tasks
  'gpt-4-turbo': {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    maxTokens: 4000,
    temperature: 0.7
  },
  'gpt-3.5-turbo': {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    maxTokens: 2000,
    temperature: 0.6
  },
  // Claude for creative tasks
  'claude-3-sonnet': {
    provider: 'claude',
    model: 'claude-3-sonnet-20240229',
    maxTokens: 3000,
    temperature: 0.8
  }
};

// Multi-LLM Client
class MultiLLMClient {
  private configs: Record<string, LLMConfig>;

  constructor() {
    this.configs = LLM_CONFIGS;
  }

  async generateContent(
    prompt: string,
    modelKey: string = 'gemini-flash',
    options: any = {}
  ): Promise<any> {
    const config = this.configs[modelKey];
    
    try {
      switch (config.provider) {
        case 'gemini':
          return await this.callGemini(prompt, config, options);
        case 'openai':
          return await this.callOpenAI(prompt, config, options);
        case 'claude':
          return await this.callClaude(prompt, config, options);
        default:
          throw new Error(`Unsupported LLM provider: ${config.provider}`);
      }
    } catch (error) {
      console.error(`LLM call failed for ${modelKey}:`, error);
      // Fallback to Gemini if other models fail
      if (modelKey !== 'gemini-flash') {
        return await this.generateContent(prompt, 'gemini-flash', options);
      }
      throw error;
    }
  }

  private async callGemini(prompt: string, config: LLMConfig, options: any): Promise<any> {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: config.model,
      contents: prompt,
      config: {
        temperature: config.temperature,
        ...options
      }
    });
    return { text: response.text, provider: 'gemini' };
  }

  private async callOpenAI(prompt: string, config: LLMConfig, options: any): Promise<any> {
    // OpenAI integration
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        ...options
      })
    });

    const data = await response.json();
    return { 
      text: data.choices[0].message.content, 
      provider: 'openai',
      usage: data.usage 
    };
  }

  private async callClaude(prompt: string, config: LLMConfig, options: any): Promise<any> {
    // Claude integration (Anthropic)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        messages: [{ role: 'user', content: prompt }],
        ...options
      })
    });

    const data = await response.json();
    return { 
      text: data.content[0].text, 
      provider: 'claude',
      usage: data.usage 
    };
  }
}

// Base AI Agent Class
export abstract class BaseAIAgent {
  protected name: string;
  protected llmClient: MultiLLMClient;
  protected preferredModel: string;

  constructor(name: string, preferredModel: string = 'gemini-flash') {
    this.name = name;
    this.llmClient = new MultiLLMClient();
    this.preferredModel = preferredModel;
  }

  abstract process(data: any, context: UserContext): Promise<AgentResponse>;

  protected async generateWithLLM(
    prompt: string, 
    modelKey?: string, 
    options?: any
  ): Promise<any> {
    const model = modelKey || this.preferredModel;
    
    // Track API call for analytics
    const startTime = Date.now();
    
    try {
      const response = await this.llmClient.generateContent(prompt, model, options);
      const duration = Date.now() - startTime;
      
      // Track successful API call
      userAnalyticsService.trackAPICall(`${this.name}-${model}`, duration, true);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Track failed API call
      userAnalyticsService.trackAPICall(`${this.name}-${model}`, duration, false);
      
      throw error;
    }
  }

  protected async getCachedOrGenerate<T>(
    cacheKey: string,
    generator: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    return await cacheService.cachedCall(cacheKey, generator, ttl);
  }

  protected async saveAgentData(userId: string, agentType: string, data: any): Promise<void> {
    try {
      await supabase
        .from('agent_interactions')
        .insert({
          user_id: userId,
          agent_type: agentType,
          interaction_data: data,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to save agent data:', error);
    }
  }

  protected async getUserContext(userId: string): Promise<UserContext> {
    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get content history
      const { data: history } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      // Get brand kit
      const { data: brandKit } = await supabase
        .from('brand_kits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      return {
        userId,
        profile: profile || this.getDefaultProfile(),
        history: history || [],
        preferences: this.extractPreferences(profile),
        performance: await this.calculatePerformanceMetrics(history || []),
        brandKit: brandKit || undefined
      };
    } catch (error) {
      console.error('Failed to get user context:', error);
      return {
        userId,
        profile: this.getDefaultProfile(),
        history: [],
        preferences: this.getDefaultPreferences(),
        performance: this.getDefaultPerformanceMetrics()
      };
    }
  }

  private getDefaultProfile(): UserProfile {
    return {
      id: '',
      contentType: 'educational',
      voicePreference: 'alloy',
      videoStyle: 'professional',
      targetAudience: 'general',
      niche: 'general',
      goals: ['engagement', 'growth']
    };
  }

  private extractPreferences(profile: any): UserPreferences {
    return {
      platforms: ['youtube', 'tiktok'],
      contentLength: 'short',
      postingFrequency: 3,
      preferredTopics: []
    };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      platforms: ['youtube', 'tiktok'],
      contentLength: 'short',
      postingFrequency: 3,
      preferredTopics: []
    };
  }

  private async calculatePerformanceMetrics(history: any[]): Promise<PerformanceMetrics> {
    // Calculate metrics from user's content history
    const totalViews = history.reduce((sum, item) => sum + (item.views || 0), 0);
    const avgViews = history.length > 0 ? totalViews / history.length : 0;

    return {
      avgViews,
      avgEngagement: 0,
      bestPerformingTopics: [],
      optimalPostingTimes: ['9:00', '15:00', '20:00'],
      audienceInsights: {}
    };
  }

  private getDefaultPerformanceMetrics(): PerformanceMetrics {
    return {
      avgViews: 0,
      avgEngagement: 0,
      bestPerformingTopics: [],
      optimalPostingTimes: ['9:00', '15:00', '20:00'],
      audienceInsights: {}
    };
  }
}

// AI Agents Router
export class AIAgentsRouter {
  private agents: Map<string, BaseAIAgent> = new Map();

  registerAgent(type: string, agent: BaseAIAgent): void {
    this.agents.set(type, agent);
  }

  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    const agent = this.agents.get(request.type);
    
    if (!agent) {
      throw new Error(`Agent not found: ${request.type}`);
    }

    try {
      // Track agent usage
      userAnalyticsService.trackFeatureUsed(`ai-agent-${request.type}`, {
        action: request.action,
        userId: request.context.userId
      });

      const response = await agent.process(request.data, request.context);
      
      // Track successful agent interaction
      userAnalyticsService.trackEngagement('agent-success', request.type, response.confidence);
      
      return response;
    } catch (error) {
      // Track failed agent interaction
      userAnalyticsService.trackError(`Agent ${request.type} failed`, {
        action: request.action,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }
}

// Global AI Agents instance
export const aiAgentsRouter = new AIAgentsRouter();

// Helper function to create agent requests
export const createAgentRequest = (
  type: AgentRequest['type'],
  action: string,
  data: any,
  userId: string
): AgentRequest => ({
  type,
  action,
  data,
  context: {
    userId,
    profile: {
      id: userId,
      contentType: 'educational',
      voicePreference: 'alloy',
      videoStyle: 'professional',
      targetAudience: 'general',
      niche: 'general',
      goals: ['engagement', 'growth']
    },
    history: [],
    preferences: {
      platforms: ['youtube', 'tiktok'],
      contentLength: 'short',
      postingFrequency: 3,
      preferredTopics: []
    },
    performance: {
      avgViews: 0,
      avgEngagement: 0,
      bestPerformingTopics: [],
      optimalPostingTimes: ['9:00', '15:00', '20:00'],
      audienceInsights: {}
    }
  }
});

export default aiAgentsRouter;

