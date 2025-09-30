// /api/generate-video.js - Using ModelsLab Seedance
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { script, visualPrompt, voice, music, style } = req.body;

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

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    console.log('Voice-over generated, length:', audioBuffer.length);

    // Step 2: Call ModelsLab Seedance API for video generation
    const MODELSLAB_API_KEY = process.env.MODELSLAB_API_KEY;

    if (!MODELSLAB_API_KEY) {
      throw new Error('ModelsLab API key not configured');
    }

    const videoPayload = {
      key: MODELSLAB_API_KEY,
      model_id: 'seedance-video',
      prompt: visualPrompt || script,
      negative_prompt: 'blurry, low quality, distorted, watermark, text, logo',
      height: 1024,
      width: 576, // 9:16 aspect ratio for vertical video
      num_frames: 150, // ~5 seconds at 30fps
      num_inference_steps: 20,
      guidance_scale: 7.5,
      seed: Math.floor(Math.random() * 1000000),
      webhook: null,
      track_id: null
    };

    console.log('Calling ModelsLab Seedance API...');

    // ModelsLab video-fusion text-to-video endpoint (v7)
    const modelsLabResponse = await fetch('https://modelslab.com/api/v7/video-fusion/text-to-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(videoPayload)
    });

    if (!modelsLabResponse.ok) {
      const errorData = await modelsLabResponse.json().catch(() => ({}));
      console.error('ModelsLab API error response:', errorData);
      throw new Error(`ModelsLab API error (${modelsLabResponse.status}): ${errorData.message || errorData.error || 'Unknown error'}`);
    }

    const modelsLabData = await modelsLabResponse.json();

    console.log('ModelsLab response:', JSON.stringify(modelsLabData, null, 2));

    // ModelsLab returns different field names
    const jobId = modelsLabData.id || modelsLabData.fetch_id || modelsLabData.request_id;
    
    if (!jobId) {
      console.error('No job ID in ModelsLab response:', modelsLabData);
      throw new Error(`ModelsLab API did not return a job ID. Response: ${JSON.stringify(modelsLabData)}`);
    }

    console.log('ModelsLab job created:', jobId);

    // Step 3: Return job ID for polling
    return res.status(200).json({
      success: true,
      jobId: jobId,
      status: modelsLabData.status || 'processing',
      message: 'Video generation started',
      estimatedTime: modelsLabData.eta || 60,
      meta: modelsLabData.meta
    });

  } catch (error) {
    console.error('Error generating video:', error);

    return res.status(500).json({
      error: 'Failed to generate video',
      details: error.message,
      suggestion: 'Please check your ModelsLab API key and try again'
    });
  }
}
