// src/hooks/useLLM.js (Working Version)
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import openaiService from '../services/openaiService';
import geminiService from '../services/geminiService';

const useLLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [costEstimate, setCostEstimate] = useState(0);

  // Main content generation function with intelligent routing
  const generateContent = useCallback(async (prompt, options = {}) => {
    const {
      provider = 'auto',
      type = 'creative',
      maxTokens = 1000,
      temperature = 0.7,
      ...otherOptions
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      let selectedProvider = provider;
      let result;

      // Intelligent provider selection
      if (provider === 'auto') {
        // Use Gemini for creative content (cheaper and good quality)
        // Use OpenAI for complex analysis and technical content
        if (type === 'analysis' || type === 'technical' || type === 'complex') {
          selectedProvider = 'openai';
        } else {
          selectedProvider = 'gemini';
        }
      }

      // Generate content with selected provider
      if (selectedProvider === 'openai') {
        result = await openaiService.generateText(prompt, {
          maxTokens,
          temperature,
          ...otherOptions
        });
      } else {
        result = await geminiService.generateContent(prompt, type, {
          maxTokens,
          temperature,
          ...otherOptions
        });
      }

      // Set cost estimate
      setCostEstimate(result.cost || 0);

      // Show success message with provider info
      if (result.warning) {
        toast.warning(result.warning);
      } else if (result.provider !== 'fallback') {
        toast.success(`Content generated with ${result.provider.toUpperCase()}`);
      }

      return {
        ...result,
        selectedProvider,
        routingReason: getRoutingReason(selectedProvider, type)
      };

    } catch (err) {
      setError(err.message);
      toast.error(`Generation failed: ${err.message}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Batch processing function
  const generateBatch = useCallback(async (prompts, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = [];
      const { provider = 'gemini', ...batchOptions } = options; // Default to Gemini for batch (cheaper)

      for (const prompt of prompts) {
        try {
          const result = await generateContent(prompt, { 
            provider, 
            ...batchOptions 
          });
          results.push(result);
          
          // Add delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          results.push({
            content: `Error generating content for: ${prompt}`,
            error: error.message,
            prompt,
            provider: 'error'
          });
        }
      }

      toast.success(`Generated ${results.length} pieces of content`);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [generateContent]);

  // Provider health check
  const checkProviderHealth = useCallback(async () => {
    try {
      const [openaiHealth, geminiHealth] = await Promise.allSettled([
        openaiService.testConnection(),
        geminiService.testConnection()
      ]);

      return {
        openai: openaiHealth.status === 'fulfilled' ? openaiHealth.value : { status: 'error', error: 'Connection failed' },
        gemini: geminiHealth.status === 'fulfilled' ? geminiHealth.value : { status: 'error', error: 'Connection failed' }
      };
    } catch (err) {
      console.error('Health check failed:', err);
      return {
        openai: { status: 'error', error: 'Health check failed' },
        gemini: { status: 'error', error: 'Health check failed' }
      };
    }
  }, []);

  // Specific content type generators
  const generateVideoScript = useCallback(async (prompt, options = {}) => {
    return generateContent(prompt, {
      type: 'video_script',
      provider: 'gemini', // Gemini is great for creative video content
      ...options
    });
  }, [generateContent]);

  const generateSocialPost = useCallback(async (prompt, platform = 'general', options = {}) => {
    const platformPrompt = optimizeForPlatform(prompt, platform);
    return generateContent(platformPrompt, {
      type: 'social',
      provider: 'gemini',
      ...options
    });
  }, [generateContent]);

  const generateArticle = useCallback(async (prompt, options = {}) => {
    return generateContent(prompt, {
      type: 'article',
      provider: 'auto', // Let intelligent routing decide
      maxTokens: 2000,
      ...options
    });
  }, [generateContent]);

  const generateAdCopy = useCallback(async (
