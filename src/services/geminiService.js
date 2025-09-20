// src/services/geminiService.js (Working Version)
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async generateText(prompt, options = {}) {
    const {
      model = 'gemini-pro',
      maxTokens = 1000,
      temperature = 0.7,
      ...otherOptions
    } = options;

    if (!this.apiKey) {
      console.error('Gemini API key not found');
      return this.fallbackResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseURL}/models/${model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature,
            ...otherOptions
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', response.status, errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error('Invalid Gemini API key or permission denied');
        } else if (response.status === 429) {
          throw new Error('Gemini rate limit exceeded');
        } else {
          throw new Error(`Gemini API error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const content = data.candidates[0].content.parts[0].text;
      const tokens = this.estimateTokens(prompt + content);
      
      return {
        content,
        tokens,
        cost: this.calculateCost(tokens),
        provider: 'gemini'
      };
    } catch (error) {
      console.error('Gemini service error:', error);
      return this.fallbackResponse(prompt);
    }
  }

  async generateContent(prompt, type = 'creative', options = {}) {
    const optimizedPrompt = this.optimizePromptForType(prompt, type);
    return this.generateText(optimizedPrompt, options);
  }

  optimizePromptForType(prompt, type) {
    const typePrompts = {
      creative: `Create engaging, creative content about: ${prompt}. Make it compelling and original with a modern, energetic tone.`,
      social: `Write a viral social media post about: ${prompt}. Make it engaging, shareable, and platform-optimized with relevant hashtags.`,
      video_script: `Write a compelling video script about: ${prompt}. Include a strong hook, main content, and clear call-to-action. Format for short-form video content.`,
      article: `Write a comprehensive, well-structured article about: ${prompt}. Include introduction, main points with examples, and conclusion. Make it SEO-friendly and engaging.`,
      ad_copy: `Create persuasive advertising copy for: ${prompt}. Focus on benefits, create urgency, and include a clear call-to-action. Make it conversion-focused.`,
      email: `Write a professional email about: ${prompt}. Make it clear, concise, and action-oriented with proper subject line.`,
      blog: `Create an engaging blog post about: ${prompt}. Make it informative, entertaining, and SEO-friendly with proper headings.`
    };

    return typePrompts[type] || prompt;
  }

  async generateBatch(prompts, type = 'creative', options = {}) {
    const results = [];
    
    for (const prompt of prompts) {
      try {
        const result = await this.generateContent(prompt, type, options);
        results.push(result);
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Batch generation failed for prompt: ${prompt}`, error);
        results.push({
          content: this.fallbackResponse(prompt).content,
          error: error.message,
          provider: 'gemini-fallback'
        });
      }
    }
    
    return results;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  calculateCost(tokens) {
    // Gemini Pro pricing: $0.00025 per 1K input tokens, $0.0005 per 1K output tokens
    return (tokens / 1000) * 0.000375;
  }

  async testConnection() {
    try {
      if (!this.apiKey) {
        return { status: 'error', error: 'API key not configured', provider: 'gemini' };
      }

      const testResponse = await this.generateText('Hello', { maxTokens: 10 });
      
      if (testResponse.provider === 'gemini') {
        return { status: 'connected', provider: 'gemini' };
      } else {
        return { status: 'error', error: 'API connection failed', provider: 'gemini' };
      }
    } catch (error) {
      return { status: 'error', error: error.message, provider: 'gemini' };
    }
  }

  // Fallback response when API fails
  fallbackResponse(prompt) {
    let content;
    
    if (prompt.toLowerCase().includes('video') || prompt.toLowerCase().includes('script')) {
      content = this.generateVideoContent(prompt);
    } else if (prompt.toLowerCase().includes('social') || prompt.toLowerCase().includes('post')) {
      content = this.generateSocialContent(prompt);
    } else if (prompt.toLowerCase().includes('article') || prompt.toLowerCase().includes('blog')) {
      content = this.generateArticleContent(prompt);
    } else if (prompt.toLowerCase().includes('ad') || prompt.toLowerCase().includes('copy')) {
      content = this.generateAdContent(prompt);
    } else {
      content = this.generateCreativeContent(prompt);
    }

    const tokens = Math.ceil(content.length / 4);

    return {
      content,
      tokens,
      cost: 0,
      provider: 'fallback',
      warning: 'Using fallback generation - check Gemini API key configuration'
    };
  }

  generateVideoContent(prompt) {
    return `🎥 VIRAL VIDEO CONCEPT: ${prompt}

HOOK (First 3 seconds):
"Stop scrolling! This ${prompt} revelation will change your perspective..."

STORY ARC:
✨ Setup: The common struggle everyone faces
✨ Conflict: Why normal solutions don't work  
✨ Resolution: The breakthrough approach

MAIN CONTENT:
Here's the game-changing insight about ${prompt}:

1. 🔍 The Hidden Truth: Most people miss this crucial element
2. ⚡ The Simple Solution: One change that makes all the difference
3. 🚀 The Results: Real transformation starts here

EMOTIONAL HOOKS:
- Curiosity: "You won't believe what I discovered..."
- Urgency: "This only works if you act fast"
- Social proof: "Thousands are already seeing results"

CALL-TO-ACTION:
💬 "Comment 'YES' if this opened your eyes!"
🔄 "Share this with someone who needs it"
❤️ "Save this - you'll want to reference it later!"

HASHTAGS: #${prompt.replace(/\s+/g, '')} #viral #breakthrough #gamechanging`;
  }

  generateSocialContent(prompt) {
    return `🔥 VIRAL INSIGHT: ${prompt}

The ${prompt} revelation that's breaking the internet:

❌ What everyone thinks works: [Common approach]
✅ What actually delivers results: [Counter-intuitive truth]

I stumbled upon this by accident, and it completely transformed my understanding...

Here's the breakdown:
💡 Game-changer #1: The overlooked factor that changes everything
💡 Game-changer #2: Why timing matters more than technique  
💡 Game-changer #3: The simple test that reveals the truth

Plot twist: Most people are doing the EXACT OPPOSITE of what works.

🎯 Quick experiment:
Try this for 24 hours and prepare to be amazed.

Who else is ready to challenge conventional wisdom about ${prompt}?

Tag someone who needs this wake-up call! 👇

#${prompt.replace(/\s+/g, '')} #breakthrough #gamechanging #viral`;
  }

  generateArticleContent(prompt) {
    return `# The ${prompt} Revolution: Everything You Thought You Knew Is Wrong

## The Paradigm Shift

The world of ${prompt} is undergoing a massive transformation. What worked yesterday is not only ineffective today—it's actively holding people back from achieving their potential.

## Why Traditional Approaches Are Failing

For decades, the standard advice around ${prompt} has been:
- Follow the same strategies everyone else uses
- Focus on quantity over strategic quality
- Hope for the best without real optimization

**This approach is not just outdated—it's counterproductive.**

## The Breakthrough Framework

Recent discoveries have revealed that ${prompt} operates on entirely different principles than previously understood. Here's what actually works:

### 1. The Foundation-First Approach
Instead of jumping into tactics, successful practitioners build a solid foundation:
- Deep understanding of underlying principles
- Strategic system design before scaling
- Focus on metrics that actually matter

### 2. The Data-Driven Revolution
Modern ${prompt} success relies on:
- Real-time feedback loops and optimization
- Continuous testing and iteration
- Behavioral insights that drive decisions

### 3. The Community-Centric Strategy
Today's winners understand that ${prompt} isn't just individual effort:
- Building genuine relationships and trust
- Creating value for others as the primary focus
- Leveraging network effects for exponential growth

## Your Implementation Blueprint

**Phase 1: Foundation (Week 1-2)**
- Audit your current approach and identify gaps
- Establish proper tracking and measurement systems
- Build the infrastructure for sustainable growth

**Phase 2: Strategic Launch (Week 3-4)**
- Implement optimized processes based on new principles
- Begin systematic testing and data collection
- Create feedback mechanisms for continuous improvement

**Phase 3: Scale and Optimize (Week 5+)**
- Double down on proven strategies
- Eliminate ineffective approaches
- Expand successful tactics systematically

## The Results Are Undeniable

Early adopters of this new approach report:
- 250-400% improvement in key performance metrics
- Significant reduction in time and resource investment
- Sustainable, long-term growth patterns

## Your Next Move

The ${prompt} landscape is evolving rapidly. Those who adapt to these new realities will thrive. Those who cling to outdated methods will be left behind.

The question isn't whether this transformation is happening—it's whether you'll be part of the revolution or watch from the sidelines.`;
  }

  generateAdContent(prompt) {
    return `🚨 BREAKTHROUGH ALERT: ${prompt} Users!

Struggling with mediocre results? Ready for a complete transformation?

🎯 WHAT IF I REVEALED...
There's a scientifically-proven system that's helped 75,000+ people achieve extraordinary ${prompt} results in just 21 days?

❌ Stop wasting time with outdated methods
❌ Stop settling for average results
❌ Stop feeling frustrated with slow progress

✅ GET ACCESS TO:
⚡ Revolutionary strategies that actually work
⚡ Step-by-step blueprint for rapid transformation  
⚡ Insider secrets from top 1% performers
⚡ 24/7 expert support and community access

🔥 EXCLUSIVE OFFER: 60% OFF TODAY ONLY
(Normally $297, now just $97)

💰 EXCLUSIVE BONUSES (Limited Time):
🎁 Advanced masterclass worth $197 - FREE
🎁 One-on-one strategy session - FREE
🎁 Lifetime access to all future updates - FREE

⚠️ URGENT: Only 250 spots available at this price

Real transformations from real people:
💬 "This completely changed my ${prompt} game!" - Sarah M.
💬 "Results in just 5 days - incredible!" - Marcus K.
💬 "Best investment I've ever made!" - Jennifer L.

🛒 SECURE YOUR TRANSFORMATION NOW

⏰ Limited time: [Countdown Timer]

*90-day money-back guarantee. Results documented.`;
  }

  generateCreativeContent(prompt) {
    return `✨ CREATIVE VISION: ${prompt}

Imagine if ${prompt} wasn't just a concept, but a transformative force that reshapes everything it touches...

🎨 THE BREAKTHROUGH PERSPECTIVE:
What if we completely reimagined ${prompt} from first principles? What would emerge?

Here's where innovation meets impact:

🌟 PARADIGM SHIFT #1:
The secret isn't doing more—it's doing differently. Most approaches to ${prompt} are built on assumptions that are fundamentally flawed.

🌟 PARADIGM SHIFT #2:  
Pattern recognition reveals that exceptional ${prompt} results follow a hidden architecture. Once you see it, everything clicks into place.

🌟 PARADIGM SHIFT #3:
The future belongs to those who can bridge the gap between traditional wisdom and breakthrough innovation.

💡 REVOLUTIONARY APPLICATIONS:
- Transform obstacles into accelerators
- Convert skeptics into advocates
- Turn challenges into competitive advantages

🚀 THE ULTIMATE POSSIBILITY:
When you combine strategic insight with creative execution, ${prompt} becomes not just achievable—it becomes inevitable.

The question isn't whether this transformation is possible.
The question is: How quickly will you embrace the new paradigm?

🎯 Ready to explore what's possible?

The revolution begins with a single decision...
And that decision starts now.`;
  }
}

export default new GeminiService();
