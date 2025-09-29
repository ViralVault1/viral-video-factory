// api/llm-router.js - Serverless Function for Vercel
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, task, systemPrompt, userMessage, temperature } = req.body;

    if (!task && !userMessage) {
      return res.status(400).json({ error: 'Missing task or userMessage' });
    }

    let result;

    if (provider === 'openai') {
      result = await callOpenAI(task, systemPrompt, userMessage, temperature);
    } else if (provider === 'gemini') {
      result = await callGemini(task, systemPrompt, userMessage, temperature);
    } else {
      return res.status(400).json({ error: 'Invalid provider' });
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

async function callOpenAI(task, systemPrompt, userMessage, temperature = 0.7) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const openai = new OpenAI({ apiKey });

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ 
    role: 'user', 
    content: userMessage || task 
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature,
  });

  return response.choices[0].message.content;
}

async function callGemini(task, systemPrompt, userMessage, temperature = 0.7) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      temperature,
    }
  });

  let prompt = userMessage || task;
  if (systemPrompt) {
    prompt = `${systemPrompt}\n\n${prompt}`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
