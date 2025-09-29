// api/llm-router.js
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, task, systemPrompt, temperature } = req.body;

    if (!task) {
      return res.status(400).json({ error: 'Missing task parameter' });
    }

    let result;

    if (provider === 'openai') {
      result = await callOpenAI(task, systemPrompt, temperature);
    } else if (provider === 'gemini') {
      result = await callGemini(task, systemPrompt, temperature);
    } else {
      return res.status(400).json({ error: 'Invalid provider. Use "openai" or "gemini"' });
    }

    return res.status(200).json({ result });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: error.toString()
    });
  }
}

async function callOpenAI(task, systemPrompt, temperature = 0.7) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured in Vercel environment variables');
  }

  const openai = new OpenAI({ apiKey });

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: task });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature,
  });

  return response.choices[0].message.content;
}

async function callGemini(task, systemPrompt, temperature = 0.7) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured in Vercel environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature,
    }
  });

  let prompt = task;
  if (systemPrompt) {
    prompt = `${systemPrompt}\n\n${task}`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
