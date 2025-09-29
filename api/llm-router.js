import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task, prompt, provider } = req.body;

  try {
    if (provider === 'gemini' || !provider) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      return res.status(200).json({ text: result.response.text() });
    }

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      });
      return res.status(200).json({ text: completion.choices[0].message.content });
    }

    return res.status(400).json({ error: 'Invalid provider' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
