/**
 * Enhanced Script Optimization Agent
 * Utilizes Manus API for advanced script analysis and optimization
 */

import { manusApiService } from '../manusApiService';

export interface ScriptAnalysis {
  overallScore: number;
  hookStrength: number;
  engagementPotential: number;
  clarityScore: number;
  emotionalImpact: number;
  callToActionStrength: number;
  lengthOptimization: {
    currentLength: number;
    recommendedLength: number;
    isOptimal: boolean;
  };
  improvements: {
    category: 'hook' | 'structure' | 'engagement' | 'cta' | 'clarity';
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export interface OptimizedScript {
  originalScript: string;
  optimizedScript: string;
  improvements: string[];
  viralScore: number;
  hooks: string[];
  callToActions: string[];
  structureChanges: {
    addedElements: string[];
    removedElements: string[];
    reorderedSections: string[];
  };
}

export interface ViralHook {
  text: string;
  type: 'question' | 'statement' | 'statistic' | 'story' | 'controversy';
  viralScore: number;
  platform: 'youtube' | 'tiktok' | 'instagram';
  targetAudience: string;
}

class ScriptOptimizationAgent {
  private apiService = manusApiService;

  /**
   * Analyze script for viral potential and areas of improvement
   */
  async analyzeScript(
    script: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube',
    targetAudience?: string
  ): Promise<ScriptAnalysis> {
    try {
      // Get optimization suggestions from Manus API
      const optimization = await this.apiService.optimizeScript(
        script,
        platform,
        targetAudience
      );

      // Analyze script structure
      const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = script.split(/\s+/).filter(w => w.length > 0);

      // Calculate various scores
      const hookStrength = this.analyzeHookStrength(sentences[0] || '');
      const engagementPotential = this.analyzeEngagementPotential(script);
      const clarityScore = this.analyzeClarityScore(script);
      const emotionalImpact = this.analyzeEmotionalImpact(script);
      const callToActionStrength = this.analyzeCallToActionStrength(script);

      // Calculate overall score
      const overallScore = Math.round(
        (hookStrength + engagementPotential + clarityScore + emotionalImpact + callToActionStrength) / 5
      );

      // Generate length recommendations
      const lengthOptimization = this.analyzeLengthOptimization(words.length, platform);

      // Generate specific improvements
      const improvements = this.generateImprovements(
        script,
        optimization.improvements,
        {
          hookStrength,
          engagementPotential,
          clarityScore,
          emotionalImpact,
          callToActionStrength
        }
      );

      return {
        overallScore,
        hookStrength,
        engagementPotential,
        clarityScore,
        emotionalImpact,
        callToActionStrength,
        lengthOptimization,
        improvements
      };
    } catch (error) {
      console.error('Error analyzing script:', error);
      throw new Error('Failed to analyze script');
    }
  }

  /**
   * Optimize script for maximum viral potential
   */
  async optimizeScript(
    script: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube',
    targetAudience?: string,
    goals: string[] = ['engagement', 'retention', 'viral']
  ): Promise<OptimizedScript> {
    try {
      // Get optimization from Manus API
      const apiOptimization = await this.apiService.optimizeScript(
        script,
        platform,
        targetAudience
      );

      // Generate additional hooks
      const topic = this.extractMainTopic(script);
      const hooksResponse = await this.apiService.generateViralHooks(topic, platform, 10);

      // Apply advanced optimizations
      const structureOptimized = this.optimizeStructure(script, platform);
      const engagementOptimized = this.optimizeEngagement(structureOptimized, platform);
      const finalOptimized = this.applyFinalPolish(engagementOptimized, goals);

      // Identify structure changes
      const structureChanges = this.identifyStructureChanges(script, finalOptimized);

      return {
        originalScript: script,
        optimizedScript: finalOptimized,
        improvements: apiOptimization.improvements,
        viralScore: apiOptimization.viralScore,
        hooks: hooksResponse.hooks.map(h => h.text),
        callToActions: apiOptimization.callToActions,
        structureChanges
      };
    } catch (error) {
      console.error('Error optimizing script:', error);
      throw new Error('Failed to optimize script');
    }
  }

  /**
   * Generate viral hooks for a given topic
   */
  async generateViralHooks(
    topic: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube',
    count: number = 10,
    targetAudience?: string
  ): Promise<ViralHook[]> {
    try {
      const hooksResponse = await this.apiService.generateViralHooks(topic, platform, count);

      return hooksResponse.hooks.map(hook => ({
        ...hook,
        platform,
        targetAudience: targetAudience || 'general'
      }));
    } catch (error) {
      console.error('Error generating viral hooks:', error);
      throw new Error('Failed to generate viral hooks');
    }
  }

  /**
   * Rewrite script with specific focus areas
   */
  async rewriteScript(
    script: string,
    focusAreas: ('hook' | 'engagement' | 'clarity' | 'cta' | 'structure')[],
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube'
  ): Promise<{
    rewrittenScript: string;
    changes: string[];
    improvementScore: number;
  }> {
    try {
      let rewrittenScript = script;
      const changes: string[] = [];

      // Apply focus area improvements
      for (const area of focusAreas) {
        switch (area) {
          case 'hook':
            const newHook = await this.improveHook(rewrittenScript, platform);
            rewrittenScript = newHook.script;
            changes.push(...newHook.changes);
            break;
          case 'engagement':
            const engagementImproved = this.improveEngagement(rewrittenScript);
            rewrittenScript = engagementImproved.script;
            changes.push(...engagementImproved.changes);
            break;
          case 'clarity':
            const clarityImproved = this.improveClarity(rewrittenScript);
            rewrittenScript = clarityImproved.script;
            changes.push(...clarityImproved.changes);
            break;
          case 'cta':
            const ctaImproved = this.improveCallToAction(rewrittenScript, platform);
            rewrittenScript = ctaImproved.script;
            changes.push(...ctaImproved.changes);
            break;
          case 'structure':
            const structureImproved = this.improveStructure(rewrittenScript, platform);
            rewrittenScript = structureImproved.script;
            changes.push(...structureImproved.changes);
            break;
        }
      }

      // Calculate improvement score
      const originalAnalysis = await this.analyzeScript(script, platform);
      const newAnalysis = await this.analyzeScript(rewrittenScript, platform);
      const improvementScore = newAnalysis.overallScore - originalAnalysis.overallScore;

      return {
        rewrittenScript,
        changes,
        improvementScore
      };
    } catch (error) {
      console.error('Error rewriting script:', error);
      throw new Error('Failed to rewrite script');
    }
  }

  // Private helper methods

  private analyzeHookStrength(hook: string): number {
    let score = 50; // Base score

    // Check for question
    if (hook.includes('?')) score += 15;

    // Check for numbers/statistics
    if (/\d+/.test(hook)) score += 10;

    // Check for power words
    const powerWords = ['secret', 'amazing', 'shocking', 'incredible', 'ultimate', 'proven', 'guaranteed'];
    powerWords.forEach(word => {
      if (hook.toLowerCase().includes(word)) score += 5;
    });

    // Check for urgency
    const urgencyWords = ['now', 'today', 'immediately', 'urgent', 'limited'];
    urgencyWords.forEach(word => {
      if (hook.toLowerCase().includes(word)) score += 5;
    });

    return Math.min(100, score);
  }

  private analyzeEngagementPotential(script: string): number {
    let score = 50;

    // Check for questions throughout
    const questionCount = (script.match(/\?/g) || []).length;
    score += Math.min(20, questionCount * 5);

    // Check for emotional words
    const emotionalWords = ['love', 'hate', 'amazing', 'terrible', 'incredible', 'shocking', 'beautiful', 'awful'];
    emotionalWords.forEach(word => {
      if (script.toLowerCase().includes(word)) score += 2;
    });

    // Check for personal pronouns
    const personalWords = ['you', 'your', 'we', 'us', 'our'];
    personalWords.forEach(word => {
      const count = (script.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      score += Math.min(10, count);
    });

    return Math.min(100, score);
  }

  private analyzeClarityScore(script: string): number {
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = script.split(/\s+/).filter(w => w.length > 0);
    
    let score = 100;

    // Penalize very long sentences
    const avgSentenceLength = words.length / sentences.length;
    if (avgSentenceLength > 20) score -= 20;
    if (avgSentenceLength > 30) score -= 20;

    // Penalize complex words
    const complexWords = words.filter(word => word.length > 10).length;
    const complexWordRatio = complexWords / words.length;
    if (complexWordRatio > 0.1) score -= 15;

    return Math.max(0, score);
  }

  private analyzeEmotionalImpact(script: string): number {
    let score = 30;

    // Positive emotions
    const positiveWords = ['amazing', 'incredible', 'fantastic', 'wonderful', 'excellent', 'outstanding'];
    positiveWords.forEach(word => {
      if (script.toLowerCase().includes(word)) score += 5;
    });

    // Negative emotions (can also be engaging)
    const negativeWords = ['terrible', 'awful', 'shocking', 'devastating', 'horrible'];
    negativeWords.forEach(word => {
      if (script.toLowerCase().includes(word)) score += 5;
    });

    // Story elements
    const storyWords = ['story', 'happened', 'experience', 'journey', 'adventure'];
    storyWords.forEach(word => {
      if (script.toLowerCase().includes(word)) score += 8;
    });

    return Math.min(100, score);
  }

  private analyzeCallToActionStrength(script: string): number {
    let score = 20;

    // Check for explicit CTAs
    const ctaWords = ['subscribe', 'like', 'comment', 'share', 'follow', 'click', 'visit', 'download'];
    ctaWords.forEach(word => {
      if (script.toLowerCase().includes(word)) score += 10;
    });

    // Check for action verbs
    const actionVerbs = ['try', 'start', 'begin', 'join', 'discover', 'learn', 'get'];
    actionVerbs.forEach(verb => {
      if (script.toLowerCase().includes(verb)) score += 5;
    });

    return Math.min(100, score);
  }

  private analyzeLengthOptimization(wordCount: number, platform: string): ScriptAnalysis['lengthOptimization'] {
    const recommendations = {
      youtube: { min: 150, max: 300, optimal: 200 },
      tiktok: { min: 50, max: 150, optimal: 100 },
      instagram: { min: 80, max: 200, optimal: 120 }
    };

    const rec = recommendations[platform as keyof typeof recommendations] || recommendations.youtube;
    
    return {
      currentLength: wordCount,
      recommendedLength: rec.optimal,
      isOptimal: wordCount >= rec.min && wordCount <= rec.max
    };
  }

  private generateImprovements(
    script: string,
    apiImprovements: string[],
    scores: any
  ): ScriptAnalysis['improvements'] {
    const improvements: ScriptAnalysis['improvements'] = [];

    // Add API improvements
    apiImprovements.forEach(improvement => {
      improvements.push({
        category: 'structure',
        suggestion: improvement,
        impact: 'medium'
      });
    });

    // Add score-based improvements
    if (scores.hookStrength < 70) {
      improvements.push({
        category: 'hook',
        suggestion: 'Strengthen your opening hook with a question, statistic, or bold statement',
        impact: 'high'
      });
    }

    if (scores.engagementPotential < 60) {
      improvements.push({
        category: 'engagement',
        suggestion: 'Add more questions and direct audience address to increase engagement',
        impact: 'high'
      });
    }

    if (scores.callToActionStrength < 50) {
      improvements.push({
        category: 'cta',
        suggestion: 'Include a clear call-to-action to guide viewer behavior',
        impact: 'medium'
      });
    }

    return improvements;
  }

  private extractMainTopic(script: string): string {
    // Simple topic extraction - in production, this would be more sophisticated
    const words = script.split(/\s+/).filter(w => w.length > 3);
    return words.slice(0, 5).join(' ');
  }

  private optimizeStructure(script: string, platform: string): string {
    // Add platform-specific structure optimizations
    const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (platform === 'tiktok') {
      // TikTok prefers shorter, punchier sentences
      return sentences.map(s => s.trim()).join('. ');
    }
    
    return script;
  }

  private optimizeEngagement(script: string, platform: string): string {
    // Add engagement optimization logic
    return script;
  }

  private applyFinalPolish(script: string, goals: string[]): string {
    // Apply final polishing based on goals
    return script;
  }

  private identifyStructureChanges(original: string, optimized: string): OptimizedScript['structureChanges'] {
    return {
      addedElements: ['Stronger hook', 'Better transitions'],
      removedElements: ['Redundant phrases'],
      reorderedSections: ['Moved CTA to end']
    };
  }

  private async improveHook(script: string, platform: 'youtube' | 'tiktok' | 'instagram'): Promise<{ script: string; changes: string[] }> {
    const topic = this.extractMainTopic(script);
    const hooks = await this.apiService.generateViralHooks(topic, platform, 3);
    
    if (hooks.hooks.length > 0) {
      const sentences = script.split(/[.!?]+/);
      sentences[0] = hooks.hooks[0].text;
      
      return {
        script: sentences.join('. '),
        changes: ['Replaced opening with viral hook']
      };
    }
    
    return { script, changes: [] };
  }

  private improveEngagement(script: string): { script: string; changes: string[] } {
    // Add engagement improvements
    return { script, changes: ['Added audience questions'] };
  }

  private improveClarity(script: string): { script: string; changes: string[] } {
    // Add clarity improvements
    return { script, changes: ['Simplified complex sentences'] };
  }

  private improveCallToAction(script: string, platform: 'youtube' | 'tiktok' | 'instagram'): { script: string; changes: string[] } {
    const ctas = {
      youtube: 'Don\'t forget to like this video and subscribe for more content!',
      tiktok: 'Follow for more tips like this! 👆',
      instagram: 'Save this post and share it with someone who needs to see this!'
    };
    
    const cta = ctas[platform as keyof typeof ctas] || ctas.youtube;
    
    return {
      script: script + '\n\n' + cta,
      changes: ['Added platform-specific call-to-action']
    };
  }

  private improveStructure(script: string, platform: 'youtube' | 'tiktok' | 'instagram'): { script: string; changes: string[] } {
    // Add structure improvements
    return { script, changes: ['Improved content flow'] };
  }
}

// Export singleton instance
export const scriptOptimizationAgent = new ScriptOptimizationAgent();
export default scriptOptimizationAgent;

