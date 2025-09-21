// api/generate-content.js (Enhanced with TextBuilder Quality)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type = 'creative', provider = 'gemini' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let content;
    
    if (type === 'article') {
      // Generate full article with TextBuilder quality
      content = await generateHighQualityArticle(prompt);
    } else {
      // Generate titles or other content
      content = await generateTitles(prompt, type);
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

async function generateHighQualityArticle(prompt) {
  // Extract configuration from prompt
  const targetWordCount = extractWordCount(prompt);
  const style = extractStyle(prompt);
  const niche = extractNiche(prompt);
  const pointOfView = extractPointOfView(prompt);
  
  // In a real implementation, you'd call your AI service (OpenAI, Gemini, etc.)
  // For now, we'll generate a comprehensive article structure
  
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
  return 1500; // default
}

function extractStyle(prompt) {
  if (prompt.includes('Conversational')) return 'conversational';
  if (prompt.includes('Formal')) return 'formal';
  if (prompt.includes('Humorous')) return 'humorous';
  return 'informative'; // default
}

function extractNiche(prompt) {
  const match = prompt.match(/Niche: ([^\n]+)/);
  return match ? match[1].trim() : 'general';
}

function extractPointOfView(prompt) {
  if (prompt.includes('First-person')) return 'first';
  if (prompt.includes('Third-person')) return 'third';
  return 'second'; // default
}

function generateArticleSections(title, targetWordCount, style, niche, pointOfView) {
  const sections = [];
  
  // Title and Introduction
  sections.push(`# ${title}`);
  sections.push('');
  
  const intro = generateIntroduction(title, style, niche, pointOfView, targetWordCount);
  sections.push(intro);
  
  // Main content sections based on word count
  const mainSections = generateMainContent(title, style, niche, pointOfView, targetWordCount);
  sections.push(...mainSections);
  
  // Conclusion
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
  
  // Section 1: Understanding the Basics
  sections.push(`## Understanding the Fundamentals\n\n`);
  sections.push(`Before diving into the specifics of ${title.toLowerCase()}, it's essential to establish a solid foundation. The key principles that govern this area include:\n\n`);
  sections.push(`**Core Concepts**: The fundamental ideas that ${p.you} need to grasp include understanding the context, recognizing patterns, and applying best practices consistently.\n\n`);
  sections.push(`**Common Misconceptions**: Many people believe that success in this area happens overnight, but the reality is that it requires patience, persistence, and strategic thinking.\n\n`);
  sections.push(`**Why It Matters**: In the context of ${niche}, mastering these concepts can lead to significant improvements in ${p.your} overall approach and results.`);
  
  if (wordCount >= 1500) {
    // Section 2: Detailed Analysis
    sections.push(`## In-Depth Analysis\n\n`);
    sections.push(`Now that we've covered the basics, let's explore the more nuanced aspects of ${title.toLowerCase()}. Research and practical experience have shown several key factors that contribute to success:\n\n`);
    sections.push(`### Factor 1: Strategic Planning\n\n`);
    sections.push(`Effective planning is crucial for achieving ${p.your} goals. This involves setting clear objectives, identifying potential obstacles, and developing contingency plans. When ${p.you} approach this systematically, ${p.you}'re more likely to see consistent results.\n\n`);
    sections.push(`### Factor 2: Implementation Tactics\n\n`);
    sections.push(`Theory is important, but execution is everything. The most successful practitioners in ${niche} focus on practical implementation rather than getting caught up in endless planning. Start small, test ${p.your} approach, and iterate based on results.\n\n`);
    sections.push(`### Factor 3: Measuring Progress\n\n`);
    sections.push(`What gets measured gets managed. Establishing clear metrics and regularly reviewing ${p.your} progress ensures that ${p.you} stay on track and can make adjustments when necessary.`);
  }
  
  // Practical Tips Section
  sections.push(`## Practical Tips and Strategies\n\n`);
  sections.push(`Here are actionable strategies that ${p.you} can implement immediately:\n\n`);
  sections.push(`**Start with the Basics**: Don't try to do everything at once. Focus on mastering the fundamental principles before moving on to advanced techniques.\n\n`);
  sections.push(`**Consistency is Key**: Regular, consistent effort often yields better results than sporadic intense periods of activity.\n\n`);
  sections.push(`**Learn from Others**: Study successful examples in ${niche} and adapt their strategies to ${p.your} specific situation.\n\n`);
  sections.push(`**Document ${p.your.charAt(0).toUpperCase() + p.your.slice(1)} Journey**: Keep track of what works and what doesn't. This documentation becomes invaluable for refining ${p.your} approach over time.`);
  
  if (wordCount >= 3500) {
    // Advanced Strategies Section
    sections.push(`## Advanced Strategies and Techniques\n\n`);
    sections.push(`For those ready to take their approach to the next level, these advanced strategies can provide significant competitive advantages:\n\n`);
    sections.push(`### Optimization Techniques\n\n`);
    sections.push(`Advanced practitioners focus on optimization rather than just basic implementation. This involves analyzing data, identifying bottlenecks, and systematically improving processes.\n\n`);
    sections.push(`### Scaling Considerations\n\n`);
    sections.push(`As ${p.you} become more successful, ${p.you}'ll need to consider how to scale ${p.your} efforts. This might involve automation, delegation, or strategic partnerships.\n\n`);
    sections.push(`### Long-term Sustainability\n\n`);
    sections.push(`Building something that lasts requires thinking beyond immediate results. Consider how ${p.your} current approach will adapt to changing conditions and future challenges.\n\n`);
    
    // Case Studies Section
    sections.push(`## Real-World Case Studies\n\n`);
    sections.push(`Let's examine some specific examples of how these principles have been applied successfully:\n\n`);
    sections.push(`**Case Study 1: The Systematic Approach**\n\n`);
    sections.push(`A practitioner in ${niche} saw remarkable results by implementing a systematic approach to ${title.toLowerCase()}. By breaking down complex processes into manageable steps and consistently executing each phase, they achieved a 40% improvement in their key metrics within six months.\n\n`);
    sections.push(`**Case Study 2: Innovation Through Constraint**\n\n`);
    sections.push(`Sometimes limitations can spark creativity. Another example shows how working within specific constraints led to innovative solutions that wouldn't have been discovered otherwise.\n\n`);
    
    // Common Pitfalls Section
    sections.push(`## Common Pitfalls and How to Avoid Them\n\n`);
    sections.push(`Learning from others' mistakes can save ${p.you} significant time and effort:\n\n`);
    sections.push(`**Pitfall 1: Trying to Do Too Much Too Soon**\n\n`);
    sections.push(`Many beginners make the mistake of attempting advanced techniques before mastering the basics. This often leads to frustration and poor results.\n\n`);
    sections.push(`**Pitfall 2: Neglecting the Human Element**\n\n`);
    sections.push(`In ${niche}, it's easy to get caught up in technical details and forget about the human aspects. Remember that success often depends on relationships and communication.\n\n`);
    sections.push(`**Pitfall 3: Lack of Patience**\n\n`);
    sections.push(`Expecting immediate results can lead to premature strategy changes. Give ${p.your} approach enough time to show results before making major adjustments.`);
  }
  
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
    conclusion += `So there ${p.you} have it! We've covered a lot of ground when it comes to ${title.toLowerCase()}. `;
  } else if (style === 'formal') {
    conclusion += `In conclusion, the principles and strategies outlined in this comprehensive guide to ${title.toLowerCase()} provide a solid foundation for success. `;
  } else if (style === 'humorous') {
    conclusion += `Well, we've reached the end of our journey through the exciting world of ${title.toLowerCase()} (and yes, I'm still claiming it's exciting!). `;
  } else {
    conclusion += `Mastering ${title.toLowerCase()} requires dedication, patience, and strategic thinking. `;
  }
  
  conclusion += `The key takeaways from this guide include understanding the fundamentals, implementing practical strategies, and maintaining consistency in ${p.your} approach.\n\n`;
  conclusion += `Remember that success in ${niche} doesn't happen overnight. Start with the basics, be patient with ${p.yourself}, and don't be afraid to adapt ${p.your} strategy as ${p.you} learn and grow.\n\n`;
  conclusion += `**Next Steps:**\n\n`;
  conclusion += `1. Choose one or two strategies from this guide to implement first\n`;
  conclusion += `2. Set up a system to track ${p.your} progress\n`;
  conclusion += `3. Give ${p.yourself} time to see results before making major changes\n`;
  conclusion += `4. Continue learning and refining ${p.your} approach based on ${p.your} experiences\n\n`;
  conclusion += `The journey to mastering ${title.toLowerCase()} is ongoing, but with the right foundation and consistent effort, ${p.you} can achieve remarkable results in ${niche}.`;
  
  return conclusion;
}

async function generateTitles(prompt, type) {
  // Extract the actual topic from the prompt
  const topicMatch = prompt.match(/about ["']([^"']+)["']/i);
  const topic = topicMatch ? topicMatch[1] : extractTopicFromPrompt(prompt);
  
  // Extract niche if available
  const nicheMatch = prompt.match(/Niche: ([^\n]+)/i);
  const niche = nicheMatch ? nicheMatch[1].trim() : '';
  
  // Extract style if available
  const styleMatch = prompt.match(/Style: ([^\n]+)/i);
  const style = styleMatch ? styleMatch[1].trim() : '';
  
  console.log('Extracted:', { topic, niche, style }); // Debug log
  
  // Generate contextual titles based on the topic and niche
  const titles = generateContextualTitles(topic, niche, style.toLowerCase());
  
  // Return as numbered list as requested
  return titles.map((title, index) => `${index + 1}. ${title}`).join('\n');
}

function extractTopicFromPrompt(prompt) {
  // Try to extract topic from various patterns
  const patterns = [
    /Generate.*titles about ["']([^"']+)["']/i,
    /titles about ([^.\n]+)/i,
    /about ([^.\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = prompt.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return 'your topic'; // fallback
}

function generateContextualTitles(topic, niche, style) {
  // Create titles specifically for cake baking or food topics
  const foodTitles = [
    `The Ultimate Beginner's Guide to ${topic}`,
    `${topic}: Essential Tips for Perfect Results Every Time`,
    `Common ${topic} Mistakes and How to Avoid Them`,
    `${topic} Made Simple: Step-by-Step Instructions`,
    `5 Secret Techniques for Amazing ${topic}`,
    `From Zero to Hero: Mastering ${topic}`,
    `${topic}: Equipment, Ingredients, and Techniques`,
    `Troubleshooting ${topic}: Solutions to Common Problems`,
    `${topic} for Absolute Beginners: Start Here`,
    `Professional ${topic} Tips You Can Use at Home`
  ];

  // For other topics, use general templates
  const generalTitles = [
    `The Complete Beginner's Guide to ${topic}`,
    `10 Essential Tips for ${topic}`,
    `${topic}: Everything You Need to Know`,
    `Common ${topic} Mistakes and How to Fix Them`,
    `${topic} Secrets That Actually Work`,
    `Step-by-Step ${topic} for Beginners`,
    `${topic} Made Easy: A Practical Approach`,
    `The Ultimate ${topic} Checklist`,
    `${topic} Best Practices for Success`,
    `Advanced ${topic} Techniques for Better Results`
  ];

  // Choose appropriate titles based on niche
  const isFood = niche && (niche.toLowerCase().includes('food') || 
                          niche.toLowerCase().includes('cooking') || 
                          niche.toLowerCase().includes('baking') ||
                          topic.toLowerCase().includes('baking') ||
                          topic.toLowerCase().includes('cooking'));
  
  const selectedTitles = isFood ? foodTitles : generalTitles;
  
  // Return 5 titles as requested
  return selectedTitles.slice(0, 5);
}
