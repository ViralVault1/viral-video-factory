// api/generate-video.js - Using Runway ML Gen-3
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
    console.log('Starting video generation with Runway ML');

    // Step 1: Generate voice-over
    const audioResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice || 'alloy',
      input: script,
      speed: 1.0
    });

    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    console.log('Voice-over generated');

    // Step 2: Call Runway ML Gen-3 API
    const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;

    if (!RUNWAY_API_KEY) {
      throw new Error('Runway API key not configured');
    }

    const runwayResponse = await fetch('https://api.dev.runwayml.com/v1/text_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      },
      body: JSON.stringify({
        promptText: (visualPrompt || script).substring(0, 1000),
        model: 'veo3',
        ratio: '720:1280',
        duration: 8,
        seed: Math.floor(Math.random() * 4294967295)
      })
    });

    if (!runwayResponse.ok) {
      const errorData = await runwayResponse.json().catch(() => ({}));
      console.error('Runway API error:', errorData);
      throw new Error(`Runway API error: ${errorData.message || runwayResponse.status}`);
    }

    const runwayData = await runwayResponse.json();
    
    console.log('Runway job created:', runwayData.id);

    return res.status(200).json({
      success: true,
      jobId: runwayData.id,
      status: 'processing',
      message: 'Video generation started with Runway ML'
    });

  } catch (error) {
    console.error('Error generating video:', error);

    return res.status(500).json({
      error: 'Failed to generate video',
      details: error.message
    });
  }
}
