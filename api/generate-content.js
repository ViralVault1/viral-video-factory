// api/generate-content.js (Simple Fallback)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type = 'creative' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Generate mock titles based on the prompt
    const titles = [
      `The Ultimate Guide to ${prompt}: Everything You Need to Know`,
      `10 Essential ${prompt} Tips That Actually Work`,
      `Common ${prompt} Mistakes and How to Avoid Them`,
      `${prompt} Secrets: What Experts Don't Want You to Know`,
      `The Complete ${prompt} Strategy for Beginners`
    ];

    const content = titles.join('\n');

    res.status(200).json({
      content,
      provider: 'mock',
      tokens: 100,
      cost: 0.001
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Generation failed',
      details: error.message
    });
  }
}
