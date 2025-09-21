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

export interface RouterOptions {
  type?: TaskType;
  forceProvider?: LLMProvider;
  maxCost?: number;
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
    
    return {
      content: `Generated content for: ${prompt.substring(0, 50)}...`,
      provider
    };
  }
}

const llmRouter = new LLMRouter();
export default llmRouter;
export { llmRouter };
