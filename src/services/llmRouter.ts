export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, provider, maxTokens = 4000, temperature = 0.7 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { 
              role: 'system', 
              content: 'You are a professional content writer who creates high-quality, engaging content.' 
            },
            { 
              role: 'user', 
              content: prompt 
            }
          ],
          max_tokens: Math.min(maxTokens, 4000),
          temperature: temperature
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ 
          error: `OpenAI API error: ${response.status} - ${errorText}` 
        });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        return res.status(500).json({ error: 'OpenAI returned empty content' });
      }

      return res.status(200).json({ content, provider: 'openai' });
    }

    // Gemini provider
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: prompt }] 
          }],
          generationConfig: {
            temperature: temperature,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: Math.min(maxTokens, 8000)
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Gemini API error: ${response.status} - ${errorText}` 
      });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return res.status(500).json({ error: 'Gemini returned empty content' });
    }

    return res.status(200).json({ content, provider: 'gemini' });

  } catch (error) {
    console.error('LLM Router API error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
