// /api/generate-video endpoint
// This generates videos using BytePlus Seedance API

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { script, visualPrompt, voice, music, style, model } = req.body;

  if (!script) {
    return res.status(400).json({ error: 'Script is required' });
  }

  try {
    console.log('Starting video generation for script:', script.substring(0, 50) + '...');

    // Step 1: Generate voice-over using OpenAI TTS
    const audioResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice || 'alloy',
      input: script,
      speed: 1.0
    });

    // Convert audio to base64 or upload to storage
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    console.log('Voice-over generated, length:', audioBuffer.length);

    // Step 2: Call BytePlus Seedance API for video generation
    const BYTEPLUS_API_URL = process.env.BYTEPLUS_API_URL || 'https://api.byteplus.com/v1';
    const BYTEPLUS_API_KEY = process.env.BYTEPLUS_API_KEY;

    if (!BYTEPLUS_API_KEY) {
      throw new Error('BytePlus API key not configured');
    }

    const videoPayload = {
      prompt: visualPrompt || script,
      style: style || 'cinematic',
      audio_base64: audioBase64,
      duration: 'auto', // Auto-calculate from audio length
      resolution: '1080p',
      fps: 30,
      aspect_ratio: '9:16', // Vertical for social media
      music: music && music !== 'none' ? music : null,
      settings: {
        motion_strength: 7,
        quality: 'high',
        seed: Math.floor(Math.random() * 1000000)
      }
    };

    console.log('Calling BytePlus Seedance API...');

    const byteplusResponse = await fetch(`${BYTEPLUS_API_URL}/text-to-video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BYTEPLUS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(videoPayload)
    });

    if (!byteplusResponse.ok) {
      const errorData = await byteplusResponse.json().catch(() => ({}));
      console.error('BytePlus API error response:', errorData);
      throw new Error(`BytePlus API error (${byteplusResponse.status}): ${errorData.message || errorData.error || 'Unknown error'}`);
    }

    const byteplusData = await byteplusResponse.json();

    console.log('BytePlus response:', JSON.stringify(byteplusData, null, 2));

    // Handle different possible response formats
    const jobId = byteplusData.job_id || byteplusData.jobId || byteplusData.id || byteplusData.request_id;
    
    if (!jobId) {
      console.error('No job ID in BytePlus response:', byteplusData);
      throw new Error(`BytePlus API did not return a job ID. Response: ${JSON.stringify(byteplusData)}`);
    }

    console.log('BytePlus job created:', jobId);

    // Step 3: Return job ID for polling
    return res.status(200).json({
      success: true,
      jobId: jobId,
      status: 'processing',
      message: 'Video generation started',
      estimatedTime: byteplusData.estimated_time || byteplusData.eta || 60,
      videoUrl: byteplusData.video_url || byteplusData.output_url || byteplusData.url || null
    });

  } catch (error) {
    console.error('Error generating video:', error);

    return res.status(500).json({
      error: 'Failed to generate video',
      details: error.message,
      suggestion: 'Please check your API keys and try again'
    });
  }
}

// ALTERNATIVE IMPLEMENTATION: Using ModelsLab instead of BytePlus
/*
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { script, visualPrompt, voice, music, style } = req.body;

  try {
    // Generate audio with OpenAI
    const audioResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice || 'alloy',
      input: script
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    
    // Upload audio to temporary storage (S3, Cloudinary, etc.)
    // const audioUrl = await uploadToStorage(audioBuffer);

    // Call ModelsLab API
    const modelsLabResponse = await fetch('https://modelslab.com/api/v6/video/text2video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: process.env.MODELSLAB_API_KEY,
        prompt: visualPrompt || script,
        negative_prompt: 'blurry, low quality, distorted',
        scheduler: 'UniPCMultistepScheduler',
        seconds: 3, // Video length in seconds
        guidance_scale: 7,
        upscale_height: 1080,
        upscale_width: 1920,
        steps: 20,
        base64: false,
        webhook: `${process.env.API_BASE_URL}/api/video-webhook`,
        track_id: Date.now().toString()
      })
    });

    const data = await modelsLabResponse.json();

    return res.status(200).json({
      success: true,
      jobId: data.id || data.fetch_id,
      status: 'processing',
      message: 'Video generation started'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
*/

// ALTERNATIVE IMPLEMENTATION: Using Google Imagen Video
/*
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  const { script, visualPrompt, style } = req.body;

  try {
    // Note: As of now, Imagen Video API is not publicly available
    // This is a placeholder for when it becomes available
    
    const model = genAI.getGenerativeModel({ model: 'imagen-video' });
    
    const result = await model.generateContent({
      prompt: visualPrompt || script,
      duration: 5,
      fps: 30,
      style: style || 'cinematic'
    });

    return res.status(200).json({
      jobId: result.jobId,
      status: 'processing'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
*/
