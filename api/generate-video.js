export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await fetch('https://fal.run/fal-ai/fast-svd', {
      method: 'POST',
      headers: {
        'Authorization': '7dec4bd9-d9d8-492f-b436-2cfcd4827ade:56a33ae3d1f96d418f2911243e0665d7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        num_inference_steps: 25
      })
    });

    const result = await response.json();

    return res.status(200).json({
      success: true,
      videoUrl: result.video?.url || result.output
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to generate video' 
    });
  }
}
