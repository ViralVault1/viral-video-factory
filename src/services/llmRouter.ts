// src/services/llmRouter.ts - Complete error-free version

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
        return 'gemini';
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
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(`${provider} failed, trying fallback:`, error);
      
      try {
        if (provider === 'openai') {
          return await this.callGemini(prompt, maxTokens, temperature);
        } else {
          return await this.callOpenAI(prompt, maxTokens, temperature);
        }
      } catch (fallbackError) {
        const fallbackMessage = getErrorMessage(fallbackError);
        console.error('Both providers failed:', fallbackError);
        throw new Error(`All AI providers failed. Original: ${errorMessage}, Fallback: ${fallbackMessage}`);
      }
    }
  }

  private async callOpenAI(prompt: string, maxTokens: number, temperature: number): Promise<LLMResponse> {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Add REACT_APP_OPENAI_API_KEY to environment variables.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional content writer who creates high-quality, engaging content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.min(maxTokens, 4000),
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    return {
      content,
      provider: 'openai'
    };
  }

  private async callGemini(prompt: string, maxTokens: number, temperature: number): Promise<LLMResponse> {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found. Add REACT_APP_GEMINI_API_KEY to environment variables.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: Math.min(maxTokens, 8000)
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('Gemini returned empty content');
    }

    return {
      content,
      provider: 'gemini'
    };
  }
}

const llmRouter = new LLMRouter();
export default llmRouter;
