export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://fal.run/fal-ai/minimax/hailuo-02/text-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ 
        success: false, 
        error: result.detail || 'API error'
      });
    }

    const videoUrl = result.video?.url || result.video;

    if (!videoUrl) {
      return res.status(500).json({ 
        success: false, 
        error: 'No video in response'
      });
    }

    return res.status(200).json({
      success: true,
      videoUrl: videoUrl
    });
    
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}
