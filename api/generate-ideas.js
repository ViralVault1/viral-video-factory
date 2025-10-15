export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a viral content strategist. Generate 3 distinct, high-retention video concepts for short-form platforms like TikTok and YouTube Shorts. 

For each concept provide:
- A compelling, click-worthy title
- A fictional but realistic source URL (e.g., from a popular creator's page)
- A short summary (around 50 words) that describes the video's content and hook

Return ONLY a JSON array with this exact structure:
[
  {
    "title": "string",
    "description": "string"
  }
]

Make titles attention-grabbing with emotional triggers, curiosity gaps, or bold claims. Descriptions should be concise and explain the video's hook and content.`
          },
          {
            role: 'user',
            content: `Generate 3 viral video concepts for: "${topic}"`
          }
        ],
        temperature: 0.9,
        max_tokens: 1000
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'OpenAI API error');
    }

    const content = result.choices[0].message.content;
    
    // Extract JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const ideas = JSON.parse(jsonMatch[0]);

    return res.status(200).json({
      success: true,
      ideas: ideas.slice(0, 3)
    });
    
  } catch (error) {
    console.error('Idea generation error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}
