// User analytics service for tracking user behavior and video performance
interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface VideoMetrics {
  videoId: string;
  title: string;
  duration: number;
  createdAt: string;
  views: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    watchTime: number;
  };
  platforms: {
    platform: string;
    views: number;
    engagement: number;
  }[];
}

interface UserMetrics {
  userId: string;
  videosCreated: number;
  totalViews: number;
  avgEngagement: number;
  favoriteTopics: string[];
  creationFrequency: number; // videos per week
}

class UserAnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadStoredEvents();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('user_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading stored analytics events:', error);
    }
  }

  private saveEvents(): void {
    try {
      // Keep only last 1000 events to prevent storage bloat
      const eventsToStore = this.events.slice(-1000);
      localStorage.setItem('user_analytics_events', JSON.stringify(eventsToStore));
    } catch (error) {
      console.error('Error saving analytics events:', error);
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Track generic events
  track(event: string, properties: Record<string, any> = {}): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);
    this.saveEvents();

    // Send to analytics service (if configured)
    this.sendToAnalytics(analyticsEvent);
  }

  // Video creation tracking
  trackVideoCreationStarted(topic: string, template?: string): void {
    this.track('video_creation_started', {
      topic,
      template,
      timestamp: Date.now()
    });
  }

  trackVideoCreationCompleted(videoData: {
    duration: number;
    scenes: number;
    voice: string;
    hasMusic: boolean;
    topic: string;
  }): void {
    this.track('video_creation_completed', {
      ...videoData,
      timestamp: Date.now()
    });
  }

  trackVideoCreationFailed(error: string, step: string): void {
    this.track('video_creation_failed', {
      error,
      step,
      timestamp: Date.now()
    });
  }

  // User interaction tracking
  trackTemplateUsed(templateId: string, templateName: string): void {
    this.track('template_used', {
      templateId,
      templateName
    });
  }

  trackFeatureUsed(feature: string, context?: Record<string, any>): void {
    this.track('feature_used', {
      feature,
      ...context
    });
  }

  trackPageView(page: string): void {
    this.track('page_view', {
      page,
      url: window.location.href,
      referrer: document.referrer
    });
  }

  trackError(error: string, context?: Record<string, any>): void {
    this.track('error_occurred', {
      error,
      ...context,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  // Performance tracking
  trackPerformance(action: string, duration: number, success: boolean): void {
    this.track('performance_metric', {
      action,
      duration,
      success,
      timestamp: Date.now()
    });
  }

  trackAPICall(endpoint: string, duration: number, success: boolean, cached: boolean = false): void {
    this.track('api_call', {
      endpoint,
      duration,
      success,
      cached,
      timestamp: Date.now()
    });
  }

  // Video performance tracking (for published videos)
  trackVideoPerformance(metrics: VideoMetrics): void {
    this.track('video_performance', {
      ...metrics,
      timestamp: Date.now()
    });
  }

  // User engagement tracking
  trackEngagement(action: string, element: string, value?: any): void {
    this.track('user_engagement', {
      action,
      element,
      value,
      timestamp: Date.now()
    });
  }

  // Get analytics insights
  getVideoCreationStats(): {
    totalVideos: number;
    successRate: number;
    avgDuration: number;
    popularTopics: string[];
    popularVoices: string[];
  } {
    const creationEvents = this.events.filter(e => 
      e.event === 'video_creation_started' || 
      e.event === 'video_creation_completed' ||
      e.event === 'video_creation_failed'
    );

    const started = creationEvents.filter(e => e.event === 'video_creation_started').length;
    const completed = creationEvents.filter(e => e.event === 'video_creation_completed').length;
    const failed = creationEvents.filter(e => e.event === 'video_creation_failed').length;

    const completedEvents = creationEvents.filter(e => e.event === 'video_creation_completed');
    const avgDuration = completedEvents.length > 0 
      ? completedEvents.reduce((sum, e) => sum + (e.properties.duration || 0), 0) / completedEvents.length
      : 0;

    // Get popular topics
    const topics = creationEvents
      .filter(e => e.properties.topic)
      .map(e => e.properties.topic);
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const popularTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    // Get popular voices
    const voices = completedEvents
      .filter(e => e.properties.voice)
      .map(e => e.properties.voice);
    const voiceCounts = voices.reduce((acc, voice) => {
      acc[voice] = (acc[voice] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const popularVoices = Object.entries(voiceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([voice]) => voice);

    return {
      totalVideos: completed,
      successRate: started > 0 ? (completed / started) * 100 : 0,
      avgDuration,
      popularTopics,
      popularVoices
    };
  }

  getPerformanceStats(): {
    avgAPIResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  } {
    const apiCalls = this.events.filter(e => e.event === 'api_call');
    const errors = this.events.filter(e => e.event === 'error_occurred');

    const avgAPIResponseTime = apiCalls.length > 0
      ? apiCalls.reduce((sum, e) => sum + (e.properties.duration || 0), 0) / apiCalls.length
      : 0;

    const cachedCalls = apiCalls.filter(e => e.properties.cached).length;
    const cacheHitRate = apiCalls.length > 0 ? (cachedCalls / apiCalls.length) * 100 : 0;

    const totalEvents = this.events.length;
    const errorRate = totalEvents > 0 ? (errors.length / totalEvents) * 100 : 0;

    return {
      avgAPIResponseTime,
      cacheHitRate,
      errorRate
    };
  }

  getUserEngagementStats(): {
    sessionsCount: number;
    avgSessionDuration: number;
    mostUsedFeatures: string[];
    bounceRate: number;
  } {
    const sessions = [...new Set(this.events.map(e => e.sessionId))];
    const sessionsCount = sessions.length;

    // Calculate average session duration
    const sessionDurations = sessions.map(sessionId => {
      const sessionEvents = this.events.filter(e => e.sessionId === sessionId);
      if (sessionEvents.length < 2) return 0;
      
      const firstEvent = Math.min(...sessionEvents.map(e => e.timestamp));
      const lastEvent = Math.max(...sessionEvents.map(e => e.timestamp));
      return lastEvent - firstEvent;
    });

    const avgSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0;

    // Get most used features
    const featureEvents = this.events.filter(e => e.event === 'feature_used');
    const featureCounts = featureEvents.reduce((acc, e) => {
      const feature = e.properties.feature;
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostUsedFeatures = Object.entries(featureCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature);

    // Calculate bounce rate (sessions with only 1 event)
    const bounceSessions = sessions.filter(sessionId => {
      const sessionEvents = this.events.filter(e => e.sessionId === sessionId);
      return sessionEvents.length === 1;
    }).length;
    const bounceRate = sessionsCount > 0 ? (bounceSessions / sessionsCount) * 100 : 0;

    return {
      sessionsCount,
      avgSessionDuration,
      mostUsedFeatures,
      bounceRate
    };
  }

  // Send events to external analytics service
  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    // This would integrate with your analytics service (Google Analytics, Mixpanel, etc.)
    try {
      // Example: Send to your analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      
      console.log('User Analytics event:', event);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Export data for analysis
  exportData(): {
    events: AnalyticsEvent[];
    stats: {
      videoCreation: ReturnType<typeof this.getVideoCreationStats>;
      performance: ReturnType<typeof this.getPerformanceStats>;
      engagement: ReturnType<typeof this.getUserEngagementStats>;
    };
  } {
    return {
      events: this.events,
      stats: {
        videoCreation: this.getVideoCreationStats(),
        performance: this.getPerformanceStats(),
        engagement: this.getUserEngagementStats()
      }
    };
  }

  // Clear all analytics data
  clearData(): void {
    this.events = [];
    localStorage.removeItem('user_analytics_events');
  }
}

// Create singleton instance
export const userAnalyticsService = new UserAnalyticsService();

// Auto-track page views
if (typeof window !== 'undefined') {
  // Track initial page load
  userAnalyticsService.trackPageView(window.location.pathname);
  
  // Track navigation changes (for SPAs)
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    userAnalyticsService.trackPageView(window.location.pathname);
  };
}

export default userAnalyticsService;

