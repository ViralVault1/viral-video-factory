import OpenAI from 'openai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // No REACT_APP_ prefix
  });

  const { prompt, model } = req.body;

  try {
    const response = await openai.images.generate({
      model: model || "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024"
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
