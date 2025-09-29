// api/generate-video.js
import Replicate from 'replicate';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { script, voice, music, visualStyle, model, preset, visualPrompt } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Generate video using Runway Gen-3 via Replicate
    const output = await replicate.run(
      "runwayml/gen3a_turbo:model-id", // Replace with actual model ID
      {
        input: {
          prompt: `${visualPrompt || preset}. Script: ${script}`,
          duration: 5, // Adjust based on script length
        }
      }
    );

    // Store video info in database (Supabase)
    const videoId = Date.now().toString();
    
    return res.status(200).json({
      id: videoId,
      videoUrl: output,
      status: 'completed',
    });

  } catch (error) {
    console.error('Video generation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Video generation failed',
    });
  }
}
