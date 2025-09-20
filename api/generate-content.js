// api/generate-content.js (Enhanced with Article Generation)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, type = 'creative', platform = 'general', titles = [] } = req.body;

  if (!prompt && !titles.length) {
    return res.status(400).json({ error: 'Prompt or titles are required' });
  }

  try {
    let content = '';

    switch (type) {
      case 'full_article':
        content = generateFullArticle(prompt);
        break;
      case 'batch_articles':
        content = generateBatchArticles(titles);
        break;
      case 'video_script':
        content = generateVideoScript(prompt, platform);
        break;
      case 'social_post':
        content = generateSocialPost(prompt, platform);
        break;
      case 'ad_copy':
        content = generateAdCopy(prompt);
        break;
      case 'article_titles':
        content = generateArticleTitles(prompt);
        break;
      default:
        content = generateArticleTitles(prompt);
    }

    res.status(200).json({
      content,
      provider: 'mock',
      tokens: 100,
      cost: 0.001,
      type
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Generation failed',
      details: error.message
    });
  }
}

function generateFullArticle(title) {
  const topic = title.toLowerCase();
  
  return `# ${title}

## Introduction

In today's rapidly evolving landscape, understanding ${topic} has become more crucial than ever before. Whether you're a beginner just starting out or someone looking to deepen your knowledge, this comprehensive guide will provide you with the insights and strategies you need to succeed.

## Understanding the Fundamentals

To truly master ${topic}, it's essential to start with a solid foundation. Here are the key principles that form the backbone of effective ${topic}:

### Core Principles

1. **Strategic Thinking**: Every successful approach to ${topic} begins with clear strategic planning. This involves understanding your objectives, identifying potential challenges, and developing a roadmap for success.

2. **Consistent Implementation**: Knowledge without action is worthless. The most effective practitioners of ${topic} are those who consistently apply what they learn and continuously refine their approach.

3. **Continuous Learning**: The field of ${topic} is constantly evolving. Staying updated with the latest trends, techniques, and best practices is crucial for long-term success.

## Advanced Strategies and Techniques

Once you've mastered the fundamentals, it's time to explore more advanced strategies that can significantly improve your results with ${topic}.

### Strategy 1: Data-Driven Decision Making

Modern ${topic} success relies heavily on data and analytics. By tracking key metrics and analyzing performance indicators, you can make informed decisions that lead to better outcomes.

**Key Metrics to Track:**
- Performance indicators specific to your goals
- Engagement rates and user feedback
- Cost-effectiveness and ROI measurements
- Long-term sustainability metrics

### Strategy 2: Technology Integration

Leveraging the right tools and technologies can dramatically improve your ${topic} results. From automation software to advanced analytics platforms, technology can help streamline your processes and enhance your capabilities.

### Strategy 3: Community and Networking

Building relationships within the ${topic} community can provide valuable insights, opportunities for collaboration, and access to resources that might otherwise be unavailable.

## Common Mistakes to Avoid

Even experienced practitioners can fall into these common traps when dealing with ${topic}:

1. **Overcomplicating the Process**: While ${topic} can be complex, starting with unnecessarily complicated strategies often leads to confusion and poor results.

2. **Neglecting the Basics**: In pursuit of advanced techniques, many people forget to maintain excellence in fundamental practices.

3. **Ignoring Feedback**: Whether from data, customers, or peers, feedback is crucial for improvement. Ignoring it can lead to stagnation.

4. **Lack of Patience**: Success with ${topic} often takes time. Expecting immediate results can lead to premature abandonment of effective strategies.

## Implementation Framework

Here's a step-by-step framework for implementing what you've learned about ${topic}:

### Phase 1: Assessment and Planning (Week 1-2)
- Evaluate your current situation and capabilities
- Set clear, measurable goals
- Develop a detailed action plan
- Identify necessary resources and tools

### Phase 2: Foundation Building (Week 3-6)
- Implement basic strategies and establish core processes
- Begin tracking key metrics
- Create systems for consistent execution
- Start building relevant skills and knowledge

### Phase 3: Optimization and Growth (Week 7-12)
- Analyze performance data and identify improvement opportunities
- Implement advanced strategies and techniques
- Scale successful approaches
- Continuously refine and optimize your methods

### Phase 4: Mastery and Innovation (Ongoing)
- Develop your own unique approaches and innovations
- Share knowledge and mentor others
- Stay ahead of industry trends and developments
- Contribute to the ${topic} community

## Tools and Resources

To support your ${topic} journey, consider utilizing these types of tools and resources:

**Essential Tools:**
- Analytics and tracking software
- Project management platforms
- Communication and collaboration tools
- Learning and development resources

**Recommended Resources:**
- Industry publications and blogs
- Professional associations and communities
- Online courses and certification programs
- Conferences and networking events

## Measuring Success

Success in ${topic} can be measured through various indicators:

**Quantitative Measures:**
- Performance metrics and KPIs
- Growth rates and trends
- Efficiency improvements
- Cost savings and ROI

**Qualitative Measures:**
- Skill development and expertise growth
- Relationship building and network expansion
- Innovation and creative problem-solving
- Leadership and influence within the community

## Future Trends and Developments

The field of ${topic} continues to evolve rapidly. Here are some trends to watch:

1. **Increased Automation**: Technology will continue to automate routine tasks, allowing practitioners to focus on higher-value activities.

2. **Personalization**: Customized approaches based on individual needs and preferences will become increasingly important.

3. **Sustainability**: Long-term thinking and sustainable practices will gain prominence.

4. **Integration**: Cross-functional collaboration and integrated approaches will become the norm.

## Conclusion

Mastering ${topic} requires dedication, continuous learning, and strategic thinking. By following the principles and strategies outlined in this guide, you'll be well-equipped to achieve success and make meaningful progress in your ${topic} journey.

Remember that success rarely happens overnight. Stay committed to your goals, remain flexible in your approach, and don't hesitate to seek help and guidance when needed. The ${topic} community is generally supportive and willing to help those who are genuinely committed to learning and growing.

Whether you're just starting out or looking to take your ${topic} skills to the next level, the key is to start where you are, use what you have, and do what you can. With persistence and the right strategies, you can achieve remarkable results.

*Start implementing these strategies today and watch your ${topic} capabilities transform over the coming months.*`;
}

function generateBatchArticles(titles) {
  const articles = titles.map((title, index) => {
    const shortArticle = `# ${title}

## Introduction
${title} is a crucial topic that deserves careful consideration and strategic implementation.

## Key Points
1. **Understanding the Fundamentals**: Start with a solid foundation of knowledge
2. **Strategic Implementation**: Apply proven methods consistently
3. **Continuous Improvement**: Monitor results and optimize your approach

## Best Practices
- Research thoroughly before making decisions
- Implement changes gradually and systematically
- Track progress using relevant metrics
- Stay updated with industry developments

## Conclusion
Success with ${title.toLowerCase()} requires dedication, strategic thinking, and consistent execution. By following these guidelines, you'll be well-positioned to achieve your objectives.

---`;
    return shortArticle;
  });

  return articles.join('\n\n');
}

function generateVideoScript(prompt, platform = 'general') {
  const hooks = [
    `Wait... this ${prompt} secret will blow your mind!`,
    `Stop scrolling! Here's the ${prompt} truth nobody talks about...`,
    `If you're struggling with ${prompt}, this changes everything!`,
    `${prompt} experts don't want you to know this...`,
    `The biggest ${prompt} mistake everyone makes...`
  ];

  const mainPoints = [
    `The counterintuitive approach to ${prompt} that actually works`,
    `Why traditional ${prompt} advice is keeping you stuck`,
    `The one ${prompt} technique that changed everything for me`,
    `What I wish I knew about ${prompt} when I started`,
    `The ${prompt} breakthrough that saved me years of frustration`
  ];

  const callToActions = [
    `Save this video if ${prompt} is important to you!`,
    `Follow for more ${prompt} insights like this!`,
    `Comment 'YES' if this helped with your ${prompt} journey!`,
    `Share this with someone who needs to see it!`,
    `Try this ${prompt} technique and let me know how it goes!`
  ];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  const mainContent = mainPoints[Math.floor(Math.random() * mainPoints.length)];
  const cta = callToActions[Math.floor(Math.random() * callToActions.length)];

  let platformHashtags = '';
  if (platform === 'tiktok') {
    platformHashtags = `#${prompt.replace(/\s+/g, '')} #viral #fyp #trending #tips`;
  } else if (platform === 'youtube') {
    platformHashtags = `#${prompt.replace(/\s+/g, '')} #tutorial #howto #tips`;
  } else if (platform === 'instagram') {
    platformHashtags = `#${prompt.replace(/\s+/g, '')} #reels #tips #motivation #growth`;
  } else {
    platformHashtags = `#${prompt.replace(/\s+/g, '')} #viral #tips`;
  }

  return `🎬 VIDEO SCRIPT: ${prompt}

HOOK (0-3 seconds):
"${hook}"

MAIN CONTENT (3-45 seconds):
${mainContent}

Here's what most people get wrong:
❌ They focus on the obvious solutions
❌ They ignore the underlying principles  
❌ They give up too early

But here's what actually works:
✅ Start with the foundation
✅ Focus on consistency over perfection
✅ Track your progress daily

CALL TO ACTION (45-60 seconds):
${cta}

HASHTAGS: ${platformHashtags}

ENGAGEMENT HOOKS:
- "You won't believe what happens next..."
- "The results speak for themselves"
- "This simple change made all the difference"`;
}

function generateSocialPost(prompt, platform = 'general') {
  const openingLines = [
    `🚀 Game-changing ${prompt} insight:`,
    `💡 ${prompt} breakthrough that changed everything:`,
    `🔥 The ${prompt} secret everyone's talking about:`,
    `✨ Life-changing ${prompt} realization:`,
    `🎯 ${prompt} truth that will save you years:`
  ];

  const insights = [
    `Most people think ${prompt} is about X, but it's actually about Y`,
    `The biggest ${prompt} mistake is focusing on the wrong metrics`,
    `${prompt} success isn't about doing more - it's about doing less, better`,
    `The counterintuitive approach to ${prompt} that actually works`,
    `Why the traditional ${prompt} advice is keeping you stuck`
  ];

  const opening = openingLines[Math.floor(Math.random() * openingLines.length)];
  const insight = insights[Math.floor(Math.random() * insights.length)];

  let platformContent = '';
  if (platform === 'twitter') {
    platformContent = `${opening}

${insight}

The game-changer? [Insert specific tip here]

Thread below 👇`;
  } else if (platform === 'linkedin') {
    platformContent = `${opening}

${insight}

Here's what I've learned:
• Insight #1: [Key learning]
• Insight #2: [Practical application]
• Insight #3: [Results achieved]

What's been your experience with ${prompt}?`;
  } else {
    platformContent = `${opening}

${insight}

Here's the breakdown:
✨ Key insight #1
✨ Key insight #2
✨ Key insight #3

Who else is ready to level up their ${prompt} game?

#${prompt.replace(/\s+/g, '')} #growth #tips`;
  }

  return platformContent;
}

function generateAdCopy(prompt) {
  const headlines = [
    `🚨 ATTENTION: ${prompt} Users!`,
    `⚡ BREAKTHROUGH: ${prompt} Solution Found!`,
    `🎯 GAME-CHANGER: New ${prompt} Method!`,
    `🔥 EXCLUSIVE: ${prompt} Secret Revealed!`,
    `💥 URGENT: ${prompt} Opportunity!`
  ];

  const problems = [
    `Tired of struggling with ${prompt}?`,
    `Fed up with ${prompt} taking forever?`,
    `Frustrated with ${prompt} not working?`,
    `Sick of ${prompt} complications?`,
    `Done with ${prompt} disappointments?`
  ];

  const solutions = [
    `This proven ${prompt} system changes everything`,
    `Revolutionary ${prompt} method gets results fast`,
    `Simple ${prompt} technique that actually works`,
    `Breakthrough ${prompt} approach saves time`,
    `Game-changing ${prompt} solution finally here`
  ];

  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  const problem = problems[Math.floor(Math.random() * problems.length)];
  const solution = solutions[Math.floor(Math.random() * solutions.length)];

  return `${headline}

${problem}

What if I told you ${solution}?

✅ Get results in 24 hours
✅ No technical skills needed
✅ Works for complete beginners
✅ Proven by 10,000+ users

🔥 LIMITED TIME: 50% OFF
(Normally $197, now just $97)

💰 BONUS: Get these FREE extras:
🎁 Exclusive training worth $97
🎁 One-on-one coaching session
🎁 Lifetime access to updates

⚠️ WARNING: Only 100 spots left

🛒 CLICK TO CLAIM YOUR DISCOUNT

⏰ Offer expires in 24 hours

*Results may vary. 60-day guarantee.`;
}

function generateArticleTitles(prompt) {
  const titles = [
    `The Ultimate Guide to ${prompt}: Everything You Need to Know`,
    `10 Essential ${prompt} Tips That Actually Work`,
    `Common ${prompt} Mistakes and How to Avoid Them`,
    `${prompt} Secrets: What Experts Don't Want You to Know`,
    `The Complete ${prompt} Strategy for Beginners`
  ];

  return titles.join('\n');
}
