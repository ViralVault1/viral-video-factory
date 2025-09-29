// src/services/videoGenerationService.ts

interface VideoGenerationParams {
  script: string;
  voice: string;
  music: string;
  visualStyle: string;
  aiModel: string;
  presetStyle: string;
  visualPrompt?: string;
  soundEffects?: string;
}

interface VideoGenerationResult {
  id: string;
  videoUrl: string;
  status: 'processing' | 'completed' | 'failed';
  thumbnail?: string;
  duration?: number;
}

class VideoGenerationService {
  private runwayApiKey: string;
  
  constructor() {
    this.runwayApiKey = process.env.REACT_APP_RUNWAY_API_KEY || '';
  }

  async generateVideo(params: VideoGenerationParams): Promise<VideoGenerationResult> {
    // Call your backend API that handles Runway
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: params.script,
        voice: params.voice,
        music: params.music,
        visualStyle: params.visualStyle,
        model: params.aiModel,
        preset: params.presetStyle,
        visualPrompt: params.visualPrompt,
        soundEffects: params.soundEffects,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Video generation failed');
    }

    return await response.json();
  }

  async checkStatus(videoId: string): Promise<VideoGenerationResult> {
    const response = await fetch(`/api/video-status/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check video status');
    }

    return await response.json();
  }
}

export const videoGenerationService = new VideoGenerationService();
export default videoGenerationService; 
