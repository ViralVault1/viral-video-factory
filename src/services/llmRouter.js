// src/services/llmRouter.js
class LLMRouter {
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
  selectProvider(prompt, options = {}) {
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
        return 'gemini';
        
      default:
        // Default to Gemini for cost efficiency
        return 'gemini';
    }
  }

  // Estimate cost for a request
  estimateCost(prompt, provider, maxTokens = 1000) {
    const inputTokens = Math.ceil(prompt.length / 4);
    const providerInfo = this.providers[provider];
    
    if (!providerInfo) return 0;
    
    return (inputTokens + maxTokens) * providerInfo.costPerToken;
  }

  // Track usage
  trackUsage(provider, cost) {
    this.usage.totalRequests++;
    this.usage.totalCost += cost;
    this.usage.providerUsage[provider].requests++;
    this.usage.providerUsage[provider].cost += cost;
  }

  // Get usage statistics
  getUsageStats() {
    return {
      ...this.usage,
      avgCostPerRequest: this.usage.totalCost / Math.max(this.usage.totalRequests, 1),
      costSavings: this.calculateSavings()
    };
  }

  // Calculate cost savings from smart routing
  calculateSavings() {
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
  async checkProviderHealth() {
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
  getRecommendations(requestHistory = []) {
    const recommendations = [];
    
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
}

// Export singleton instance
export default new LLMRouter();
