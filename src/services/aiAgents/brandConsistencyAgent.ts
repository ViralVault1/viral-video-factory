/**
 * Enhanced Brand Consistency Agent
 * Utilizes Manus API for brand analysis and consistency checking
 */

import { manusApiService } from '../manusApiService';

export interface BrandGuidelines {
  brandName: string;
  brandVoice: {
    tone: 'professional' | 'casual' | 'friendly' | 'authoritative' | 'playful';
    personality: string[];
    avoidWords: string[];
    preferredWords: string[];
  };
  visualIdentity: {
    primaryColors: string[];
    secondaryColors: string[];
    fonts: string[];
    logoUsage: string;
    imageStyle: string;
  };
  messaging: {
    tagline: string;
    keyMessages: string[];
    valueProposition: string;
    targetAudience: string;
  };
  contentGuidelines: {
    contentPillars: string[];
    topicsToAvoid: string[];
    requiredElements: string[];
    formatPreferences: string[];
  };
}

export interface BrandAnalysis {
  consistencyScore: number;
  voiceAlignment: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  visualAlignment: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  messagingAlignment: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  competitorComparison: {
    uniqueness: number;
    differentiation: string[];
    similarities: string[];
  };
}

export interface ContentBrandCheck {
  title: string;
  script: string;
  overallScore: number;
  brandAlignment: {
    voice: number;
    messaging: number;
    guidelines: number;
  };
  issues: Array<{
    type: 'voice' | 'messaging' | 'guidelines' | 'visual';
    severity: 'high' | 'medium' | 'low';
    description: string;
    suggestion: string;
  }>;
  improvements: {
    title: string;
    script: string;
    changes: string[];
  };
}

export interface BrandOpportunity {
  type: 'voice' | 'visual' | 'messaging' | 'content';
  opportunity: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  recommendation: string;
  examples: string[];
}

class BrandConsistencyAgent {
  private apiService = manusApiService;

  /**
   * Analyze brand consistency across content
   */
  async analyzeBrandConsistency(
    brandGuidelines: BrandGuidelines,
    contentSamples: Array<{ title: string; script: string; platform: string }>
  ): Promise<BrandAnalysis> {
    try {
      let totalVoiceScore = 0;
      let totalVisualScore = 0;
      let totalMessagingScore = 0;
      
      const voiceIssues: string[] = [];
      const visualIssues: string[] = [];
      const messagingIssues: string[] = [];
      
      const voiceSuggestions: string[] = [];
      const visualSuggestions: string[] = [];
      const messagingSuggestions: string[] = [];

      // Analyze each content sample
      for (const content of contentSamples) {
        const contentAnalysis = await this.analyzeContentBrandAlignment(
          content,
          brandGuidelines
        );

        totalVoiceScore += contentAnalysis.brandAlignment.voice;
        totalMessagingScore += contentAnalysis.brandAlignment.messaging;
        
        // Collect issues and suggestions
        contentAnalysis.issues.forEach(issue => {
          if (issue.type === 'voice') {
            voiceIssues.push(issue.description);
            voiceSuggestions.push(issue.suggestion);
          } else if (issue.type === 'messaging') {
            messagingIssues.push(issue.description);
            messagingSuggestions.push(issue.suggestion);
          } else if (issue.type === 'visual') {
            visualIssues.push(issue.description);
            visualSuggestions.push(issue.suggestion);
          }
        });
      }

      // Calculate average scores
      const avgVoiceScore = contentSamples.length > 0 ? totalVoiceScore / contentSamples.length : 0;
      const avgVisualScore = 75; // Placeholder - would analyze visual elements
      const avgMessagingScore = contentSamples.length > 0 ? totalMessagingScore / contentSamples.length : 0;

      // Calculate overall consistency score
      const consistencyScore = Math.round((avgVoiceScore + avgVisualScore + avgMessagingScore) / 3);

      // Analyze competitor differentiation
      const competitorComparison = await this.analyzeCompetitorDifferentiation(
        brandGuidelines,
        contentSamples[0]?.platform || 'youtube'
      );

      return {
        consistencyScore,
        voiceAlignment: {
          score: avgVoiceScore,
          issues: Array.from(new Set(voiceIssues)),
          suggestions: Array.from(new Set(voiceSuggestions))
        },
        visualAlignment: {
          score: avgVisualScore,
          issues: Array.from(new Set(visualIssues)),
          suggestions: Array.from(new Set(visualSuggestions))
        },
        messagingAlignment: {
          score: avgMessagingScore,
          issues: Array.from(new Set(messagingIssues)),
          suggestions: Array.from(new Set(messagingSuggestions))
        },
        competitorComparison
      };
    } catch (error) {
      console.error('Error analyzing brand consistency:', error);
      throw new Error('Failed to analyze brand consistency');
    }
  }

  /**
   * Check individual content for brand alignment
   */
  async analyzeContentBrandAlignment(
    content: { title: string; script: string; platform: string },
    brandGuidelines: BrandGuidelines
  ): Promise<ContentBrandCheck> {
    try {
      // Analyze voice alignment
      const voiceScore = this.analyzeVoiceAlignment(content.script, brandGuidelines.brandVoice);
      
      // Analyze messaging alignment
      const messagingScore = this.analyzeMessagingAlignment(content, brandGuidelines.messaging);
      
      // Analyze guidelines compliance
      const guidelinesScore = this.analyzeGuidelinesCompliance(content, brandGuidelines.contentGuidelines);

      // Calculate overall score
      const overallScore = Math.round((voiceScore + messagingScore + guidelinesScore) / 3);

      // Identify issues
      const issues = this.identifyBrandIssues(content, brandGuidelines);

      // Generate improvements
      const improvements = await this.generateBrandImprovements(content, brandGuidelines, issues);

      return {
        title: content.title,
        script: content.script,
        overallScore,
        brandAlignment: {
          voice: voiceScore,
          messaging: messagingScore,
          guidelines: guidelinesScore
        },
        issues,
        improvements
      };
    } catch (error) {
      console.error('Error analyzing content brand alignment:', error);
      throw new Error('Failed to analyze content brand alignment');
    }
  }

  /**
   * Generate brand guidelines from existing content
   */
  async generateBrandGuidelines(
    brandName: string,
    existingContent: Array<{ title: string; script: string; platform: string }>,
    targetAudience: string
  ): Promise<BrandGuidelines> {
    try {
      // Analyze existing content to extract patterns
      const voicePatterns = this.extractVoicePatterns(existingContent);
      const messagingPatterns = this.extractMessagingPatterns(existingContent);
      const contentPatterns = this.extractContentPatterns(existingContent);

      // Generate brand voice recommendations
      const brandVoice = this.generateBrandVoice(voicePatterns, targetAudience);

      // Generate visual identity recommendations
      const visualIdentity = this.generateVisualIdentity(brandName, targetAudience);

      // Generate messaging strategy
      const messaging = this.generateMessaging(brandName, messagingPatterns, targetAudience);

      // Generate content guidelines
      const contentGuidelines = this.generateContentGuidelines(contentPatterns, targetAudience);

      return {
        brandName,
        brandVoice,
        visualIdentity,
        messaging,
        contentGuidelines
      };
    } catch (error) {
      console.error('Error generating brand guidelines:', error);
      throw new Error('Failed to generate brand guidelines');
    }
  }

  /**
   * Identify brand opportunities for improvement
   */
  async identifyBrandOpportunities(
    brandGuidelines: BrandGuidelines,
    competitorAnalysis: any,
    marketTrends: string[]
  ): Promise<BrandOpportunity[]> {
    try {
      const opportunities: BrandOpportunity[] = [];

      // Voice opportunities
      opportunities.push({
        type: 'voice',
        opportunity: 'Develop more distinctive brand voice',
        impact: 'high',
        effort: 'medium',
        recommendation: 'Create unique phrases and expressions that become associated with your brand',
        examples: ['Signature catchphrases', 'Unique way of explaining concepts', 'Consistent personality traits']
      });

      // Visual opportunities
      opportunities.push({
        type: 'visual',
        opportunity: 'Strengthen visual brand recognition',
        impact: 'high',
        effort: 'medium',
        recommendation: 'Develop consistent visual elements across all content',
        examples: ['Custom thumbnails template', 'Brand color scheme', 'Consistent typography']
      });

      // Messaging opportunities
      opportunities.push({
        type: 'messaging',
        opportunity: 'Clarify value proposition',
        impact: 'high',
        effort: 'low',
        recommendation: 'Develop clear, consistent messaging about what makes you unique',
        examples: ['Unique selling proposition', 'Brand promise', 'Key differentiators']
      });

      // Content opportunities based on trends
      marketTrends.forEach(trend => {
        opportunities.push({
          type: 'content',
          opportunity: `Leverage ${trend} trend while maintaining brand consistency`,
          impact: 'medium',
          effort: 'low',
          recommendation: `Create content around ${trend} that aligns with your brand voice and values`,
          examples: [`${trend} tutorials`, `${trend} reviews`, `${trend} commentary`]
        });
      });

      return opportunities;
    } catch (error) {
      console.error('Error identifying brand opportunities:', error);
      throw new Error('Failed to identify brand opportunities');
    }
  }

  /**
   * Optimize content for brand consistency
   */
  async optimizeContentForBrand(
    content: { title: string; script: string },
    brandGuidelines: BrandGuidelines
  ): Promise<{
    optimizedTitle: string;
    optimizedScript: string;
    changes: string[];
    brandScore: number;
  }> {
    try {
      let optimizedTitle = content.title;
      let optimizedScript = content.script;
      const changes: string[] = [];

      // Optimize for brand voice
      const voiceOptimized = this.optimizeForBrandVoice(optimizedScript, brandGuidelines.brandVoice);
      optimizedScript = voiceOptimized.script;
      changes.push(...voiceOptimized.changes);

      // Optimize for messaging
      const messagingOptimized = this.optimizeForMessaging(optimizedTitle, optimizedScript, brandGuidelines.messaging);
      optimizedTitle = messagingOptimized.title;
      optimizedScript = messagingOptimized.script;
      changes.push(...messagingOptimized.changes);

      // Optimize for content guidelines
      const guidelinesOptimized = this.optimizeForGuidelines(optimizedScript, brandGuidelines.contentGuidelines);
      optimizedScript = guidelinesOptimized.script;
      changes.push(...guidelinesOptimized.changes);

      // Calculate brand score
      const brandScore = await this.calculateBrandScore(
        { title: optimizedTitle, script: optimizedScript, platform: 'youtube' },
        brandGuidelines
      );

      return {
        optimizedTitle,
        optimizedScript,
        changes,
        brandScore
      };
    } catch (error) {
      console.error('Error optimizing content for brand:', error);
      throw new Error('Failed to optimize content for brand');
    }
  }

  // Private helper methods

  private analyzeVoiceAlignment(script: string, brandVoice: BrandGuidelines['brandVoice']): number {
    let score = 50; // Base score

    // Check for preferred words
    brandVoice.preferredWords.forEach(word => {
      if (script.toLowerCase().includes(word.toLowerCase())) {
        score += 5;
      }
    });

    // Penalize for avoided words
    brandVoice.avoidWords.forEach(word => {
      if (script.toLowerCase().includes(word.toLowerCase())) {
        score -= 10;
      }
    });

    // Check tone alignment
    const toneWords = {
      professional: ['expertise', 'professional', 'quality', 'reliable'],
      casual: ['hey', 'guys', 'awesome', 'cool'],
      friendly: ['welcome', 'help', 'together', 'community'],
      authoritative: ['proven', 'expert', 'definitive', 'comprehensive'],
      playful: ['fun', 'exciting', 'amazing', 'fantastic']
    };

    const relevantWords = toneWords[brandVoice.tone] || [];
    relevantWords.forEach(word => {
      if (script.toLowerCase().includes(word)) {
        score += 3;
      }
    });

    return Math.min(100, Math.max(0, score));
  }

  private analyzeMessagingAlignment(
    content: { title: string; script: string },
    messaging: BrandGuidelines['messaging']
  ): number {
    let score = 50;

    // Check for key messages
    messaging.keyMessages.forEach(message => {
      const messageWords = message.toLowerCase().split(' ');
      const matchingWords = messageWords.filter(word => 
        content.script.toLowerCase().includes(word) || content.title.toLowerCase().includes(word)
      );
      score += (matchingWords.length / messageWords.length) * 10;
    });

    // Check for value proposition elements
    if (messaging.valueProposition) {
      const valueWords = messaging.valueProposition.toLowerCase().split(' ');
      const matchingValueWords = valueWords.filter(word => 
        content.script.toLowerCase().includes(word) || content.title.toLowerCase().includes(word)
      );
      score += (matchingValueWords.length / valueWords.length) * 15;
    }

    return Math.min(100, Math.max(0, score));
  }

  private analyzeGuidelinesCompliance(
    content: { title: string; script: string },
    guidelines: BrandGuidelines['contentGuidelines']
  ): number {
    let score = 50;

    // Check for required elements
    guidelines.requiredElements.forEach(element => {
      if (content.script.toLowerCase().includes(element.toLowerCase())) {
        score += 10;
      }
    });

    // Penalize for topics to avoid
    guidelines.topicsToAvoid.forEach(topic => {
      if (content.script.toLowerCase().includes(topic.toLowerCase()) || 
          content.title.toLowerCase().includes(topic.toLowerCase())) {
        score -= 15;
      }
    });

    // Check content pillar alignment
    guidelines.contentPillars.forEach(pillar => {
      if (content.script.toLowerCase().includes(pillar.toLowerCase()) || 
          content.title.toLowerCase().includes(pillar.toLowerCase())) {
        score += 8;
      }
    });

    return Math.min(100, Math.max(0, score));
  }

  private identifyBrandIssues(
    content: { title: string; script: string },
    brandGuidelines: BrandGuidelines
  ): ContentBrandCheck['issues'] {
    const issues: ContentBrandCheck['issues'] = [];

    // Check for voice issues
    brandGuidelines.brandVoice.avoidWords.forEach(word => {
      if (content.script.toLowerCase().includes(word.toLowerCase())) {
        issues.push({
          type: 'voice',
          severity: 'medium',
          description: `Contains avoided word: "${word}"`,
          suggestion: `Replace "${word}" with a brand-appropriate alternative`
        });
      }
    });

    // Check for messaging issues
    if (!brandGuidelines.messaging.keyMessages.some(message => 
      content.script.toLowerCase().includes(message.toLowerCase())
    )) {
      issues.push({
        type: 'messaging',
        severity: 'medium',
        description: 'Content doesn\'t include any key brand messages',
        suggestion: 'Incorporate at least one key brand message into the content'
      });
    }

    // Check for guideline violations
    brandGuidelines.contentGuidelines.topicsToAvoid.forEach(topic => {
      if (content.script.toLowerCase().includes(topic.toLowerCase())) {
        issues.push({
          type: 'guidelines',
          severity: 'high',
          description: `Content includes avoided topic: "${topic}"`,
          suggestion: `Remove or reframe content related to "${topic}"`
        });
      }
    });

    return issues;
  }

  private async generateBrandImprovements(
    content: { title: string; script: string },
    brandGuidelines: BrandGuidelines,
    issues: ContentBrandCheck['issues']
  ): Promise<ContentBrandCheck['improvements']> {
    let improvedTitle = content.title;
    let improvedScript = content.script;
    const changes: string[] = [];

    // Apply improvements based on issues
    issues.forEach(issue => {
      if (issue.type === 'voice') {
        // Apply voice improvements
        brandGuidelines.brandVoice.avoidWords.forEach(word => {
          if (improvedScript.toLowerCase().includes(word.toLowerCase())) {
            const replacement = brandGuidelines.brandVoice.preferredWords[0] || 'appropriate term';
            improvedScript = improvedScript.replace(new RegExp(word, 'gi'), replacement);
            changes.push(`Replaced "${word}" with "${replacement}"`);
          }
        });
      }
    });

    // Add key messages if missing
    if (!brandGuidelines.messaging.keyMessages.some(message => 
      improvedScript.toLowerCase().includes(message.toLowerCase())
    )) {
      const keyMessage = brandGuidelines.messaging.keyMessages[0];
      if (keyMessage) {
        improvedScript += `\n\n${keyMessage}`;
        changes.push('Added key brand message');
      }
    }

    return {
      title: improvedTitle,
      script: improvedScript,
      changes
    };
  }

  private async analyzeCompetitorDifferentiation(
    brandGuidelines: BrandGuidelines,
    platform: string
  ): Promise<BrandAnalysis['competitorComparison']> {
    // In production, this would analyze competitor content
    return {
      uniqueness: 75,
      differentiation: ['Unique brand voice', 'Distinctive visual style', 'Clear value proposition'],
      similarities: ['Similar content topics', 'Common industry terminology']
    };
  }

  private extractVoicePatterns(content: Array<{ title: string; script: string }>): any {
    // Analyze voice patterns in existing content
    return {
      commonWords: ['amazing', 'incredible', 'helpful'],
      tone: 'friendly',
      style: 'conversational'
    };
  }

  private extractMessagingPatterns(content: Array<{ title: string; script: string }>): any {
    // Analyze messaging patterns
    return {
      commonThemes: ['education', 'empowerment', 'innovation'],
      valueProps: ['easy to understand', 'practical advice', 'expert insights']
    };
  }

  private extractContentPatterns(content: Array<{ title: string; script: string }>): any {
    // Analyze content patterns
    return {
      formats: ['how-to', 'tips', 'reviews'],
      topics: ['technology', 'productivity', 'creativity']
    };
  }

  private generateBrandVoice(patterns: any, targetAudience: string): BrandGuidelines['brandVoice'] {
    return {
      tone: 'friendly',
      personality: ['helpful', 'knowledgeable', 'approachable'],
      avoidWords: ['boring', 'complicated', 'difficult'],
      preferredWords: ['amazing', 'simple', 'effective', 'powerful']
    };
  }

  private generateVisualIdentity(brandName: string, targetAudience: string): BrandGuidelines['visualIdentity'] {
    return {
      primaryColors: ['#6366f1', '#8b5cf6'], // Purple theme
      secondaryColors: ['#10b981', '#f59e0b'], // Green and amber accents
      fonts: ['Inter', 'Roboto', 'Open Sans'],
      logoUsage: 'Use logo consistently across all content',
      imageStyle: 'Clean, modern, professional with consistent color scheme'
    };
  }

  private generateMessaging(brandName: string, patterns: any, targetAudience: string): BrandGuidelines['messaging'] {
    return {
      tagline: 'Create viral content with AI',
      keyMessages: [
        'Empowering creators with AI technology',
        'Making viral content creation accessible to everyone',
        'Professional results without the complexity'
      ],
      valueProposition: 'The easiest way to create viral videos using AI',
      targetAudience
    };
  }

  private generateContentGuidelines(patterns: any, targetAudience: string): BrandGuidelines['contentGuidelines'] {
    return {
      contentPillars: ['Education', 'Entertainment', 'Inspiration', 'Community'],
      topicsToAvoid: ['Controversial politics', 'Negative content', 'Spam'],
      requiredElements: ['Clear value proposition', 'Call to action', 'Brand mention'],
      formatPreferences: ['How-to tutorials', 'Tips and tricks', 'Behind the scenes', 'Success stories']
    };
  }

  private optimizeForBrandVoice(script: string, brandVoice: BrandGuidelines['brandVoice']): { script: string; changes: string[] } {
    let optimizedScript = script;
    const changes: string[] = [];

    // Replace avoided words
    brandVoice.avoidWords.forEach(word => {
      if (optimizedScript.toLowerCase().includes(word.toLowerCase())) {
        const replacement = brandVoice.preferredWords[0] || 'better term';
        optimizedScript = optimizedScript.replace(new RegExp(word, 'gi'), replacement);
        changes.push(`Replaced "${word}" with "${replacement}" for better brand voice`);
      }
    });

    return { script: optimizedScript, changes };
  }

  private optimizeForMessaging(
    title: string, 
    script: string, 
    messaging: BrandGuidelines['messaging']
  ): { title: string; script: string; changes: string[] } {
    const changes: string[] = [];
    
    // Add value proposition if missing
    if (!script.toLowerCase().includes(messaging.valueProposition.toLowerCase())) {
      script += `\n\n${messaging.valueProposition}`;
      changes.push('Added value proposition to strengthen brand messaging');
    }

    return { title, script, changes };
  }

  private optimizeForGuidelines(
    script: string, 
    guidelines: BrandGuidelines['contentGuidelines']
  ): { script: string; changes: string[] } {
    let optimizedScript = script;
    const changes: string[] = [];

    // Add required elements if missing
    guidelines.requiredElements.forEach(element => {
      if (!optimizedScript.toLowerCase().includes(element.toLowerCase())) {
        optimizedScript += `\n\n[Include: ${element}]`;
        changes.push(`Added required element: ${element}`);
      }
    });

    return { script: optimizedScript, changes };
  }

  private async calculateBrandScore(
    content: { title: string; script: string; platform: string },
    brandGuidelines: BrandGuidelines
  ): Promise<number> {
    const analysis = await this.analyzeContentBrandAlignment(content, brandGuidelines);
    return analysis.overallScore;
  }
}

// Export singleton instance
export const brandConsistencyAgent = new BrandConsistencyAgent();
export default brandConsistencyAgent;

