const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, mimeType } = req.body;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = `Analyze this product image and create a compelling video ad campaign. Provide:
1. A catchy headline (max 10 words)
2. A 30-second video ad script (engaging, benefit-focused)
3. A strong call-to-action
4. Target audience description
5. 3-5 key product features to highlight

Format your response as JSON with these exact keys: headline, script, callToAction, targetAudience, keyFeatures (array)`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType } }
    ]);
    
    const text = result.response.text();
    return res.status(200).json({ content: text });
  } catch (error) {
    console.error('Product ad generation error:', error);
    return res.status(500).json({ error: error.message });
  }
};
