// api/generate-content.js (Fixed for video script generation)
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type = 'creative' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let content;
    
    // Handle different content types
    switch(type) {
      case 'video-ideas':
        content = await generateWithAI(prompt);
        break;
      
      case 'script-rewrite':
        content = await generateWithAI(prompt);
        break;
      
      case 'viral-optimization':
        content = await generateWithAI(prompt);
        break;
      
      case 'transcript-analysis':
        content = await generateWithAI(prompt);
        break;
      
      case 'visual-prompt':
        content = await generateWithAI(prompt);
        break;
      
      case 'article':
        content = await generateHighQualityArticle(prompt);
        break;
      
      default:
        content = await generateWithAI(prompt);
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      details: error.message 
    });
  }
}

// Main AI generation function using OpenAI
async function generateWithAI(prompt) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a viral content creator and video script expert. Create engaging, punchy content optimized for social media platforms like TikTok, Instagram, and YouTube Shorts.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 2000
  });

  return completion.choices[0].message.content;
}

// Article generation functions (keep your existing ones)
async function generateHighQualityArticle(prompt) {
  const targetWordCount = extractWordCount(prompt);
  const style = extractStyle(prompt);
  const niche = extractNiche(prompt);
  const pointOfView = extractPointOfView(prompt);
  
  const title = extractTitle(prompt);
  const sections = generateArticleSections(title, targetWordCount, style, niche, pointOfView);
  
  return sections.join('\n\n');
}

function extractTitle(prompt) {
  const match = prompt.match(/title: ["']([^"']+)["']/i);
  return match ? match[1] : 'Article Title';
}

function extractWordCount(prompt) {
  if (prompt.includes('500 words')) return 500;
  if (prompt.includes('1500 words')) return 1500;
  if (prompt.includes('3500')) return 3500;
  return 1500;
}

function extractStyle(prompt) {
  if (prompt.includes('Conversational')) return 'conversational';
  if (prompt.includes('Formal')) return 'formal';
  if (prompt.includes('Humorous')) return 'humorous';
  return 'informative';
}

function extractNiche(prompt) {
  const match = prompt.match(/Niche: ([^\n]+)/);
  return match ? match[1].trim() : 'general';
}

function extractPointOfView(prompt) {
  if (prompt.includes('First-person')) return 'first';
  if (prompt.includes('Third-person')) return 'third';
  return 'second';
}

function generateArticleSections(title, targetWordCount, style, niche, pointOfView) {
  const sections = [];
  
  sections.push(`# ${title}`);
  sections.push('');
  
  const intro = generateIntroduction(title, style, niche, pointOfView, targetWordCount);
  sections.push(intro);
  
  const mainSections = generateMainContent(title, style, niche, pointOfView, targetWordCount);
  sections.push(...mainSections);
  
  const conclusion = generateConclusion(title, style, niche, pointOfView);
  sections.push(conclusion);
  
  return sections;
}

function generateIntroduction(title, style, niche, pointOfView, wordCount) {
  const pronouns = {
    first: { you: 'I', your: 'my', yourself: 'myself' },
    second: { you: 'you', your: 'your', yourself: 'yourself' },
    third: { you: 'they', your: 'their', yourself: 'themselves' }
  };
  
  const p = pronouns[pointOfView];
  
  let intro = `## Introduction\n\n`;
  
  if (style === 'conversational') {
    intro += `Have ${p.you} ever wondered about ${title.toLowerCase()}? ${p.you.charAt(0).toUpperCase() + p.you.slice(1)}'re not alone! `;
  } else if (style === 'formal') {
    intro += `Understanding ${title.toLowerCase()} has become increasingly important in today's context. `;
  } else if (style === 'humorous') {
    intro += `Let's be honest - ${title.toLowerCase()} might sound about as exciting as watching paint dry, but stick with me here! `;
  } else {
    intro += `In the world of ${niche}, ${title.toLowerCase()} plays a crucial role. `;
  }
  
  if (wordCount >= 1500) {
    intro += `This comprehensive guide will explore everything ${p.you} need to know, from the basics to advanced strategies. We'll cover practical tips, real-world examples, and actionable insights that ${p.you} can implement immediately.\n\n`;
    intro += `Whether ${p.you}'re a complete beginner or looking to refine ${p.your} existing knowledge, this article provides valuable information that will help ${p.you} succeed in ${niche}.`;
  } else {
    intro += `This guide covers the essential information ${p.you} need to get started and make meaningful progress.`;
  }
  
  return intro;
}

function generateMainContent(title, style, niche, pointOfView, wordCount) {
  const sections = [];
  const pronouns = {
    first: { you: 'I', your: 'my', yourself: 'myself' },
    second: { you: 'you', your: 'your', yourself: 'yourself' },
    third: { you: 'they', your: 'their', yourself: 'themselves' }
  };
  
  const p = pronouns[pointOfView];
  
  sections.push(`## Understanding the Fundamentals\n\n`);
  sections.push(`Before diving into the specifics of ${title.toLowerCase()}, it's essential to establish a solid foundation. The key principles include:\n\n`);
  sections.push(`**Core Concepts**: The fundamental ideas that ${p.you} need to grasp.\n\n`);
  sections.push(`**Common Misconceptions**: Many believe success happens overnight, but it requires patience and strategy.\n\n`);
  sections.push(`**Why It Matters**: In ${niche}, mastering these concepts leads to significant improvements.`);
  
  if (wordCount >= 1500) {
    sections.push(`## In-Depth Analysis\n\n`);
    sections.push(`Let's explore the nuanced aspects of ${title.toLowerCase()}:\n\n`);
    sections.push(`### Factor 1: Strategic Planning\n\n`);
    sections.push(`Effective planning is crucial. Set clear objectives and develop contingency plans.\n\n`);
    sections.push(`### Factor 2: Implementation Tactics\n\n`);
    sections.push(`Focus on practical execution. Start small, test, and iterate based on results.\n\n`);
    sections.push(`### Factor 3: Measuring Progress\n\n`);
    sections.push(`Establish clear metrics and regularly review ${p.your} progress.`);
  }
  
  sections.push(`## Practical Tips and Strategies\n\n`);
  sections.push(`Actionable strategies to implement:\n\n`);
  sections.push(`**Start with the Basics**: Master fundamentals before advanced techniques.\n\n`);
  sections.push(`**Consistency is Key**: Regular effort yields better results.\n\n`);
  sections.push(`**Learn from Others**: Study successful examples in ${niche}.`);
  
  return sections;
}

function generateConclusion(title, style, niche, pointOfView) {
  const pronouns = {
    first: { you: 'I', your: 'my', yourself: 'myself' },
    second: { you: 'you', your: 'your', yourself: 'yourself' },
    third: { you: 'they', your: 'their', yourself: 'themselves' }
  };
  
  const p = pronouns[pointOfView];
  
  let conclusion = `## Conclusion\n\n`;
  
  if (style === 'conversational') {
    conclusion += `So there ${p.you} have it! We've covered ${title.toLowerCase()}. `;
  } else {
    conclusion += `Mastering ${title.toLowerCase()} requires dedication and strategic thinking. `;
  }
  
  conclusion += `Key takeaways include understanding fundamentals and maintaining consistency.\n\n`;
  conclusion += `**Next Steps:**\n\n`;
  conclusion += `1. Choose strategies to implement first\n`;
  conclusion += `2. Track ${p.your} progress\n`;
  conclusion += `3. Give ${p.yourself} time to see results\n`;
  conclusion += `4. Continue learning and refining ${p.your} approach`;
  
  return conclusion;
}
