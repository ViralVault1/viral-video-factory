// api/simple-video.js - Mock version (no external APIs needed)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { script, voice, visualPrompt } = req.body;

    if (!script) {
      return res.status(400).json({ error: 'Script is required' });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock data with real placeholder images
    return res.status(200).json({
      id: Date.now().toString(),
      imageUrl: `https://picsum.photos/seed/${Date.now()}/1024/576`,
      audioUrl: null, // No audio for now
      status: 'completed',
      createdAt: new Date().toISOString(),
      script: script.substring(0, 100),
    });

  } catch (error) {
    console.error('Simple video generation error:', error);
    return res.status(500).json({ 
      error: error.message || 'Video generation failed',
    });
  }
}
