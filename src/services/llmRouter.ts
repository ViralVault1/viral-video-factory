// src/services/llmRouter.ts - Secure version with API routes

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

export interface RouterOptions {
  type?: TaskType;
  forceProvider?: LLMProvider;
  maxCost?: number;
  maxTokens?: number;
  temperature?: number;
}

interface LLMResponse {
  content: string;
  provider: LLMProvider;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

class LLMRouter {
  selectProvider(prompt: string, options: RouterOptions = {}): LLMProvider {
    const { type, forceProvider, maxCost } = options;
    
    if (forceProvider) return forceProvider;
    if (maxCost && maxCost < 0.001) return 'gemini';
    
    // Force Gemini for all content generation tasks
    switch (type) {
      case 'creative':
      case 'social':
      case 'content':
      case 'video_script':
      case 'article':
      case 'content_generation':
      case 'script_writing':
        return 'gemini';
      case 'analysis':
      case 'complex':
      case 'coding':
        return 'openai';
      default:
        return 'gemini'; // Default to Gemini for cost savings
    }
  }

  async executeTask(prompt: string, options: RouterOptions = {}): Promise<LLMResponse> {
    const provider = this.selectProvider(prompt, options);
    const { maxTokens = 4000, temperature = 0.7 } = options;
    
    console.log(`LLM Router: Using ${provider} for task`);
    
    try {
      if (provider === 'openai') {
        return await this.callOpenAI(prompt, maxTokens, temperature);
      } else {
        return await this.callGemini(prompt, maxTokens, temperature);
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.error(`${provider} failed, trying fallback:`, error);
      
      try {
        if (provider === 'openai') {
          return await this.callGemini(prompt, maxTokens, temperature);
        } else {
          return await this.callOpenAI(prompt, maxTokens, temperature);
        }
      } catch (fallbackError: unknown) {
        const fallbackMessage = getErrorMessage(fallbackError);
        console.error('Both providers failed:', fallbackError);
        throw new Error(`All AI providers failed. Original: ${errorMessage}, Fallback: ${fallbackMessage}`);
      }
    }
  }

  private async callOpenAI(prompt: string, maxTokens: number, temperature: number): Promise<LLMResponse> {
    const response = await fetch('/api/llm-router', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        provider: 'openai', 
        maxTokens, 
        temperature 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'OpenAI request failed');
    }

    return await response.json();
  }

  private async callGemini(prompt: string, maxTokens: number, temperature: number): Promise<LLMResponse> {
    const response = await fetch('/api/llm-router', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt, 
        provider: 'gemini', 
        maxTokens, 
        temperature 
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Gemini request failed');
    }

    return await response.json();
  }
}

const llmRouter = new LLMRouter();
export default llmRouter;
