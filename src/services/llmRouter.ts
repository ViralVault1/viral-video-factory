// src/services/llmRouter.ts
interface LLMConfig {
  provider: 'openai' | 'gemini';
  fallbackProvider?: 'openai' | 'gemini';
  temperature?: number;
  systemPrompt?: string;
}

interface ExecuteTaskParams {
  task: string;
  config?: LLMConfig;
  onProgress?: (chunk: string) => void;
}

const defaultConfig: LLMConfig = {
  provider: 'gemini',
  fallbackProvider: 'openai',
  temperature: 0.7,
};

async function callAPI(
  provider: 'openai' | 'gemini',
  task: string,
  systemPrompt?: string,
  temperature?: number
): Promise<string> {
  const response = await fetch('/api/llm-router', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      task,
      systemPrompt,
      temperature,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }

  const data = await response.json();
  return data.result;
}

export async function executeTask({
  task,
  config = defaultConfig,
  onProgress,
}: ExecuteTaskParams): Promise<string> {
  const finalConfig = { ...defaultConfig, ...config };
  
  console.log('LLM Router: Using', finalConfig.provider, 'for task');

  try {
    const result = await callAPI(
      finalConfig.provider,
      task,
      finalConfig.systemPrompt,
      finalConfig.temperature
    );

    if (onProgress) {
      onProgress(result);
    }

    return result;
  } catch (primaryError) {
    const primaryErrorMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
    console.warn(`${finalConfig.provider} failed, trying fallback:`, primaryError);

    if (finalConfig.fallbackProvider && finalConfig.fallbackProvider !== finalConfig.provider) {
      try {
        const result = await callAPI(
          finalConfig.fallbackProvider,
          task,
          finalConfig.systemPrompt,
          finalConfig.temperature
        );

        if (onProgress) {
          onProgress(result);
        }

        return result;
      } catch (fallbackError) {
        const fallbackErrorMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        console.error('Both providers failed:', fallbackError);
        throw new Error(
          `All AI providers failed. Original: ${primaryErrorMessage}, Fallback: ${fallbackErrorMessage}`
        );
      }
    }

    throw primaryError;
  }
}

export const llmRouter = {
  executeTask,
};

export default llmRouter;
