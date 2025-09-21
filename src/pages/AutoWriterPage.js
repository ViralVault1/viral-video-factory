import React, { useState } from 'react';
import { FileText, Trash2, Download, Copy, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AutoWriterPage = () => {
  const [topic, setTopic] = useState('');
  const [customTitles, setCustomTitles] = useState('');
  const [articleQueue, setArticleQueue] = useState([]);
  const [generatedArticles, setGeneratedArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingArticles, setIsGeneratingArticles] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [config, setConfig] = useState({
    niche: 'Pets and pet care',
    articleStyle: 'Informative',
    pointOfView: 'Second-person',
    articleLength: 'Medium (~1500 words)',
    featuredImage: 'Yes (+1 Credit)',
    imagesInArticle: '3 Images (+3 Credits)',
    photoStyle: 'Photographic'
  });

  const testAPI = async () => {
    console.log('Testing API with POST request...');
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate 3 article titles about cats',
          type: 'creative'
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        alert('API works! Check console for details.');
      } else {
        alert(`API failed with status ${response.status}: ${data.error || data.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert(`Request failed: ${error.message}`);
    }
  };

  const handleGenerateTitles = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    
    setIsGenerating(true);
    try {
      const prompt = `Generate 5 compelling article titles about "${topic}". 
      Niche: ${config.niche}
      Style: ${config.articleStyle}
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
      
      // Parse titles from AI response
      const lines = data.content.split('\n').filter(line => line.trim());
      const titles = [];
      
      for (const line of lines) {
        const cleaned = line.replace(/^\d+\.?\s*/, '').trim();
        if (cleaned && cleaned.length > 10) {
          titles.push(cleaned);
        }
      }
      
      setCustomTitles(titles.join('\n'));
      toast.success(`Generated ${titles.length} titles!`);
      
    } catch (error) {
      console.error('Title generation failed:', error);
      toast.error(`Failed to generate titles: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTitlesToQueue = () => {
    if (!customTitles.trim()) return;
    
    const titles = customTitles.split('\n').filter(title => title.trim());
    const newTitles = titles.map(title => ({
      id: Date.now().toString() + Math.random(),
      title: title.trim()
    }));
    
    setArticleQueue(prev => [...prev, ...newTitles]);
    setCustomTitles('');
  };

  const handleRemoveFromQueue = (id) => {
    setArticleQueue(prev => prev.filter(item => item.id !== id));
  };

  const calculateCredits = () => {
    let creditsPerArticle = 1; // Base cost
    
    if (config.featuredImage === 'Yes (+1 Credit)') creditsPerArticle += 1;
    
    const imageCount = parseInt(config.imagesInArticle.match(/\d+/)?.[0] || '0');
    creditsPerArticle += imageCount;
    
    return articleQueue.length * creditsPerArticle;
  };

  const getTargetWordCount = () => {
    if (config.articleLength.includes('Short')) return 500;
    if (config.articleLength.includes('Medium')) return 1500;
    if (config.articleLength.includes('Long')) return 3500;
    return 1500; // default
  };

  const generateSingleArticle = async (title, targetWordCount) => {
    const prompt = `Write a comprehensive article with the title: "${title}"

Configuration:
- Niche: ${config.niche}
- Style: ${config.articleStyle}
- Point of View: ${config.pointOfView}
- Target Length: ${targetWordCount} words
- Include relevant examples and practical advice

Structure the article with:
1. Engaging introduction
2. Multiple detailed sections with subheadings
3. Practical tips and examples
4. Strong conclusion with actionable takeaways

Make it SEO-friendly, informative, and engaging for readers interested in ${config.niche}.`;

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          type: 'article',
          provider: 'gemini'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content || data.text || '';
      const wordCount = content.split(/\s+/).length;

      return {
        id: Date.now().toString() + Math.random(),
        title,
        content,
        wordCount,
        status: 'completed',
        generatedAt: new Date().toISOString(),
        config: { ...config }
      };
    } catch (error) {
      console.error(`Failed to generate article for "${title}":`, error);
      return {
        id: Date.now().toString() + Math.random(),
        title,
        content: `# ${title}\n\n*Article generation failed: ${error.message}. Please try again.*`,
        wordCount: 10,
        status: 'error',
        generatedAt: new Date().toISOString(),
        config: { ...config }
      };
    }
  };

  const handleGenerateArticles = async () => {
    if (articleQueue.length === 0) return;
    
    setIsGeneratingArticles(true);
    const targetWordCount = getTargetWordCount();
    
    try {
      toast.success(`Starting generation of ${articleQueue.length} articles...`);
      
      const articles = [];
      for (let i = 0; i < articleQueue.length; i++) {
        const queueItem = articleQueue[i];
        toast.loading(`Generating article ${i + 1} of ${articleQueue.length}: ${queueItem.title}`, {
          id: 'generation-progress'
        });
        
        const article = await generateSingleArticle(queueItem.title, targetWordCount);
        articles.push(article);
        
        // Add a small delay to prevent rate limiting
        if (i < articleQueue.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      setGeneratedArticles(prev => [...prev, ...articles]);
      setArticleQueue([]);
      
      toast.dismiss('generation-progress');
      toast.success(`Successfully generated ${articles.length} articles!`);
      
    } catch (error) {
      console.error('Article generation failed:', error);
      toast.error(`Article generation failed: ${error.message}`);
    } finally {
      setIsGeneratingArticles(false);
    }
  };

  const viewArticle = (article) => {
    setSelectedArticle(article);
  };

  const downloadArticle = (article) => {
    const blob = new Blob([article.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Article downloaded!');
  };

  const copyArticle = async (article) => {
    try {
      await navigator.clipboard.writeText(article.content);
      toast.success('Article copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy article');
    }
  };

  const downloadAllArticles = () => {
    if (generatedArticles.length === 0) {
      toast.error('No articles to download');
      return;
    }

    const allContent = generatedArticles.map(article => 
      `${'='.repeat(60)}\n${article.title}\n${'='.repeat(60)}\n\n${article.content}\n\n\n`
    ).join('');

    const blob = new Blob([allContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_articles_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('All articles downloaded!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="text-center py-8 border-b border-slate-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Auto Writer Studio</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Generate hundreds of high-quality, SEO-optimized articles in the background. From title 
          generation to final content, automate your entire writing workflow.
        </p>
      </div>

      {/* Test Button */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 text-center">
          <button 
            onClick={testAPI} 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          >
            Test API Connection
          </button>
          <p className="text-xs text-slate-400 mt-2">Click to test if API is working properly</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Generate Article Titles */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
              Generate Article Titles
            </h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter a topic, e.g., 'Labrador training tips'"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleGenerateTitles}
                  disabled={isGenerating || !topic.trim()}
                  className="mt-3 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isGenerating ? 'Generating...' : '✨ Generate'}
                </button>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-2">OR add your own titles below</p>
                <textarea
                  placeholder="Paste your article titles here, one per line."
                  value={customTitles}
                  onChange={(e) => setCustomTitles(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                onClick={handleAddTitlesToQueue}
                disabled={!customTitles.trim()}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Add Titles to Queue
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
              <div>
                <label className="block text-sm font-medium mb-2">Niche</label>
                <input
                  type="text"
                  value={config.niche}
                  onChange={(e) => setConfig(prev => ({ ...prev, niche: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
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
                    <option>Conversational</option>
                    <option>Formal</option>
                    <option>Humorous</option>
                  </select>
                </div>

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

              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-green-400">Generate AI Images</h3>
                
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
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateArticles}
                disabled={articleQueue.length === 0 || isGeneratingArticles}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isGeneratingArticles ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Generating Articles...
                  </>
                ) : (
                  <>
                    ✨ Generate {articleQueue.length} Articles ({calculateCredits()} Credits)
                  </>
                )}
              </button>
              
              {articleQueue.length === 0 && (
                <p className="text-xs text-slate-400 text-center">
                  After you press "START" the article generation happens in the background and
                  automatically.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Queue Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Queue of Articles to Generate</h2>
          
          {articleQueue.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your generation queue is empty.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {articleQueue.map((article) => (
                <div key={article.id} className="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-white">{article.title}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFromQueue(article.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generated Articles Section */}
        {generatedArticles.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Articles ({generatedArticles.length})</h2>
              <button
                onClick={downloadAllArticles}
                className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedArticles.map((article) => (
                <div key={article.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm line-clamp-2 flex-1">{article.title}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      {article.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>{article.wordCount} words</span>
                    <span className={`px-2 py-1 rounded ${
                      article.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {article.status}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => viewArticle(article)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-xs hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => copyArticle(article)}
                      className="flex-1 bg-slate-600 text-white py-2 px-3 rounded text-xs hover:bg-slate-500 flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadArticle(article)}
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-xs hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Article Viewer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-4xl max-h-[90vh] w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">{selectedArticle.title}</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
                  {selectedArticle.content}
                </pre>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t border-slate-700 bg-slate-900">
              <button
                onClick={() => copyArticle(selectedArticle)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => downloadArticle(selectedArticle)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

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
