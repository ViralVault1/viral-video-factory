// api/generate-video.js - Using Replicate
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

  const { script, visualPrompt, voice } = req.body;

  if (!script) {
    return res.status(400).json({ error: 'Script is required' });
  }

  try {
    console.log('Starting video generation with Replicate');

    // Generate voice-over
    const audioResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice || 'alloy',
      input: script,
      speed: 1.0
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    console.log('Voice-over generated');

    const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

    if (!REPLICATE_API_KEY) {
      throw new Error('Replicate API key not configured');
    }

    // Using Zeroscope v2 XL - good quality, affordable
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
        input: {
          prompt: (visualPrompt || script).substring(0, 500),
          negative_prompt: "blurry, low quality, distorted, watermark",
          num_frames: 24,
          num_inference_steps: 50
        }
      })
    });

    if (!replicateResponse.ok) {
      const errorData = await replicateResponse.json().catch(() => ({}));
      console.error('Replicate API error:', errorData);
      throw new Error(`Replicate API error: ${replicateResponse.status}`);
    }

    const replicateData = await replicateResponse.json();
    
    console.log('Replicate job created:', replicateData.id);

    return res.status(200).json({
      success: true,
      jobId: replicateData.id,
      status: 'processing',
      message: 'Video generation started'
    });

  } catch (error) {
    console.error('Error generating video:', error);

    return res.status(500).json({
      error: 'Failed to generate video',
      details: error.message
    });
  }
}
