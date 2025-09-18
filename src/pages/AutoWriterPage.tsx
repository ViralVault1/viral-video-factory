import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Sparkles, Copy, Download, Play, Pause, Settings, Globe, Calendar, Zap, Target, Image as ImageIcon, ExternalLink, BookOpen, Clock, TrendingUp } from 'lucide-react';

interface ArticleTitle {
  id: string;
  title: string;
  status: 'queued' | 'generating' | 'completed' | 'published';
  wordCount?: number;
  generatedAt?: Date;
}

interface ArticleConfig {
  niche: string;
  articleStyle: string;
  pointOfView: string;
  articleLength: string;
  tone: string;
  language: string;
  featuredImage: string;
  imagesInArticle: string;
  photoStyle: string;
  seoOptimized: boolean;
  includeOutline: boolean;
  includeFAQ: boolean;
  includeConclusion: boolean;
  includeTags: boolean;
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  outline?: string;
  faq?: string;
  tags?: string[];
  featuredImagePrompt?: string;
  generatedAt: Date;
  status: 'draft' | 'scheduled' | 'published';
}

interface AutopilotConfig {
  enabled: boolean;
  postsPerDay: number;
  startDate: Date;
  selectedBlog: string;
  autoSchedule: boolean;
  categories: string[];
  internalLinking: boolean;
}

const AutoWriterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generator' | 'autopilot' | 'history'>('generator');
  const [topic, setTopic] = useState('');
  const [customTitles, setCustomTitles] = useState('');
  const [articleQueue, setArticleQueue] = useState<ArticleTitle[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [autopilotConfig, setAutopilotConfig] = useState<AutopilotConfig>({
    enabled: false,
    postsPerDay: 2,
    startDate: new Date(),
    selectedBlog: 'main-blog',
    autoSchedule: true,
    categories: ['General'],
    internalLinking: true,
  });

  const [config, setConfig] = useState<ArticleConfig>({
    niche: 'Technology and AI',
    articleStyle: 'Informative',
    pointOfView: 'Second-person',
    articleLength: 'Medium (~1500 words)',
    tone: 'Professional',
    language: 'English',
    featuredImage: 'Yes (+1 Credit)',
    imagesInArticle: '3 Images (+3 Credits)',
    photoStyle: 'Photographic',
    seoOptimized: true,
    includeOutline: true,
    includeFAQ: true,
    includeConclusion: true,
    includeTags: true,
  });

  const niches = [
    'Technology and AI', 'Health and Wellness', 'Business and Finance', 'Travel and Lifestyle',
    'Food and Cooking', 'Fashion and Beauty', 'Home and Garden', 'Education and Learning',
    'Sports and Fitness', 'Entertainment and Media', 'Science and Research', 'Environment and Sustainability',
    'Pets and Animals', 'Automotive', 'Real Estate', 'Personal Development'
  ];

  const tones = ['Professional', 'Conversational', 'Friendly', 'Authoritative', 'Casual', 'Scientific', 'Humorous', 'Inspirational'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Russian', 'Chinese', 'Japanese'];

  const handleGenerateTitles = async () => {
    if (!topic.trim()) return;
    
    setIsGeneratingTitles(true);
    
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Generate 10 compelling, SEO-optimized article titles about "${topic}" in the ${config.niche} niche.

      Requirements:
      - Style: ${config.articleStyle}
      - Tone: ${config.tone}
      - Target audience: People interested in ${config.niche}
      - Language: ${config.language}
      - Make titles click-worthy and engaging
      - Include relevant keywords for SEO
      - Mix different formats: how-to guides, listicles, tutorials, comparisons
      - Keep titles under 60 characters when possible
      - Focus on providing value and solving problems
      - Include trending keywords and current topics
      
      Return only the titles, one per line, without numbers or bullets.`;

      const result = await model.generateContent(prompt);
      const generatedTitles = result.response.text().trim().split('\n').filter(title => title.trim());
      
      setCustomTitles(generatedTitles.join('\n'));
    } catch (error) {
      console.error('Title generation failed:', error);
      alert('Failed to generate titles. Please check your API key and try again.');
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const handleAddTitlesToQueue = () => {
    if (!customTitles.trim()) return;
    
    const titles = customTitles.split('\n').filter(title => title.trim());
    const newTitles: ArticleTitle[] = titles.map(title => ({
      id: Date.now().toString() + Math.random(),
      title: title.trim(),
      status: 'queued'
    }));
    
    setArticleQueue(prev => [...prev, ...newTitles]);
    setCustomTitles('');
  };

  const handleRemoveFromQueue = (id: string) => {
    setArticleQueue(prev => prev.filter(item => item.id !== id));
  };

  const calculateCredits = () => {
    let creditsPerArticle = 1;
    
    if (config.featuredImage === 'Yes (+1 Credit)') creditsPerArticle += 1;
    const imageCount = parseInt(config.imagesInArticle.match(/\d+/)?.[0] || '0');
    creditsPerArticle += imageCount;
    
    return articleQueue.length * creditsPerArticle;
  };

  const getWordCountTarget = () => {
    if (config.articleLength.includes('500')) return 500;
    if (config.articleLength.includes('1500')) return 1500;
    if (config.articleLength.includes('3500')) return 3500;
    return 1500;
  };

  const handleGenerateArticles = async () => {
    if (articleQueue.length === 0) return;
    
    setIsGeneratingContent(true);
    
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const wordTarget = getWordCountTarget();
      const generatedArticles: GeneratedContent[] = [];
      
      // Update queue items to show generating status
      setArticleQueue(prev => prev.map(item => ({ ...item, status: 'generating' as const })));
      
      for (const article of articleQueue) {
        try {
          const seoPrompt = config.seoOptimized ? `
          - Include relevant keywords naturally throughout the text
          - Write SEO-optimized meta descriptions
          - Use proper heading structure (H1, H2, H3)
          - Include internal and external linking opportunities
          - Optimize for featured snippets
          - Focus on search intent and user experience` : '';

          const structurePrompt = `
          ${config.includeOutline ? '- Start with a detailed article outline' : ''}
          ${config.includeFAQ ? '- Include a comprehensive FAQ section at the end' : ''}
          ${config.includeConclusion ? '- End with a strong conclusion and call-to-action' : ''}
          ${config.includeTags ? '- Suggest 5-10 relevant tags for the article' : ''}`;

          const prompt = `Write a comprehensive ${config.articleStyle.toLowerCase()} article about: "${article.title}"

          Article Configuration:
          - Niche: ${config.niche}
          - Writing style: ${config.articleStyle}
          - Tone: ${config.tone}
          - Point of view: ${config.pointOfView}
          - Language: ${config.language}
          - Target word count: ~${wordTarget} words
          
          ${seoPrompt}
          
          Article Structure Requirements:
          ${structurePrompt}
          - Use engaging subheadings (H2, H3)
          - Include practical examples and actionable tips
          - Add relevant statistics and data points
          - Write engaging introduction and strong conclusion
          - Use ${config.pointOfView} perspective throughout
          - Make it valuable for readers interested in ${config.niche}
          
          Content Quality Standards:
          - Write in ${config.tone.toLowerCase()} tone
          - Ensure content is unique and plagiarism-free
          - Include recent trends and current information
          - Add bullet points and numbered lists for readability
          - Make it engaging and easy to scan
          - Focus on providing real value to readers
          
          Format the output with proper HTML tags including headings, paragraphs, lists, and emphasis.`;

          const result = await model.generateContent(prompt);
          const content = result.response.text();
          const wordCount = content.split(/\s+/).length;
          
          // Generate tags if requested
          let tags: string[] = [];
          if (config.includeTags) {
            try {
              const tagPrompt = `Generate 8 relevant SEO tags for this article title: "${article.title}" in the ${config.niche} niche. Return only the tags separated by commas.`;
              const tagResult = await model.generateContent(tagPrompt);
              tags = tagResult.response.text().split(',').map(tag => tag.trim());
            } catch (error) {
              console.error('Tag generation failed:', error);
            }
          }

          // Generate featured image prompt if requested
          let featuredImagePrompt: string | undefined;
          if (config.featuredImage === 'Yes (+1 Credit)') {
            featuredImagePrompt = `High-quality ${config.photoStyle.toLowerCase()} image representing: ${article.title}, professional, engaging, relevant to ${config.niche}`;
          }
          
          const generatedArticle: GeneratedContent = {
            id: article.id,
            title: article.title,
            content: content,
            wordCount: wordCount,
            tags: tags,
            featuredImagePrompt,
            generatedAt: new Date(),
            status: 'draft'
          };
          
          generatedArticles.push(generatedArticle);
          
          // Update individual article status
          setArticleQueue(prev => prev.map(item => 
            item.id === article.id 
              ? { ...item, status: 'completed' as const, wordCount: wordCount, generatedAt: new Date() }
              : item
          ));
          
          // Small delay between generations to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Failed to generate article for "${article.title}":`, error);
          setArticleQueue(prev => prev.map(item => 
            item.id === article.id 
              ? { ...item, status: 'queued' as const }
              : item
          ));
        }
      }
      
      setGeneratedContent(prev => [...generatedArticles, ...prev]);
      
      // Clear completed articles from queue after a delay
      setTimeout(() => {
        setArticleQueue(prev => prev.filter(item => item.status !== 'completed'));
      }, 3000);
      
      if (generatedArticles.length > 0) {
        alert(`Successfully generated ${generatedArticles.length} articles!`);
      }
    } catch (error) {
      console.error('Article generation failed:', error);
      alert('Failed to generate articles. Please check your API key and try again.');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Content copied to clipboard!');
  };

  const handleDownloadContent = (article: GeneratedContent) => {
    const element = document.createElement('a');
    const file = new Blob([article.content], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleToggleAutopilot = () => {
    setAutopilotConfig(prev => ({ ...prev, enabled: !prev.enabled }));
    if (!autopilotConfig.enabled) {
      alert('AutoPilot activated! Articles will be generated and published automatically according to your schedule.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-500';
      case 'generating': return 'bg-blue-500 animate-pulse';
      case 'completed': return 'bg-green-500';
      case 'published': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'queued': return 'Queued';
      case 'generating': return 'Generating...';
      case 'completed': return 'Completed';
      case 'published': return 'Published';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="text-center py-8 border-b border-slate-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Auto Writer Studio Pro</h1>
        <p className="text-slate-400 max-w-3xl mx-auto">
          Generate hundreds of high-quality, SEO-optimized articles with AutoPilot technology. 
          From title generation to automatic WordPress publishing - complete content automation at scale.
        </p>
        
        {/* Stats Bar */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{generatedContent.length}</div>
            <div className="text-xs text-slate-400">Articles Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{articleQueue.length}</div>
            <div className="text-xs text-slate-400">In Queue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {generatedContent.reduce((total, article) => total + article.wordCount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400">Words Generated</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'generator', label: 'Content Generator', icon: FileText },
              { id: 'autopilot', label: 'AutoPilot', icon: Target },
              { id: 'history', label: 'Generated Content', icon: BookOpen },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-6 py-4 border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Generate Article Titles */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Generate Article Titles
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter a topic or keyword..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleGenerateTitles}
                      disabled={isGeneratingTitles || !topic.trim()}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {isGeneratingTitles ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">AI will generate SEO-optimized titles based on current trends and your niche</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">Generated Titles (or add your own)</p>
                  <textarea
                    placeholder="AI-generated titles will appear here, or add your own titles (one per line)"
                    value={customTitles}
                    onChange={(e) => setCustomTitles(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleAddTitlesToQueue}
                  disabled={!customTitles.trim()}
                  className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Titles to Queue ({customTitles.split('\n').filter(t => t.trim()).length})
                </button>
              </div>
            </div>

            {/* Right Column - Configure Article Details */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Configure Article Details
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Niche</label>
                    <select
                      value={config.niche}
                      onChange={(e) => setConfig(prev => ({ ...prev, niche: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {niches.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select
                      value={config.language}
                      onChange={(e) => setConfig(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Article Style</label>
                    <select
                      value={config.articleStyle}
                      onChange={(e) => setConfig(prev => ({ ...prev, articleStyle: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>Informative</option>
                      <option>Guide</option>
                      <option>How-to</option>
                      <option>Tutorial</option>
                      <option>Listicle</option>
                      <option>Review</option>
                      <option>Comparison</option>
                      <option>News</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tone</label>
                    <select
                      value={config.tone}
                      onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      {tones.map(tone => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Point of View</label>
                    <select
                      value={config.pointOfView}
                      onChange={(e) => setConfig(prev => ({ ...prev, pointOfView: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>First-person</option>
                      <option>Second-person</option>
                      <option>Third-person</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Article Length</label>
                    <select
                      value={config.articleLength}
                      onChange={(e) => setConfig(prev => ({ ...prev, articleLength: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>Short (~500 words)</option>
                      <option>Medium (~1500 words)</option>
                      <option>Long (~3500+ words)</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-3 text-purple-400">Advanced Options</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={config.seoOptimized}
                        onChange={(e) => setConfig(prev => ({ ...prev, seoOptimized: e.target.checked }))}
                        className="rounded"
                      />
                      SEO Optimized
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={config.includeOutline}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeOutline: e.target.checked }))}
                        className="rounded"
                      />
                      Include Outline
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={config.includeFAQ}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeFAQ: e.target.checked }))}
                        className="rounded"
                      />
                      Include FAQ
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={config.includeTags}
                        onChange={(e) => setConfig(prev => ({ ...prev, includeTags: e.target.checked }))}
                        className="rounded"
                      />
                      Generate Tags
                    </label>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Featured Image</label>
                      <select
                        value={config.featuredImage}
                        onChange={(e) => setConfig(prev => ({ ...prev, featuredImage: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option>Yes (+1 Credit)</option>
                        <option>No</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Images in Article</label>
                      <select
                        value={config.imagesInArticle}
                        onChange={(e) => setConfig(prev => ({ ...prev, imagesInArticle: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option>0 Images</option>
                        <option>1 Image (+1 Credit)</option>
                        <option>2 Images (+2 Credits)</option>
                        <option>3 Images (+3 Credits)</option>
                        <option>4 Images (+4 Credits)</option>
                        <option>5 Images (+5 Credits)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Photo Style</label>
                      <select
                        value={config.photoStyle}
                        onChange={(e) => setConfig(prev => ({ ...prev, photoStyle: e.target.value }))}
                        className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option>Photographic</option>
                        <option>Cinematic</option>
                        <option>Minimalist</option>
                        <option>Abstract</option>
                        <option>Professional</option>
                        <option>Creative</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateArticles}
                  disabled={articleQueue.length === 0 || isGeneratingContent}
                  className="w-full px-4 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isGeneratingContent ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating Articles...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate {articleQueue.length} Articles ({calculateCredits()} Credits)
                    </>
                  )}
                </button>
                
                {articleQueue.length === 0 && (
                  <p className="text-xs text-slate-400 text-center">
                    Add article titles to the queue to start generating high-quality content.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'autopilot' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-6 h-6 mr-3 text-green-400" />
                AutoPilot Configuration
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div>
                    <h3 className="font-medium text-green-400">AutoPilot Status</h3>
                    <p className="text-sm text-slate-400">
                      {autopilotConfig.enabled ? 'Active - Generating content automatically' : 'Inactive - Manual generation only'}
                    </p>
                  </div>
                  <button
                    onClick={handleToggleAutopilot}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      autopilotConfig.enabled 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {autopilotConfig.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {autopilotConfig.enabled ? 'Stop AutoPilot' : 'Start AutoPilot'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Posts Per Day</label>
                    <select
                      value={autopilotConfig.postsPerDay}
                      onChange={(e) => setAutopilotConfig(prev => ({ ...prev, postsPerDay: Number(e.target.value) }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value={1}>1 post per day</option>
                      <option value={2}>2 posts per day</option>
                      <option value={3}>3 posts per day</option>
                      <option value={5}>5 posts per day</option>
                      <option value={10}>10 posts per day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Blog</label>
                    <select
                      value={autopilotConfig.selectedBlog}
                      onChange={(e) => setAutopilotConfig(prev => ({ ...prev, selectedBlog: e.target.value }))}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="main-blog">Main Blog</option>
                      <option value="tech-blog">Tech Blog</option>
                      <option value="lifestyle-blog">Lifestyle Blog</option>
                      <option value="custom">Custom WordPress</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categories (comma separated)</label>
                  <input
                    type="text"
                    value={autopilotConfig.categories.join(', ')}
                    onChange={(e) => setAutopilotConfig(prev => ({ 
                      ...prev, 
                      categories: e.target.value.split(',').map(cat => cat.trim()).filter(Boolean)
                    }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="General, Technology, Business"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autopilotConfig.autoSchedule}
                      onChange={(e) => setAutopilotConfig(prev => ({ ...prev, autoSchedule: e.target.checked }))}
                      className="rounded"
                    />
                    Auto-schedule publishing
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={autopilotConfig.internalLinking}
                      onChange={(e) => setAutopilotConfig(prev => ({ ...prev, internalLinking: e.target.checked }))}
                      className="rounded"
                    />
                    Add internal links automatically
                  </label>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg">
                  <h3 className="font-medium text-white mb-2">AutoPilot Features</h3>
                  <ul className="text-sm text-purple-100 space-y-1">
                    <li>• Bulk article generation (100+ articles in 30 minutes)</li>
                    <li>• Automatic WordPress publishing</li>
                    <li>• SEO-optimized content with internal linking</li>
                    <li>• AI image generation and insertion</li>
                    <li>• Smart scheduling and content calendar</li>
                    <li>• Multi-language support</li>
                    <li>• Niche-specific content generation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-400" />
                Publishing Schedule
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="font-medium text-blue-400 mb-2">Next 7 Days Schedule</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      return (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                          <span className="text-green-400">{autopilotConfig.postsPerDay} posts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="font-medium text-yellow-400 mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">98.5%</div>
                      <div className="text-slate-400">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">2.3s</div>
                      <div className="text-slate-400">Avg Generation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">1,247</div>
                      <div className="text-slate-400">Articles/Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-400">15</div>
                      <div className="text-slate-400">Active Blogs</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-white">
                  <h3 className="font-medium mb-2">WordPress Integration</h3>
                  <p className="text-sm text-green-100 mb-3">
                    Connect your WordPress blogs for seamless publishing. AutoPilot will handle formatting, categories, tags, and featured images.
                  </p>
                  <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Connect WordPress
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {generatedContent.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Articles Generated Yet</h3>
                <p className="text-slate-400 mb-4">Start by generating some article titles and creating your first batch of content.</p>
                <button
                  onClick={() => setActiveTab('generator')}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                >
                  Generate Articles
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {generatedContent.map((article) => (
                  <div key={article.id} className="bg-slate-800 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">{article.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {article.wordCount.toLocaleString()} words
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.generatedAt.toLocaleDateString()}
                          </span>
                          {article.tags && (
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {article.tags.length} tags
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            article.status === 'published' ? 'bg-green-600 text-white' : 
                            article.status === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'
                          }`}>
                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setSelectedContent(selectedContent?.id === article.id ? null : article)}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        {selectedContent?.id === article.id ? 'Hide' : 'Preview'} Content
                      </button>
                      <button
                        onClick={() => handleCopyContent(article.content)}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                      <button
                        onClick={() => handleDownloadContent(article)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                      {article.featuredImagePrompt && (
                        <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          Generate Image
                        </button>
                      )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 6).map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedContent?.id === article.id && (
                      <div className="bg-slate-900 p-4 rounded-lg mt-4 border border-slate-700">
                        <div className="prose prose-invert max-w-none max-h-96 overflow-y-auto">
                          <div 
                            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
                            className="text-sm text-slate-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Queue Section - Always visible */}
        {articleQueue.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-orange-400" />
              Generation Queue ({articleQueue.length} articles)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {articleQueue.map((article) => (
                <div key={article.id} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-white flex-1 pr-2">{article.title}</h3>
                    <button
                      onClick={() => handleRemoveFromQueue(article.id)}
                      className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"
                      disabled={article.status === 'generating'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getStatusColor(article.status)} text-white`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {getStatusText(article.status)}
                    </span>
                    {article.wordCount && (
                      <span className="text-xs text-slate-400">
                        {article.wordCount.toLocaleString()} words
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">SOLUTIONS</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">PRODUCTS</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Video Generator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">RESOURCES</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">COMPANY</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AutoWriterPage;
