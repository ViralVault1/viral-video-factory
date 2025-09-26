// src/services/llmRouter.ts - FIXED VERSION WITH REAL API CALLS

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

  async executeTask(prompt: string, options: RouterOptions = {}): Promise<{
    content: string;
    provider: LLMProvider;
  }> {
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
      console.error(`${provider} failed, trying fallback:`, error);
      
      // Fallback to the other provider
      if (provider === 'openai') {
        return await this.callGemini(prompt, maxTokens, temperature);
      } else {
        return await this.callOpenAI(prompt, maxTokens, temperature);
      }
    }
  }

  private async callOpenAI(prompt: string, maxTokens: number, temperature: number): Promise<{
    content: string;
    provider: LLMProvider;
  }> {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found in environment variables');
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
        max_tokens: maxTokens,
        temperature: temperature
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    return {
      content,
      provider: 'openai'
    };
  }

  private async callGemini(prompt: string, maxTokens: number, temperature: number): Promise<{
    content: string;
    provider: LLMProvider;
  }> {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
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
          maxOutputTokens: maxTokens
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

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
export { llmRouter };
