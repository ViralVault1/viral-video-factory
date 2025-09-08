// Cache service for optimizing API calls and reducing costs
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items in cache
}

class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 30 * 60 * 1000, // 30 minutes default
      maxSize: 100,
      ...config
    };
  }

  // Generate cache key from parameters
  private generateKey(prefix: string, params: any): string {
    const paramString = JSON.stringify(params, Object.keys(params).sort());
    return `${prefix}:${btoa(paramString)}`;
  }

  // Set item in cache
  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.config.defaultTTL);
    
    // Remove oldest items if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt
    });
  }

  // Get item from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Delete specific key
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      usage: (this.cache.size / this.config.maxSize) * 100
    };
  }

  // Cached API call wrapper
  async cachedCall<T>(
    key: string,
    apiCall: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(key);
    if (cached !== null) {
      console.log(`Cache hit for key: ${key}`);
      return cached;
    }

    // Make API call and cache result
    console.log(`Cache miss for key: ${key}, making API call`);
    try {
      const result = await apiCall();
      this.set(key, result, ttl);
      return result;
    } catch (error) {
      console.error(`API call failed for key: ${key}`, error);
      throw error;
    }
  }

  // Cached video generation
  async cachedVideoGeneration(prompt: string, aspectRatio: string): Promise<string> {
    const key = this.generateKey('video', { prompt, aspectRatio });
    return this.cachedCall(
      key,
      async () => {
        // This would be your actual video generation API call
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio })
        });
        const data = await response.json();
        return data.videoUrl;
      },
      60 * 60 * 1000 // Cache videos for 1 hour
    );
  }

  // Cached image generation
  async cachedImageGeneration(prompt: string, aspectRatio: string): Promise<string> {
    const key = this.generateKey('image', { prompt, aspectRatio });
    return this.cachedCall(
      key,
      async () => {
        // This would be your actual image generation API call
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio })
        });
        const data = await response.json();
        return data.imageUrl;
      },
      24 * 60 * 60 * 1000 // Cache images for 24 hours
    );
  }

  // Cached speech generation
  async cachedSpeechGeneration(script: string, voice: string): Promise<string> {
    const key = this.generateKey('speech', { script, voice });
    return this.cachedCall(
      key,
      async () => {
        // This would be your actual speech generation API call
        const response = await fetch('/api/generate-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ script, voice })
        });
        const data = await response.json();
        return data.audioUrl;
      },
      24 * 60 * 60 * 1000 // Cache speech for 24 hours
    );
  }

  // Cached stock video search
  async cachedStockVideoSearch(query: string): Promise<any[]> {
    const key = this.generateKey('stock_videos', { query });
    return this.cachedCall(
      key,
      async () => {
        // This would be your actual stock video search API call
        const response = await fetch(`/api/search-videos?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.videos;
      },
      60 * 60 * 1000 // Cache search results for 1 hour
    );
  }

  // Cached trend analysis
  async cachedTrendAnalysis(topic: string): Promise<any> {
    const key = this.generateKey('trends', { topic });
    return this.cachedCall(
      key,
      async () => {
        // This would be your actual trend analysis API call
        const response = await fetch('/api/analyze-trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic })
        });
        return response.json();
      },
      30 * 60 * 1000 // Cache trends for 30 minutes
    );
  }
}

// Create singleton instance
export const cacheService = new CacheService({
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  maxSize: 200 // Store up to 200 items
});

// Auto-cleanup every 5 minutes
setInterval(() => {
  cacheService.cleanup();
}, 5 * 60 * 1000);

// Export for use in components
export default cacheService;

