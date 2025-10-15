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

  const { url, transcript, type } = req.body;

  try {
    let contentToAnalyze = '';
    
    if (type === 'url') {
      // For now, just use the URL as context
      contentToAnalyze = `YouTube Video URL: ${url}`;
    } else {
      contentToAnalyze = transcript;
    }

    // Call OpenAI to analyze
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
            content: 'You are a viral video expert. Analyze content and generate 3 viral video ideas based on the patterns you identify. Return JSON array with format: [{"title": "...", "description": "..."}]'
          },
          {
            role: 'user',
            content: `Analyze this content and generate 3 viral video ideas:\n\n${contentToAnalyze}`
          }
        ],
        temperature: 0.8
      })
    });

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    const ideas = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return res.status(200).json({
      success: true,
      ideas: ideas.slice(0, 3)
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}
