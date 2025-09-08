import React, { useState } from 'react';
import { Scene } from '../types';

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  script: string;
  scenes: Partial<Scene>[];
  voiceSettings: {
    voice: string;
    volume: number;
  };
  tags: string[];
  estimatedDuration: number; // in seconds
}

interface VideoTemplatesProps {
  onSelectTemplate: (template: VideoTemplate) => void;
  onClose: () => void;
}

export const VideoTemplates: React.FC<VideoTemplatesProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const templates: VideoTemplate[] = [
    {
      id: 'educational-howto',
      name: 'How-To Tutorial',
      description: 'Step-by-step educational content template',
      category: 'educational',
      thumbnail: '🎓',
      script: 'Today I\'ll show you how to [TOPIC]. This simple method will help you [BENEFIT]. Let\'s get started with step one...',
      scenes: [
        { script: 'Hook: Did you know that [SURPRISING FACT]? Today I\'ll show you exactly how to [ACHIEVE GOAL].' },
        { script: 'Step 1: First, you need to [ACTION]. This is crucial because [REASON].' },
        { script: 'Step 2: Next, [ACTION]. Make sure to [IMPORTANT TIP].' },
        { script: 'Step 3: Finally, [ACTION]. This will [RESULT].' },
        { script: 'That\'s it! You now know how to [TOPIC]. Try this method and let me know how it works for you!' }
      ],
      voiceSettings: { voice: 'alloy', volume: 0.8 },
      tags: ['tutorial', 'education', 'how-to'],
      estimatedDuration: 45
    },
    {
      id: 'viral-facts',
      name: 'Mind-Blowing Facts',
      description: 'Engaging facts that capture attention',
      category: 'entertainment',
      thumbnail: '🤯',
      script: 'Here are 5 mind-blowing facts that will change how you see the world...',
      scenes: [
        { script: 'Here are 5 facts that will blow your mind. Number 3 will shock you!' },
        { script: 'Fact 1: [AMAZING FACT]. This means that [IMPLICATION].' },
        { script: 'Fact 2: [SURPRISING FACT]. Scientists discovered this by [METHOD].' },
        { script: 'Fact 3: [SHOCKING FACT]. This completely changes our understanding of [TOPIC].' },
        { script: 'Fact 4: [INTERESTING FACT]. The implications are [CONSEQUENCE].' },
        { script: 'Fact 5: [FINAL FACT]. What do you think about these facts? Comment below!' }
      ],
      voiceSettings: { voice: 'nova', volume: 0.9 },
      tags: ['facts', 'viral', 'entertainment'],
      estimatedDuration: 50
    },
    {
      id: 'product-demo',
      name: 'Product Showcase',
      description: 'Professional product demonstration',
      category: 'business',
      thumbnail: '💼',
      script: 'Introducing [PRODUCT NAME] - the solution you\'ve been waiting for...',
      scenes: [
        { script: 'Meet [PRODUCT NAME] - the game-changing solution for [PROBLEM].' },
        { script: 'The problem: [PAIN POINT]. This affects millions of people daily.' },
        { script: 'Our solution: [PRODUCT] solves this by [HOW IT WORKS].' },
        { script: 'Key benefits: [BENEFIT 1], [BENEFIT 2], and [BENEFIT 3].' },
        { script: 'Ready to transform your [AREA]? Get [PRODUCT] today and see the difference!' }
      ],
      voiceSettings: { voice: 'onyx', volume: 0.8 },
      tags: ['product', 'business', 'demo'],
      estimatedDuration: 40
    },
    {
      id: 'lifestyle-tips',
      name: 'Life Hacks',
      description: 'Quick tips for better living',
      category: 'lifestyle',
      thumbnail: '🌟',
      script: '5 life hacks that will save you time and money every day...',
      scenes: [
        { script: '5 simple life hacks that will change your daily routine forever!' },
        { script: 'Hack 1: [TIP]. This saves you [TIME/MONEY] because [REASON].' },
        { script: 'Hack 2: [TIP]. Try this and you\'ll never go back to the old way.' },
        { script: 'Hack 3: [TIP]. This one trick has helped thousands of people.' },
        { script: 'Hack 4: [TIP]. The results speak for themselves.' },
        { script: 'Hack 5: [TIP]. Which hack will you try first? Let me know!' }
      ],
      voiceSettings: { voice: 'shimmer', volume: 0.8 },
      tags: ['lifestyle', 'tips', 'hacks'],
      estimatedDuration: 55
    },
    {
      id: 'news-breakdown',
      name: 'News Analysis',
      description: 'Breaking down current events',
      category: 'news',
      thumbnail: '📰',
      script: 'Breaking: [NEWS TOPIC]. Here\'s what you need to know...',
      scenes: [
        { script: 'Breaking news: [HEADLINE]. Here\'s everything you need to know.' },
        { script: 'What happened: [EVENT DESCRIPTION]. This occurred because [CAUSE].' },
        { script: 'Why it matters: [SIGNIFICANCE]. This affects [WHO/WHAT].' },
        { script: 'What\'s next: [IMPLICATIONS]. Experts predict [FUTURE OUTCOME].' },
        { script: 'Stay informed and share your thoughts. What do you think about this development?' }
      ],
      voiceSettings: { voice: 'echo', volume: 0.8 },
      tags: ['news', 'analysis', 'current events'],
      estimatedDuration: 45
    },
    {
      id: 'story-time',
      name: 'Storytelling',
      description: 'Engaging narrative template',
      category: 'entertainment',
      thumbnail: '📚',
      script: 'Let me tell you an incredible story that happened to [PERSON]...',
      scenes: [
        { script: 'This is the incredible story of [PERSON/EVENT]. You won\'t believe what happened next.' },
        { script: 'It all started when [BEGINNING]. Everything seemed normal until [TURNING POINT].' },
        { script: 'Then, [MAJOR EVENT]. No one could have predicted what would happen.' },
        { script: 'The climax: [DRAMATIC MOMENT]. This changed everything forever.' },
        { script: 'The ending: [RESOLUTION]. The lesson we can learn is [MORAL/TAKEAWAY].' }
      ],
      voiceSettings: { voice: 'fable', volume: 0.8 },
      tags: ['story', 'narrative', 'entertainment'],
      estimatedDuration: 60
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📁' },
    { id: 'educational', name: 'Educational', icon: '🎓' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌟' },
    { id: 'news', name: 'News', icon: '📰' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Video Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">No templates found</p>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{template.thumbnail}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{template.estimatedDuration}s</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Scenes:</span>
                      <span className="font-medium">{template.scenes.length}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

