import React, { useState } from 'react';
import { FileText, Settings, Download, Copy, Wand2, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AutoWriterPage = () => {
  const [config, setConfig] = useState({
    topic: '',
    keywords: '',
    tone: 'professional',
    length: 'medium',
    count: 5
  });
  
  const [titles, setTitles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('titles');

  // Generate titles using backend API
  const generateTitles = async () => {
    if (!config.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate ${config.count} compelling article titles about "${config.topic}". 
      Keywords to include: ${config.keywords}
      Tone: ${config.tone}
      Make them engaging, SEO-friendly, and clickable.
      Return as a numbered list.`;

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          type: 'creative',
          provider: 'gemini'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse titles from response
      const generatedTitles = parseTitlesFromContent(data.content);
      setTitles(generatedTitles);
      
      toast.success(`Generated ${generatedTitles.length} titles!`);
      
    } catch (error) {
      console.error('Title generation failed:', error);
      toast.error(`Failed to generate titles: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate article from title
  const generateArticle = async (title) => {
    setIsGenerating(true);
    try {
      const prompt = `Write a comprehensive article with the title: "${title}"
      Topic: ${config.topic}
      Keywords: ${config.keywords}
      Tone: ${config.tone}
      Length: ${config.length}
      
      Include:
      - Engaging introduction
      - Well-structured main content with subheadings
      - Practical examples
      - Strong conclusion
      - SEO optimization`;

      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          type: 'article',
          provider: 'auto'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      const newArticle = {
        id: Date.now(),
        title,
        content: data.content,
        wordCount: data.content.split(' ').length,
        createdAt: new Date().toLocaleString(),
        provider: data.provider
      };
      
      setArticles(prev => [newArticle, ...prev]);
      setActiveTab('articles');
      
      toast.success('Article generated successfully!');
      
    } catch (error) {
      console.error('Article generation failed:', error);
      toast.error(`Failed to generate article: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse titles from AI response
  const parseTitlesFromContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    const titles = [];
    
    for (const line of lines) {
      // Remove numbering and clean up
      const cleaned = line.replace(/^\d+\.?\s*/, '').trim();
      if (cleaned && cleaned.length > 10) {
        titles.push(cleaned);
      }
    }
    
    return titles.slice(0, config.count);
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Download article
  const downloadArticle = (article) => {
    const blob = new Blob([article.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.substring(0, 50)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Auto Writer Studio Pro</h1>
                <p className="text-sm text-gray-600">AI-powered content generation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">APIs Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <input
                    type="text"
                    value={config.topic}
                    onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="e.g., Digital Marketing Tips"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={config.keywords}
                    onChange={(e) => setConfig(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="SEO, marketing, growth"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={config.tone}
                    onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="conversational">Conversational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                  <select
                    value={config.length}
                    onChange={(e) => setConfig(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="short">Short (300-500 words)</option>
                    <option value="medium">Medium (500-800 words)</option>
                    <option value="long">Long (800-1200 words)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Titles</label>
                  <select
                    value={config.count}
                    onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="3">3 titles</option>
                    <option value="5">5 titles</option>
                    <option value="10">10 titles</option>
                  </select>
                </div>

                <button
                  onClick={generateTitles}
                  disabled={isGenerating || !config.topic.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Titles'}
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="mb-6">
              <div className="flex space-x-8 border-b border-gray-200">
                {[
                  { id: 'titles', label: 'Generated Titles', count: titles.length },
                  { id: 'articles', label: 'Articles', count: articles.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-1">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Titles Tab */}
            {activeTab === 'titles' && (
              <div className="space-y-4">
                {titles.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No titles generated yet</h3>
                    <p className="text-gray-600">Configure your settings and click "Generate Titles" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Generated Titles ({titles.length})</h3>
                    
                    {titles.map((title, index) => (
                      <div key={index} className="bg-white rounded-lg border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => copyToClipboard(title)}
                              className="p-2 text-gray-500 hover:text-blue-500"
                              title="Copy title"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => generateArticle(title)}
                              disabled={isGenerating}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                            >
                              Generate Article
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <div className="space-y-4">
                {articles.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No articles generated yet</h3>
                    <p className="text-gray-600">Generate titles first, then create articles from them.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <div key={article.id} className="bg-white rounded-lg border p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{article.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{article.wordCount} words</span>
                              <span>{article.createdAt}</span>
                              <span className="capitalize">via {article.provider}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(article.content)}
                              className="p-2 text-gray-500 hover:text-blue-500"
                              title="Copy article"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => downloadArticle(article)}
                              className="p-2 text-gray-500 hover:text-green-500"
                              title="Download article"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="prose max-w-none">
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {article.content.substring(0, 500)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoWriterPage;
