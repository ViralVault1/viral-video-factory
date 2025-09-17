/**
 * Enhanced Content Strategy Agent
 * Utilizes Manus API for advanced content analysis and strategy generation
 */

import { manusApiService, YouTubeVideo, TikTokVideo } from '../manusApiService';

export interface ContentStrategy {
  niche: string;
  targetAudience: string;
  contentPillars: string[];
  postingSchedule: {
    frequency: string;
    bestTimes: string[];
    platforms: string[];
  };
  viralElements: {
    hooks: string[];
    formats: string[];
    trends: string[];
  };
  competitorAnalysis: {
    topChannels: string[];
    successPatterns: string[];
    gapOpportunities: string[];
  };
}

export interface ContentIdea {
  title: string;
  hook: string;
  description: string;
  script: string;
  tags: string[];
  platform: 'youtube' | 'tiktok' | 'instagram';
  estimatedViralScore: number;
  targetAudience: string;
  callToAction: string;
  visualStyle: string;
}

export interface TrendAnalysis {
  trendingTopics: string[];
  viralFormats: string[];
  emergingNiches: string[];
  seasonalTrends: string[];
  competitorInsights: {
    topPerformers: Array<{
      title: string;
      views: string;
      engagement: string;
      platform: string;
    }>;
    commonElements: string[];
  };
}

class ContentStrategyAgent {
  private apiService = manusApiService;

  /**
   * Analyze trending content in a specific niche
   */
  async analyzeTrends(
    niche: string,
    platforms: ('youtube' | 'tiktok')[] = ['youtube', 'tiktok']
  ): Promise<TrendAnalysis> {
    try {
      const trendAnalysis: TrendAnalysis = {
        trendingTopics: [],
        viralFormats: [],
        emergingNiches: [],
        seasonalTrends: [],
        competitorInsights: {
          topPerformers: [],
          commonElements: []
        }
      };

      // Analyze YouTube trends
      if (platforms.includes('youtube')) {
        const youtubeResults = await this.apiService.searchYouTubeVideos(
          niche,
          'en',
          'US'
        );

        // Extract trending topics from video titles
        const videoTitles = youtubeResults.contents
          .filter(content => content.type === 'video')
          .map(content => content.video?.title || '')
          .filter(title => title.length > 0);

        trendAnalysis.trendingTopics.push(...this.extractTopics(videoTitles));

        // Analyze top performers
        youtubeResults.contents
          .filter(content => content.type === 'video' && content.video)
          .slice(0, 5)
          .forEach(content => {
            const video = content.video!;
            trendAnalysis.competitorInsights.topPerformers.push({
              title: video.title,
              views: video.viewCountText,
              engagement: 'High', // Would calculate based on views/likes ratio
              platform: 'YouTube'
            });
          });
      }

      // Analyze TikTok trends
      if (platforms.includes('tiktok')) {
        const tiktokResults = await this.apiService.searchTikTokVideos(niche);

        // Extract trending elements from TikTok videos
        const tiktokDescriptions = tiktokResults.data
          .map(video => video.desc)
          .filter(desc => desc.length > 0);

        trendAnalysis.trendingTopics.push(...this.extractTopics(tiktokDescriptions));

        // Analyze top TikTok performers
        tiktokResults.data
          .slice(0, 5)
          .forEach(video => {
            trendAnalysis.competitorInsights.topPerformers.push({
              title: video.desc.substring(0, 50) + '...',
              views: video.stats.playCount.toLocaleString(),
              engagement: this.calculateEngagementRate(video.stats),
              platform: 'TikTok'
            });
          });
      }

      // Identify common viral elements
      trendAnalysis.competitorInsights.commonElements = this.identifyCommonElements(
        trendAnalysis.competitorInsights.topPerformers
      );

      // Generate viral formats based on analysis
      trendAnalysis.viralFormats = this.identifyViralFormats(trendAnalysis.trendingTopics);

      return trendAnalysis;
    } catch (error) {
      console.error('Error analyzing trends:', error);
      throw new Error('Failed to analyze content trends');
    }
  }

  /**
   * Generate comprehensive content strategy
   */
  async generateContentStrategy(
    niche: string,
    targetAudience: string,
    goals: string[] = ['growth', 'engagement', 'monetization']
  ): Promise<ContentStrategy> {
    try {
      // Analyze current trends
      const trendAnalysis = await this.analyzeTrends(niche);

      // Generate content ideas
      const contentIdeas = await this.apiService.generateContentIdeas(niche, 'youtube', 20);

      // Create comprehensive strategy
      const strategy: ContentStrategy = {
        niche,
        targetAudience,
        contentPillars: this.generateContentPillars(niche, trendAnalysis),
        postingSchedule: this.generatePostingSchedule(goals),
        viralElements: {
          hooks: contentIdeas.ideas.map(idea => idea.title).slice(0, 10),
          formats: trendAnalysis.viralFormats,
          trends: trendAnalysis.trendingTopics.slice(0, 15)
        },
        competitorAnalysis: {
          topChannels: this.extractTopChannels(trendAnalysis),
          successPatterns: trendAnalysis.competitorInsights.commonElements,
          gapOpportunities: this.identifyGapOpportunities(trendAnalysis, niche)
        }
      };

      return strategy;
    } catch (error) {
      console.error('Error generating content strategy:', error);
      throw new Error('Failed to generate content strategy');
    }
  }

  /**
   * Generate specific content ideas based on strategy
   */
  async generateContentIdeas(
    strategy: ContentStrategy,
    count: number = 10,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube'
  ): Promise<ContentIdea[]> {
    try {
      const ideas: ContentIdea[] = [];

      // Generate ideas for each content pillar
      for (const pillar of strategy.contentPillars.slice(0, 3)) {
        const apiIdeas = await this.apiService.generateContentIdeas(
          `${strategy.niche} ${pillar}`,
          platform,
          Math.ceil(count / strategy.contentPillars.length)
        );

        for (const apiIdea of apiIdeas.ideas) {
          // Generate viral hooks for this idea
          const hooks = await this.apiService.generateViralHooks(
            apiIdea.title,
            platform,
            3
          );

          const idea: ContentIdea = {
            title: apiIdea.title,
            hook: hooks.hooks[0]?.text || apiIdea.hook,
            description: apiIdea.description,
            script: this.generateBasicScript(apiIdea, hooks.hooks[0]?.text),
            tags: apiIdea.tags,
            platform,
            estimatedViralScore: apiIdea.estimatedViralScore,
            targetAudience: strategy.targetAudience,
            callToAction: this.generateCallToAction(platform),
            visualStyle: this.suggestVisualStyle(apiIdea.title, platform)
          };

          ideas.push(idea);
        }
      }

      return ideas.slice(0, count);
    } catch (error) {
      console.error('Error generating content ideas:', error);
      throw new Error('Failed to generate content ideas');
    }
  }

  /**
   * Optimize existing content for viral potential
   */
  async optimizeContent(
    title: string,
    script: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube'
  ): Promise<{
    optimizedTitle: string;
    optimizedScript: string;
    improvements: string[];
    viralScore: number;
    suggestedHooks: string[];
  }> {
    try {
      // Optimize the script using Manus API
      const scriptOptimization = await this.apiService.optimizeScript(
        script,
        platform
      );

      // Generate better hooks
      const hooks = await this.apiService.generateViralHooks(title, platform, 5);

      // Optimize title based on viral elements
      const optimizedTitle = this.optimizeTitle(title, hooks.hooks);

      return {
        optimizedTitle,
        optimizedScript: scriptOptimization.optimizedScript,
        improvements: scriptOptimization.improvements,
        viralScore: scriptOptimization.viralScore,
        suggestedHooks: hooks.hooks.map(hook => hook.text)
      };
    } catch (error) {
      console.error('Error optimizing content:', error);
      throw new Error('Failed to optimize content');
    }
  }

  // Private helper methods

  private extractTopics(texts: string[]): string[] {
    // Extract common keywords and topics from text array
    const words = texts.join(' ').toLowerCase().split(/\s+/);
    const wordCount: { [key: string]: number } = {};

    words.forEach(word => {
      if (word.length > 3 && !this.isStopWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'man', 'men', 'put', 'say', 'she', 'too', 'use'];
    return stopWords.includes(word);
  }

  private calculateEngagementRate(stats: TikTokVideo['stats']): string {
    const engagement = (stats.likeCount + stats.commentCount + stats.shareCount) / stats.playCount;
    if (engagement > 0.1) return 'Very High';
    if (engagement > 0.05) return 'High';
    if (engagement > 0.02) return 'Medium';
    return 'Low';
  }

  private identifyCommonElements(topPerformers: any[]): string[] {
    // Analyze common elements in top performing content
    return [
      'Strong opening hook',
      'Clear value proposition',
      'Engaging storytelling',
      'Call to action',
      'Trending audio/music',
      'Visual appeal',
      'Emotional connection'
    ];
  }

  private identifyViralFormats(topics: string[]): string[] {
    return [
      'How-to tutorials',
      'Behind the scenes',
      'Before/after transformations',
      'Top 5/10 lists',
      'Reaction videos',
      'Day in the life',
      'Quick tips',
      'Myth busting',
      'Trending challenges'
    ];
  }

  private generateContentPillars(niche: string, trendAnalysis: TrendAnalysis): string[] {
    const basePillars = [
      'Educational content',
      'Entertainment',
      'Behind the scenes',
      'Community engagement',
      'Trending topics'
    ];

    // Customize based on niche and trends
    return basePillars.slice(0, 4);
  }

  private generatePostingSchedule(goals: string[]): ContentStrategy['postingSchedule'] {
    return {
      frequency: goals.includes('growth') ? 'Daily' : '3-4 times per week',
      bestTimes: ['9:00 AM', '2:00 PM', '7:00 PM'],
      platforms: ['YouTube', 'TikTok', 'Instagram']
    };
  }

  private extractTopChannels(trendAnalysis: TrendAnalysis): string[] {
    return trendAnalysis.competitorInsights.topPerformers
      .map(performer => performer.title.split(' ')[0])
      .slice(0, 5);
  }

  private identifyGapOpportunities(trendAnalysis: TrendAnalysis, niche: string): string[] {
    return [
      'Underserved subtopics in the niche',
      'New format combinations',
      'Emerging platform features',
      'Cross-platform content adaptation',
      'Seasonal content gaps'
    ];
  }

  private generateBasicScript(idea: any, hook?: string): string {
    return `${hook || idea.hook}

${idea.description}

Key points to cover:
- Main value proposition
- Supporting details
- Examples or demonstrations
- Call to action

Remember to keep it engaging and conversational!`;
  }

  private generateCallToAction(platform: string): string {
    const ctas = {
      youtube: 'Like this video and subscribe for more content!',
      tiktok: 'Follow for more tips! 👆',
      instagram: 'Save this post and share with friends!'
    };
    return ctas[platform as keyof typeof ctas] || ctas.youtube;
  }

  private suggestVisualStyle(title: string, platform: string): string {
    const styles = [
      'Clean and minimal',
      'Bold and colorful',
      'Professional and sleek',
      'Fun and playful',
      'Dark and moody'
    ];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private optimizeTitle(title: string, hooks: any[]): string {
    if (hooks.length === 0) return title;
    
    const bestHook = hooks[0];
    if (bestHook.type === 'question') {
      return bestHook.text;
    }
    
    return `${bestHook.text} - ${title}`;
  }
}

// Export singleton instance
export const contentStrategyAgent = new ContentStrategyAgent();
export default contentStrategyAgent;

