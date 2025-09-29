// src/services/simpleVideoService.ts

interface SimpleVideoParams {
  script: string;
  voice: string;
  visualPrompt?: string;
}

interface VideoResult {
  id: string;
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

class SimpleVideoService {
  async generateSimpleVideo(params: SimpleVideoParams): Promise<VideoResult> {
    try {
      const response = await fetch('/api/simple-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Video generation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Simple video generation failed:', error);
      throw error;
    }
  }
}

export const simpleVideoService = new SimpleVideoService();
export default simpleVideoService; look at this in my voice I stand on the bird is going
