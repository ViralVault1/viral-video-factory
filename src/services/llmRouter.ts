// src/services/llmRouter.ts
export type TaskType = 
  | 'analysis'
  | 'complex'
  | 'coding'
  | 'creative'
  | 'social'
  | 'content'
  | 'video_script'
  | 'article'
  | 'content_generation'
  | 'script_writing'
  | 'image_analysis'
  | 'data_processing';

export type LLMProvider = 'openai' | 'gemini';

export interface ProviderInfo {
  name: string;
  costPerToken: number;
  strengths: string[];
  status: 'online' | 'offline' | 'slow';
  latency: number;
}

export interface UsageStats {
  totalRequests: number;
  totalCost: number;
  providerUsage: {
    [key in LLMProvider]: {
      requests: number;
      cost: number;
    };
  };
  avgCostPerRequest: number;
  costSavings: {
    absoluteSavings: number;
    percentSavings: number;
  };
}

export interface RouterOptions {
  type?: TaskType;
  forceProvider?: LLMProvider;
  maxCost?: number;
}

export interface ProviderHealth {
  [key in LLMProvider]: {
    status: 'online' | 'offline' | 'slow';
    latency: number;
    lastCheck: string;
  };
}

export interface Recommendation {
  type: 'cost_optimization' | 'budget_alert' | 'performance';
  message: string;
  impact: string;
}

class LLMRouter {
  private providers: { [key in LLMProvider]: ProviderInfo };
  private usage: {
    totalRequests: number;
    totalCost: number;
    providerUsage: {
      [key in LLMProvider]: {
        requests: number;
        cost: number;
      };
    };
  };

  constructor() {
    this.providers = {
      openai: {
        name: 'OpenAI GPT-4',
        costPerToken: 0.00003,
        strengths: ['analysis', 'complex reasoning', 'coding'],
        status: 'online',
        latency: 120
      },
      gemini: {
        name: 'Google Gemini Pro',
        costPerToken: 0.000001,
        strengths: ['creative writing', 'content generation', 'social media'],
        status: 'online', 
        latency: 85
      }
    };
    
    this.usage = {
      totalRequests: 0,
      totalCost: 0,
      providerUsage: {
        openai: { requests: 0, cost: 0 },
        gemini: { requests: 0, cost: 0 }
      }
    };
  }

  // Intelligent provider selection
  selectProvider(prompt: string, options: RouterOptions = {}): LLMProvider {
    const { type, forceProvider, maxCost } = options;
    
    // If provider is forced, use it
    if (forceProvider && this.providers[forceProvider]) {
      return forceProvider;
    }
    
    // Cost-based selection
    if (maxCost && maxCost < 0.001) {
      return 'gemini'; // Always cheaper
    }
    
    // Task-based selection
    switch (type) {
      case 'analysis':
      case 'complex':
      case 'coding':
        return 'openai';
      
      case 'creative':
      case 'social':
      case 'content':
      case 'video_script':
      case 'article':
      case 'content_generation':
      case 'script_writing':
        return 'gemini';
        
      default:
        // Default to Gemini for cost efficiency
        return 'gemini';
    }
  }

  // Estimate cost for a request
  estimateCost(prompt: string, provider: LLMProvider, maxTokens: number = 1000): number {
    const inputTokens = Math.ceil(prompt.length / 4);
    const providerInfo = this.providers[provider];
    
    if (!providerInfo) return 0;
    
    return (inputTokens + maxTokens) * providerInfo.costPerToken;
  }

  // Track usage
  trackUsage(provider: LLMProvider, cost: number): void {
    this.usage.totalRequests++;
    this.usage.totalCost += cost;
    this.usage.providerUsage[provider].requests++;
    this.usage.providerUsage[provider].cost += cost;
  }

  // Get usage statistics
  getUsageStats(): UsageStats {
    return {
      ...this.usage,
      avgCostPerRequest: this.usage.totalCost / Math.max(this.usage.totalRequests, 1),
      costSavings: this.calculateSavings()
    };
  }

  // Calculate cost savings from smart routing
  private calculateSavings(): { absoluteSavings: number; percentSavings: number } {
    const totalGeminiRequests = this.usage.providerUsage.gemini.requests;
    const geminiCost = this.usage.providerUsage.gemini.cost;
    
    // Estimate what it would have cost with only OpenAI
    const estimatedOpenAICost = totalGeminiRequests * 0.02; // Average OpenAI cost
    const actualGeminiCost = geminiCost;
    
    const savings = estimatedOpenAICost - actualGeminiCost;
    const savingsPercent = (savings / Math.max(estimatedOpenAICost, 0.001)) * 100;
    
    return {
      absoluteSavings: savings,
      percentSavings: Math.min(savingsPercent, 99) // Cap at 99%
    };
  }

  // Check provider health
  async checkProviderHealth(): Promise<ProviderHealth> {
    // In a real implementation, this would ping the actual APIs
    return {
      openai: {
        status: Math.random() > 0.1 ? 'online' : 'slow',
        latency: 100 + Math.random() * 100,
        lastCheck: new Date().toISOString()
      },
      gemini: {
        status: Math.random() > 0.05 ? 'online' : 'slow', 
        latency: 70 + Math.random() * 50,
        lastCheck: new Date().toISOString()
      }
    };
  }

  // Get provider recommendations
  getRecommendations(requestHistory: any[] = []): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    const stats = this.getUsageStats();
    
    if (stats.providerUsage.openai.requests > stats.providerUsage.gemini.requests * 2) {
      recommendations.push({
        type: 'cost_optimization',
        message: 'Consider using Gemini for creative tasks to reduce costs',
        impact: 'Could save up to 97% on creative content generation'
      });
    }
    
    if (stats.totalCost > 1) {
      recommendations.push({
        type: 'budget_alert',
        message: 'High usage detected - consider setting budget limits',
        impact: `Current spending: $${stats.totalCost.toFixed(2)}`
      });
    }
    
    return recommendations;
  }

  // Execute a task with the selected provider
  async executeTask(prompt: string, options: RouterOptions = {}): Promise<{
    content: string;
    provider: LLMProvider;
    cost: number;
    tokens: number;
  }> {
    const provider = this.selectProvider(prompt, options);
    const estimatedCost = this.estimateCost(prompt, provider);
    
    try {
      let content: string;
      
      // Route to appropriate provider
      switch (provider) {
        case 'openai':
          content = await this.callOpenAI(prompt);
          break;
        case 'gemini':
          content = await this.callGemini(prompt);
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }
      
      // Track usage
      this.trackUsage(provider, estimatedCost);
      
      return {
        content,
        provider,
        cost: estimatedCost,
        tokens: Math.ceil(prompt.length / 4)
      };
      
    } catch (error) {
      console.error(`LLM Router error with ${provider}:`, error);
      throw error;
    }
  }

  // Call OpenAI API
  private async callOpenAI(prompt: string): Promise<string> {
    // Placeholder implementation - replace with actual OpenAI API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`OpenAI response to: ${prompt.substring(0, 50)}...`);
      }, 1000);
    });
  }

  // Call Gemini API
  private async callGemini(prompt: string): Promise<string> {
    // Placeholder implementation - replace with actual Gemini API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Gemini response to: ${prompt.substring(0, 50)}...`);
      }, 800);
    });
  }
}

// Export singleton instance and types
const llmRouter = new LLMRouter();
export default llmRouter;

// Named exports for compatibility
export { llmRouter };
export const router = llmRouter;
const llmRouter = {
  TaskType: 'string' as TaskType
};

export default llmRouter;
