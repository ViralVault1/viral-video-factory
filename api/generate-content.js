// api/generate-content.js (Fixed with Debug)
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type = 'creative', provider = 'auto' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Debug logging
    console.log('API called with:', { prompt: prompt.substring(0, 100), type, provider });
    console.log('Environment variables check:');
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.log('GEMINI_API exists:', !!process.env.GEMINI_API);

    let result;

    // Choose provider based on type
    const selectedProvider = provider === 'auto' 
      ? (type === 'analysis' || type === 'technical' ? 'openai' : 'gemini')
      : provider;

    console.log('Selected provider:', selectedProvider);

    if (selectedProvider === 'openai') {
      result = await generateWithOpenAI(prompt, type);
    } else {
      result = await generateWithGemini(prompt, type);
    }

    console.log('Generation successful, content length:', result.content.length);

    res.status(200).json({
      content: result.content,
      provider: selectedProvider,
      tokens: result.tokens || 0,
      cost: result.cost || 0
    });

  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ 
      error: 'Content generation failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

async function generateWithOpenAI(prompt, type) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Calling OpenAI API...');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    })
  });

  console.log('OpenAI response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('OpenAI response received, usage:', data.usage);

  return {
    content: data.choices[0].message.content,
    tokens: data.usage.total_tokens,
    cost: (data.usage.total_tokens / 1000) * 0.045
  };
}

async function generateWithGemini(prompt, type) {
  const apiKey = process.env.GEMINI_API;
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  console.log('Calling Gemini API...');

  const optimizedPrompt = optimizePromptForType(prompt, type);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: optimizedPrompt }]
      }],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7
      }
    })
  });

  console.log('Gemini response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  console.log('Gemini response received');

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    console.error('Invalid Gemini response structure:', JSON.stringify(data));
    throw new Error('Invalid response from Gemini API');
  }

  const content = data.candidates[0].content.parts[0].text;
  const tokens = Math.ceil(content.length / 4);

  return {
    content,
    tokens,
    cost: (tokens / 1000) * 0.000375
  };
}

function optimizePromptForType(prompt, type) {
  const typePrompts = {
    creative: `Create engaging, creative content about: ${prompt}. Make it compelling and original.`,
    social: `Write a viral social media post about: ${prompt}. Make it engaging and shareable.`,
    video_script: `Write a compelling video script about: ${prompt}. Include hook, main content, and call-to-action.`,
    article: `Write a comprehensive article about: ${prompt}. Include introduction, main points, and conclusion.`,
    ad_copy: `Create persuasive advertising copy for: ${prompt}. Focus on benefits and clear call-to-action.`
  };

  return typePrompts[type] || prompt;
}
