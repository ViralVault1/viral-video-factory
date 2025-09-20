// src/services/openaiService.js (Working Version)
class OpenAIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateText(prompt, options = {}) {
    const {
      model = 'gpt-4',
      maxTokens = 1000,
      temperature = 0.7,
      ...otherOptions
    } = options;

    if (!this.apiKey) {
      console.error('OpenAI API key not found');
      return this.fallbackResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature,
          ...otherOptions
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid OpenAI API key');
        } else if (response.status === 429) {
          throw new Error('OpenAI rate limit exceeded');
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        tokens: data.usage.total_tokens,
        cost: this.calculateCost(data.usage.total_tokens),
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI service error:', error);
      // Fall back to local generation if API fails
      return this.fallbackResponse(prompt);
    }
  }

  async generateImage(prompt, options = {}) {
    const {
      size = '1024x1024',
      quality = 'standard',
      ...otherOptions
    } = options;

    if (!this.apiKey) {
      console.error('OpenAI API key not found');
      return this.fallbackImageResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          size,
          quality,
          n: 1,
          ...otherOptions
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI Image API error:', response.status, errorData);
        throw new Error(`OpenAI image generation failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        imageUrl: data.data[0].url,
        prompt,
        cost: this.calculateImageCost(size, quality),
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI image service error:', error);
      return this.fallbackImageResponse(prompt);
    }
  }

  async analyzeImage(imageUrl, prompt = "Describe this image") {
    if (!this.apiKey) {
      console.error('OpenAI API key not found');
      return this.fallbackAnalysisResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI Vision API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        analysis: data.choices[0].message.content,
        tokens: data.usage.total_tokens,
        cost: this.calculateCost(data.usage.total_tokens),
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI image analysis error:', error);
      return this.fallbackAnalysisResponse(prompt);
    }
  }

  calculateCost(tokens) {
    // GPT-4 pricing: $0.03 per 1K tokens input, $0.06 per 1K tokens output
    return (tokens / 1000) * 0.045;
  }

  calculateImageCost(size, quality) {
    // DALL-E 3 pricing
    if (size === '1024x1024') return quality === 'hd' ? 0.08 : 0.04;
    if (size === '1792x1024' || size === '1024x1792') return quality === 'hd' ? 0.12 : 0.08;
    return 0.04;
  }

  async testConnection() {
    try {
      if (!this.apiKey) {
        return { status: 'error', error: 'API key not configured', provider: 'openai' };
      }

      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (response.ok) {
        return { status: 'connected', provider: 'openai' };
      } else {
        return { status: 'error', error: `HTTP ${response.status}`, provider: 'openai' };
      }
    } catch (error) {
      return { status: 'error', error: error.message, provider: 'openai' };
    }
  }

  // Fallback methods when API fails
  fallbackResponse(prompt) {
    const fallbacks = {
      video: this.generateVideoScript(prompt),
      social: this.generateSocialPost(prompt),
      article: this.generateArticle(prompt),
      default: this.generateGenericContent(prompt)
    };

    let type = 'default';
    if (prompt.toLowerCase().includes('video') || prompt.toLowerCase().includes('script')) type = 'video';
    else if (prompt.toLowerCase().includes('social') || prompt.toLowerCase().includes('post')) type = 'social';
    else if (prompt.toLowerCase().includes('article') || prompt.toLowerCase().includes('blog')) type = 'article';

    const content = fallbacks[type];
    return {
      content,
      tokens: Math.ceil(content.length / 4),
      cost: 0,
      provider: 'fallback',
      warning: 'Using fallback generation - check API key configuration'
    };
  }

  fallbackImageResponse(prompt) {
    return {
      imageUrl: `https://picsum.photos/1024/1024?random=${Date.now()}`,
      prompt,
      cost: 0,
      provider: 'fallback',
      warning: 'Using placeholder image - check API key configuration'
    };
  }

  fallbackAnalysisResponse(prompt) {
    return {
      analysis: `Analysis for: ${prompt}. This image appears to contain visual elements suitable for the requested analysis. For detailed AI-powered analysis, please ensure your OpenAI API key is properly configured.`,
      tokens: 50,
      cost: 0,
      provider: 'fallback',
      warning: 'Using fallback analysis - check API key configuration'
    };
  }

  generateVideoScript(prompt) {
    return `🎬 VIDEO SCRIPT: ${prompt}

HOOK (0-3 seconds):
"Wait... this ${prompt} technique will change everything!"

MAIN CONTENT (3-45 seconds):
Here's what most people don't know about ${prompt}:

1. The hidden factor that makes all the difference
2. Why traditional approaches fall short
3. The breakthrough method that actually works

PROOF (45-50 seconds):
This approach has helped thousands achieve remarkable results.

CALL TO ACTION (50-60 seconds):
Try this technique and see the transformation yourself!
Follow for more game-changing insights!

#${prompt.replace(/\s+/g, '')} #viral #gamechanging`;
  }

  generateSocialPost(prompt) {
    return `🚀 Game-changing insight about ${prompt}:

Most people completely miss this crucial element...

The breakthrough? ${prompt} isn't just about the obvious factors - it's about understanding the hidden dynamics that drive real results.

Here's what I've discovered:
✨ The counter-intuitive approach that works
✨ Why conventional wisdom falls short  
✨ The simple shift that changes everything

Ready to transform your approach to ${prompt}?

#${prompt.replace(/\s+/g, '')} #breakthrough #gamechanging`;
  }

  generateArticle(prompt) {
    return `# The Ultimate Guide to ${prompt}

## Introduction

Understanding ${prompt} has become crucial in today's landscape. This comprehensive guide explores the key strategies and insights you need to succeed.

## Why ${prompt} Matters

The significance of ${prompt} cannot be overstated. Recent developments have shown that those who master these principles achieve substantially better outcomes.

## Key Strategies

### 1. Foundation Building
Start with a solid understanding of core principles. This involves:
- Comprehensive research and analysis
- Strategic planning and goal setting
- Implementation of best practices

### 2. Advanced Techniques
Once you've mastered the basics, focus on:
- Optimization and refinement
- Scaling successful approaches
- Continuous improvement processes

## Implementation Framework

Follow this step-by-step approach:
1. Assessment and planning phase
2. Strategic implementation
3. Monitoring and optimization
4. Scaling and expansion

## Conclusion

Success with ${prompt} requires dedication, strategic thinking, and consistent execution. By following these principles, you'll be well-positioned to achieve exceptional results.`;
  }

  generateGenericContent(prompt) {
    return `Comprehensive analysis of ${prompt}:

This topic represents a significant opportunity for growth and development. Key considerations include understanding the fundamental principles, implementing strategic approaches, and maintaining consistent execution.

The most effective strategy involves:
- Thorough research and preparation
- Strategic planning and implementation  
- Continuous monitoring and optimization
- Adaptation based on results and feedback

Success in this area requires both strategic thinking and tactical execution, combined with the flexibility to adapt as conditions change.`;
  }
}

export default new OpenAIService();
