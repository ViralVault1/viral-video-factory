// api/simple-video.js
import Replicate from 'replicate';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { script, voice, visualPrompt } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Step 1: Generate image from script
    const imagePrompt = visualPrompt || 
      `Professional, cinematic scene representing: ${script.substring(0, 200)}`;

    const image = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: imagePrompt,
          width: 1024,
          height: 576, // 16:9 for video
        }
      }
    );

    // Step 2: Generate speech from script
    // Using a simple TTS - you can upgrade to ElevenLabs later
    const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: script,
        voice: voice.toLowerCase().includes('male') ? 'onyx' : 'nova',
      })
    });

    if (!audioResponse.ok) {
      throw new Error('Text-to-speech failed');
    }

    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    // Return URLs for image and audio
    // In production, upload these to Supabase Storage
    const videoId = Date.now().toString();

    return res.status(200).json({
      id: videoId,
      imageUrl: image[0], // Replicate returns array
      audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Simple video generation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Video generation failed',
    });
  }
}
