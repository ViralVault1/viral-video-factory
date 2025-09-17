/**
 * Manus API Service
 * Integrates with Manus API Hub for enhanced AI capabilities
 */

// Types for API responses
export interface YouTubeVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedTimeText: string;
  lengthText: string;
  viewCountText: string;
  descriptionSnippet?: string;
  thumbnails: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

export interface YouTubeSearchResult {
  type: 'video' | 'channel' | 'playlist';
  video?: YouTubeVideo;
  channel?: any;
  playlist?: any;
}

export interface TikTokVideo {
  aweme_id: string;
  desc: string;
  stats: {
    playCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
  };
  author: {
    nickname: string;
    unique_id: string;
  };
}

export interface YouTubeChannelDetails {
  channelId: string;
  title: string;
  description: string;
  customUrl: string;
  handle: string;
  country: string;
  joinedDate: string;
  stats: {
    subscribers: string;
    subscribersText: string;
    videos: string;
    views: string;
  };
  avatar: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

class ManusApiService {
  private baseUrl = '/api/manus'; // This would be configured based on deployment

  /**
   * Search YouTube videos for content inspiration
   */
  async searchYouTubeVideos(
    query: string,
    language: string = 'en',
    country: string = 'US',
    cursor?: string
  ): Promise<{
    contents: YouTubeSearchResult[];
    cursorNext?: string;
    estimatedResults: number;
  }> {
    try {
      const params = new URLSearchParams({
        q: query,
        hl: language,
        gl: country,
        ...(cursor && { cursor })
      });

      const response = await fetch(`${this.baseUrl}/youtube/search?${params}`);
      if (!response.ok) {
        throw new Error(`YouTube search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      throw error;
    }
  }

  /**
   * Get YouTube channel details for analysis
   */
  async getYouTubeChannelDetails(
    channelId: string,
    language: string = 'en'
  ): Promise<YouTubeChannelDetails> {
    try {
      const params = new URLSearchParams({
        id: channelId,
        hl: language
      });

      const response = await fetch(`${this.baseUrl}/youtube/channel-details?${params}`);
      if (!response.ok) {
        throw new Error(`YouTube channel details failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting YouTube channel details:', error);
      throw error;
    }
  }

  /**
   * Get YouTube channel videos for content analysis
   */
  async getYouTubeChannelVideos(
    channelId: string,
    filterType: 'videos_latest' | 'streams_latest' | 'shorts_latest' | 'live_now' = 'videos_latest',
    language: string = 'en',
    country: string = 'US',
    cursor?: string
  ): Promise<{
    contents: YouTubeSearchResult[];
    cursorNext?: string;
  }> {
    try {
      const params = new URLSearchParams({
        id: channelId,
        filter: filterType,
        hl: language,
        gl: country,
        ...(cursor && { cursor })
      });

      const response = await fetch(`${this.baseUrl}/youtube/channel-videos?${params}`);
      if (!response.ok) {
        throw new Error(`YouTube channel videos failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting YouTube channel videos:', error);
      throw error;
    }
  }

  /**
   * Search TikTok videos for viral content analysis
   */
  async searchTikTokVideos(
    keyword: string,
    cursor?: number,
    searchId?: string
  ): Promise<{
    data: TikTokVideo[];
    cursor?: number;
    search_id?: string;
  }> {
    try {
      const params = new URLSearchParams({
        keyword,
        ...(cursor && { cursor: cursor.toString() }),
        ...(searchId && { search_id: searchId })
      });

      const response = await fetch(`${this.baseUrl}/tiktok/search?${params}`);
      if (!response.ok) {
        throw new Error(`TikTok search failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching TikTok videos:', error);
      throw error;
    }
  }

  /**
   * Get TikTok user's popular posts for influencer analysis
   */
  async getTikTokUserPopularPosts(
    secUid: string,
    count: number = 35,
    cursor: string = '0'
  ): Promise<{
    data: {
      itemList: TikTokVideo[];
      hasMore: boolean;
      cursor: string;
    };
  }> {
    try {
      const params = new URLSearchParams({
        secUid,
        count: count.toString(),
        cursor
      });

      const response = await fetch(`${this.baseUrl}/tiktok/user-popular-posts?${params}`);
      if (!response.ok) {
        throw new Error(`TikTok user posts failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting TikTok user posts:', error);
      throw error;
    }
  }

  /**
   * Analyze YouTube video for viral elements
   */
  async analyzeYouTubeVideo(videoId: string): Promise<{
    title: string;
    description: string;
    tags: string[];
    viralElements: {
      hook: string;
      engagement: string;
      structure: string;
      callToAction: string;
    };
    suggestions: string[];
  }> {
    try {
      // This would integrate with AI analysis
      const response = await fetch(`${this.baseUrl}/analyze/youtube/${videoId}`);
      if (!response.ok) {
        throw new Error(`YouTube analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing YouTube video:', error);
      throw error;
    }
  }

  /**
   * Generate content ideas based on trending topics
   */
  async generateContentIdeas(
    niche: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube',
    count: number = 10
  ): Promise<{
    ideas: Array<{
      title: string;
      hook: string;
      description: string;
      tags: string[];
      estimatedViralScore: number;
    }>;
    trendingTopics: string[];
  }> {
    try {
      const params = new URLSearchParams({
        niche,
        platform,
        count: count.toString()
      });

      const response = await fetch(`${this.baseUrl}/generate/content-ideas?${params}`);
      if (!response.ok) {
        throw new Error(`Content ideas generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating content ideas:', error);
      throw error;
    }
  }

  /**
   * Optimize script for viral potential
   */
  async optimizeScript(
    script: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube',
    targetAudience?: string
  ): Promise<{
    optimizedScript: string;
    improvements: string[];
    viralScore: number;
    hooks: string[];
    callToActions: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize/script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script,
          platform,
          targetAudience
        })
      });

      if (!response.ok) {
        throw new Error(`Script optimization failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error optimizing script:', error);
      throw error;
    }
  }

  /**
   * Generate viral hooks based on content topic
   */
  async generateViralHooks(
    topic: string,
    platform: 'youtube' | 'tiktok' | 'instagram' = 'youtube',
    count: number = 5
  ): Promise<{
    hooks: Array<{
      text: string;
      type: 'question' | 'statement' | 'statistic' | 'story' | 'controversy';
      viralScore: number;
    }>;
  }> {
    try {
      const params = new URLSearchParams({
        topic,
        platform,
        count: count.toString()
      });

      const response = await fetch(`${this.baseUrl}/generate/viral-hooks?${params}`);
      if (!response.ok) {
        throw new Error(`Viral hooks generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating viral hooks:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const manusApiService = new ManusApiService();
export default manusApiService;

