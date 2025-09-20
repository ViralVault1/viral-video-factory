// src/services/apiService.js
import openaiService from './openaiService';
import geminiService from './geminiService';
import llmRouter from './llmRouter';

class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
  }

  // Main content generation method that uses LLM routing
  async generateContent(prompt, options = {}) {
    const {
      type = 'creative',
      provider = 'auto',
      maxTokens = 1000,
      temperature = 0.7,
      ...otherOptions
    } = options;

    try {
      // Select best provider using LLM router
      const selectedProvider = provider === 'auto' 
        ? llmRouter.selectProvider(prompt, { type, ...otherOptions })
        : provider;

      // Estimate cost
      const estimatedCost = llmRouter.estimateCost(prompt, selectedProvider, maxTokens);

      let result;

      // Route to appropriate service
      switch (selectedProvider) {
        case 'openai':
          result = await openaiService.generateText(prompt, {
            maxTokens,
            temperature,
            ...otherOptions
          });
          break;
          
        case 'gemini':
          result = await geminiService.generateContent(prompt, type, {
            maxTokens,
            temperature,
            ...otherOptions
          });
          break;
          
        default:
          throw new Error(`Unknown provider: ${selectedProvider}`);
      }

      // Track usage
      llmRouter.trackUsage(selectedProvider, result.cost || estimatedCost);

      return {
        ...result,
        selectedProvider,
        estimatedCost,
        routingInfo: {
          taskType: type,
          providerReason: this.getProviderReason(selectedProvider, type)
        }
      };

    } catch (error) {
      console.error('Content generation failed:', error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  // Batch content generation
  async generateBatchContent(prompts, options = {}) {
    const results = [];
    const batchOptions = { ...options, batch: true };

    for (const prompt of prompts) {
      try {
        const result = await this.generateContent(prompt, batchOptions);
        results.push(result);
        
        // Small delay to avoid overwhelming APIs
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results.push({
          content: `Error generating content for prompt: ${prompt}`,
          error: error.message,
          prompt
        });
      }
    }

    return results;
  }

  // Video content generation
  async generateVideoContent(prompt, options = {}) {
    return this.generateContent(prompt, {
      type: 'video_script',
      provider: 'gemini', // Gemini is better for creative content
      ...options
    });
  }

  // Social media content generation
  async generateSocialContent(prompt, platform = 'general', options = {}) {
    const platformPrompt = this.optimizeForPlatform(prompt, platform);
    
    return this.generateContent(platformPrompt, {
      type: 'social',
      provider: 'gemini',
      ...options
    });
  }

  // Article generation
  async generateArticle(prompt, options = {}) {
    return this.generateContent(prompt, {
      type: 'article',
      provider: 'auto', // Let router decide based on complexity
      maxTokens: 2000,
      ...options
    });
  }

  // Ad copy generation
  async generateAdCopy(prompt, options = {}) {
    return this.generateContent(prompt, {
      type: 'ad_copy',
      provider: 'gemini',
      ...options
    });
  }

  // Image generation (delegated to OpenAI)
  async generateImage(prompt, options = {}) {
    try {
      return await openaiService.generateImage(prompt, options);
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  // Image analysis
  async analyzeImage(imageUrl, prompt = "Analyze this image", options = {}) {
    try {
      return await openaiService.analyzeImage(imageUrl, prompt);
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  // Get system status
  async getSystemStatus() {
    try {
      const [openaiHealth, geminiHealth] = await Promise.all([
        openaiService.testConnection(),
        geminiService.testConnection()
      ]);

      const routerStats = llmRouter.getUsageStats();
      const recommendations = llmRouter.getRecommendations();

      return {
        providers: {
          openai: openaiHealth,
          gemini: geminiHealth
        },
        usage: routerStats,
        recommendations,
        status: 'operational'
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Get cost optimization recommendations
  async getCostOptimization() {
    const stats = llmRouter.getUsageStats();
    const recommendations = [];

    if (stats.providerUsage.openai.requests > stats.providerUsage.gemini.requests * 2) {
      recommendations.push({
        type: 'provider_optimization',
        title: 'Switch to Gemini for Creative Tasks',
        description: 'You could save up to 97% by using Gemini for creative content generation',
        impact: 'High cost savings',
        action: 'Use Gemini for social posts, articles, and creative writing'
      });
    }

    if (stats.totalCost > 5) {
      recommendations.push({
        type: 'budget_alert',
        title: 'High Usage Detected',
        description: `Total spending: $${stats.totalCost.toFixed(2)}`,
        impact: 'Budget monitoring needed',
        action: 'Consider setting monthly limits or optimizing prompt efficiency'
      });
    }

    return {
      currentSpending: stats.totalCost,
      potentialSavings: stats.costSavings,
      recommendations
    };
  }

  // Helper methods
  optimizeForPlatform(prompt, platform) {
    const platformOptimizations = {
      twitter: `Create a Twitter post about: ${prompt}. Keep it concise, engaging, and under 280 characters.`,
      instagram: `Create an Instagram post about: ${prompt}. Make it visually descriptive and hashtag-friendly.`,
      linkedin: `Create a professional LinkedIn post about: ${prompt}. Make it business-focused and networking-oriented.`,
      facebook: `Create a Facebook post about: ${prompt}. Make it conversational and community-engaging.`,
      tiktok: `Create a TikTok video concept about: ${prompt}. Make it trendy, youth-oriented, and viral-worthy.`,
      youtube: `Create YouTube video content about: ${prompt}. Include title, description, and key talking points.`
    };

    return platformOptimizations[platform] || prompt;
  }

  getProviderReason(provider, type) {
    const reasons = {
      openai: {
        analysis: 'OpenAI selected for superior analytical capabilities',
        complex: 'OpenAI chosen for complex reasoning tasks',
        coding: 'OpenAI preferred for technical content'
      },
      gemini: {
        creative: 'Gemini selected for cost-effective creative content',
        social: 'Gemini chosen for social media optimization',
        content: 'Gemini preferred for general content generation',
        video_script: 'Gemini selected for creative video content',
        article: 'Gemini chosen for cost-effective article generation'
      }
    };

    return reasons[provider]?.[type] || `${provider} selected by intelligent routing`;
  }

  // Backend API calls (for production deployment)
  async callBackendAPI(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Backend API call failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

export default new APIService();
