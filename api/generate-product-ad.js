const OpenAI = require('openai');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, mimeType } = req.body;
    
    if (!imageData || !mimeType) {
      return res.status(400).json({ error: 'Missing image data or mime type' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this product image and create a compelling video ad campaign. Provide:

1. A catchy headline (max 10 words)
2. A 30-second video ad script (engaging, benefit-focused)
3. A strong call-to-action
4. Target audience description
5. 3-5 key product features to highlight

Format your response as JSON with these exact keys: headline, script, callToAction, targetAudience, keyFeatures (array)`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageData}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    });
    
    const text = response.choices[0].message.content;
    return res.status(200).json({ content: text });
  } catch (error) {
    console.error('Product ad generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate ad' });
  }
};
