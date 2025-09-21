import React, { useState } from 'react';
import { FileText, Trash2, Download, Copy, Eye, Clock, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import LLM services (you'll need to create these)
import llmRouter from '../services/llmRouter';
const TaskType = { SCRIPT_WRITING: 'script_writing' };


const AutoWriterPage = () => {
  const [topic, setTopic] = useState('');
  const [customTitles, setCustomTitles] = useState('');
  const [articleQueue, setArticleQueue] = useState([]);
  const [generatedArticles, setGeneratedArticles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingArticles, setIsGeneratingArticles] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedNiches, setSelectedNiches] = useState(['Food & Cooking']);
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  
  const [config, setConfig] = useState({
    articleStyle: 'Informative',
    pointOfView: 'Second-person',
    articleLength: 'Medium (~1500 words)',
    featuredImage: 'Yes (+1 Credit)',
    imagesInArticle: '3 Images (+3 Credits)',
    photoStyle: 'Photographic'
  });

  const availableNiches = [
    'Food & Cooking', 'Health & Fitness', 'Technology', 'Business & Finance',
    'Travel & Lifestyle', 'Home & Garden', 'Fashion & Beauty', 'Education & Learning',
    'Entertainment & Gaming', 'Parenting & Family', 'Sports & Recreation', 'Arts & Crafts',
    'Personal Development', 'Science & Nature', 'Automotive', 'Real Estate',
    'Marketing & SEO', 'Photography', 'Music & Audio', 'Pet Care', 'DIY & Crafts',
    'Mental Health', 'Cryptocurrency', 'Sustainability', 'Fitness & Nutrition',
    'Career Development', 'Relationships', 'Productivity', 'Investing', 'Gaming',
    'Social Media', 'E-commerce', 'Artificial Intelligence', 'Web Development'
  ];

  const handleNicheToggle = (niche) => {
    setSelectedNiches(prev => {
      if (prev.includes(niche)) {
        return prev.filter(n => n !== niche);
      } else {
        return [...prev, niche];
      }
    });
  };

  const removeNiche = (niche) => {
    setSelectedNiches(prev => prev.filter(n => n !== niche));
  };

  const testLLMConnection = async () => {
    console.log('Testing LLM connection...');
    try {
      toast.loading('Testing LLM connection...', { id: 'llm-test' });
      
      const result = await llmRouter.executeTask(
        TaskType.SCRIPT_WRITING,
        'Write a short test message to confirm the LLM is working properly.',
        { maxTokens: 50 }
      );
      
      toast.dismiss('llm-test');
      toast.success('LLM connection successful!');
      console.log('LLM Test Result:', result);
      alert(`LLM Test Successful!\n\nResponse: ${result.substring(0, 100)}...`);
      
    } catch (error) {
      toast.dismiss('llm-test');
      toast.error('LLM connection failed!');
      console.error('LLM Test Failed:', error);
      alert(`LLM Test Failed: ${error.message}`);
    }
  };

  const handleGenerateTitles = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (selectedNiches.length === 0) {
      toast.error('Please select at least one niche');
      return;
    }
    
    setIsGenerating(true);
    try {
      const nichesText = selectedNiches.join(', ');
      const prompt = `Generate 5 compelling, SEO-optimized article titles about "${topic}".

Context:
- Target Niches: ${nichesText}
- Writing Style: ${config.articleStyle}
- Point of View: ${config.pointOfView}

Requirements:
- Make titles engaging and clickable
- Ensure they're SEO-friendly with relevant keywords
- Vary the title structures (how-to, listicles, guides, etc.)
- Make them specific and actionable
- Target audience interested in ${nichesText}

Return exactly 5 titles, one per line, without numbering.`;

      toast.loading('Generating article titles...', { id: 'title-gen' });
      
      const result = await llmRouter.executeTask(
        TaskType.SCRIPT_WRITING,
        prompt,
        { maxTokens: 300, temperature: 0.8 }
      );
      
      toast.dismiss('title-gen');
      
      // Parse titles from AI response
      const lines = result.split('\n').filter(line => line.trim());
      const titles = [];
      
      for (const line of lines) {
        const cleaned = line.replace(/^\d+\.?\s*/, '').replace(/^[-•]\s*/, '').trim();
        if (cleaned && cleaned.length > 10) {
          titles.push(cleaned);
        }
      }
      
      if (titles.length > 0) {
        setCustomTitles(titles.join('\n'));
        toast.success(`Generated ${titles.length} titles!`);
      } else {
        // Fallback: use the raw response
        setCustomTitles(result);
        toast.success('Titles generated! Please review and edit as needed.');
      }
      
    } catch (error) {
      toast.dismiss('title-gen');
      console.error('Title generation failed:', error);
      toast.error(`Failed to generate titles: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTitlesToQueue = () => {
    if (!customTitles.trim()) {
      toast.error('No titles to add');
      return;
    }
    
    const titles = customTitles.split('\n').filter(title => title.trim());
    const newTitles = titles.map(title => ({
      id: Date.now().toString() + Math.random(),
      title: title.trim(),
      niches: [...selectedNiches]
    }));
    
    setArticleQueue(prev => [...prev, ...newTitles]);
    setCustomTitles('');
    toast.success(`Added ${newTitles.length} titles to queue!`);
  };

  const handleRemoveFromQueue = (id) => {
    setArticleQueue(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from queue');
  };

  const calculateCredits = () => {
    let creditsPerArticle = 1; // Base cost
    
    if (config.featuredImage === 'Yes (+1 Credit)') creditsPerArticle += 1;
    
    const imageCount = parseInt(config.imagesInArticle.match(/\d+/)?.[0] || '0');
    creditsPerArticle += imageCount;
    
    return articleQueue.length * creditsPerArticle;
  };

  const getTargetWordCount = () => {
    if (config.articleLength.includes('Short')) return 800;
    if (config.articleLength.includes('Medium')) return 1500;
    if (config.articleLength.includes('Long')) return 3000;
    return 1500; // default
  };

  const generateSingleArticle = async (queueItem, targetWordCount) => {
    const { title, niches } = queueItem;
    const nichesText = niches.join(', ');
    
    const prompt = `Write a comprehensive, high-quality article with the title: "${title}"

Article Configuration:
- Target Niches: ${nichesText}
- Writing Style: ${config.articleStyle}
- Point of View: ${config.pointOfView}
- Target Length: ${targetWordCount} words
- Photo Style: ${config.photoStyle}

Content Requirements:
1. Write an engaging introduction that hooks the reader
2. Create detailed sections with clear subheadings (use ## for subheadings)
3. Include practical tips, examples, and actionable advice
4. Add relevant statistics or facts where appropriate
5. Write a strong conclusion with key takeaways
6. Make it SEO-optimized with natural keyword usage
7. Ensure the content is valuable and informative for ${nichesText} audience

Structure:
- Introduction (engaging hook)
- 4-6 main sections with subheadings
- Practical examples and tips throughout
- Conclusion with actionable takeaways

Write in ${config.pointOfView} perspective and maintain a ${config.articleStyle.toLowerCase()} tone throughout.`;

    try {
      const result = await llmRouter.executeTask(
        TaskType.SCRIPT_WRITING,
        prompt,
        { maxTokens: 2000, temperature: 0.7 }
      );
      
      const content = result || '';
      const wordCount = content.split(/\s+/).length;

      return {
        id: Date.now().toString() + Math.random(),
        title,
        content,
        wordCount,
        status: 'completed',
        generatedAt: new Date().toISOString(),
        niches,
        config: { ...config }
      };
    } catch (error) {
      console.error(`Failed to generate article for "${title}":`, error);
      return {
        id: Date.now().toString() + Math.random(),
        title,
        content: `# ${title}\n\n*Article generation failed: ${error.message}. Please try again.*\n\nThis could be due to:\n- API rate limits\n- Network connectivity issues\n- Invalid API keys\n\nPlease check your API configuration and try again.`,
        wordCount: 25,
        status: 'error',
        generatedAt: new Date().toISOString(),
        niches,
        config: { ...config }
      };
    }
  };

  const handleGenerateArticles = async () => {
    if (articleQueue.length === 0) {
      toast.error('No articles in queue');
      return;
    }
    
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
        
        const article = await generateSingleArticle(queueItem, targetWordCount);
        articles.push(article);
        
        // Add a delay to prevent rate limiting
        if (i < articleQueue.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      setGeneratedArticles(prev => [...prev, ...articles]);
      setArticleQueue([]);
      
      toast.dismiss('generation-progress');
      
      const successCount = articles.filter(a => a.status === 'completed').length;
      const errorCount = articles.filter(a => a.status === 'error').length;
      
      if (successCount > 0) {
        toast.success(`Successfully generated ${successCount} articles!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} articles failed to generate`);
      }
      
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

  const clearAllArticles = () => {
    if (window.confirm('Are you sure you want to delete all generated articles?')) {
      setGeneratedArticles([]);
      toast.success('All articles cleared!');
    }
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

      {/* LLM Status and Test */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 text-center space-y-4">
 
            taskType={TaskType.SCRIPT_WRITING}
            provider={llmRouter.getProviderForTask(TaskType.SCRIPT_WRITING)}
            isLoading={isGenerating || isGeneratingArticles}
          />
          <button 
            onClick={testLLMConnection} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            🔧 Test LLM Connection
          </button>
          <p className="text-xs text-slate-400">Click to verify LLM services are working properly</p>
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
                  disabled={isGenerating || !topic.trim() || selectedNiches.length === 0}
                  className="mt-3 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isGenerating ? '🔄 Generating...' : '✨ Generate Titles'}
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
                📝 Add Titles to Queue
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
              {/* Multi-Select Niches */}
              <div>
                <label className="block text-sm font-medium mb-2">Niches (Select Multiple)</label>
                
                {/* Selected Niches */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedNiches.map(niche => (
                    <span key={niche} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {niche}
                      <button
                        onClick={() => removeNiche(niche)}
                        className="hover:bg-purple-700 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNicheDropdown(!showNicheDropdown)}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 text-left flex items-center justify-between"
                  >
                    <span>Add niches...</span>
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  {showNicheDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg max-h-60 overflow-y-auto">
                      {availableNiches.map(niche => (
                        <button
                          key={niche}
                          onClick={() => {
                            handleNicheToggle(niche);
                            setShowNicheDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left hover:bg-slate-600 transition-colors ${
                            selectedNiches.includes(niche) ? 'bg-purple-600 text-white' : 'text-slate-300'
                          }`}
                        >
                          {niche}
                          {selectedNiches.includes(niche) && <span className="float-right">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
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
                    <option>Conversational</option>
                    <option>Formal</option>
                    <option>Humorous</option>
                    <option>Professional</option>
                    <option>Casual</option>
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
                  <option>Short (~800 words)</option>
                  <option>Medium (~1500 words)</option>
                  <option>Long (~3000 words)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Featured Image</label>
                  <select
                    value={config.featuredImage}
                    onChange={(e) => setConfig(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
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
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>0 Images</option>
                    <option>1 Image (+1 Credit)</option>
                    <option>3 Images (+3 Credits)</option>
                    <option>5 Images (+5 Credits)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo Style</label>
                <select
                  value={config.photoStyle}
                  onChange={(e) => setConfig(prev => ({ ...prev, photoStyle: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option>Photographic</option>
                  <option>Illustration</option>
                  <option>Minimalist</option>
                  <option>Artistic</option>
                </select>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">🔥 Generate Articles</span>
                  <span className="text-lg font-bold text-green-400">{calculateCredits()} Credits</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  After you queue articles in the background and automatically generate them in the background.
                </p>
                <button
                  onClick={handleGenerateArticles}
                  disabled={articleQueue.length === 0 || isGeneratingArticles}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
                >
                  {isGeneratingArticles ? '🔄 Generating Articles...' : `🚀 Generate ${articleQueue.length} Articles (${calculateCredits()} Credits)`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Queue of Articles to Generate */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Queue of Articles to Generate</h2>
          
          {articleQueue.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Your generation queue is empty.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articleQueue.map((item) => (
                <div key={item.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.niches.map(niche => (
                        <span key={niche} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          {niche}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromQueue(item.id)}
                    className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Generated Articles */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Articles ({generatedArticles.length})</h2>
            {generatedArticles.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={downloadAllArticles}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </button>
                <button
                  onClick={clearAllArticles}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          {generatedArticles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No articles generated yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedArticles.map((article) => (
                <div key={article.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm leading-tight">{article.title}</h3>
                    <div className="flex items-center ml-2">
                      {article.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.niches?.map(niche => (
                      <span key={niche} className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                        {niche}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(article.generatedAt).toLocaleString()}
                    </div>
                    <div className="mt-1">
                      {article.wordCount} words • {article.status}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewArticle(article)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button
                      onClick={() => copyArticle(article)}
                      className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadArticle(article)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Article Viewer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {selectedArticle.content}
                </pre>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-slate-700">
              <button
                onClick={() => copyArticle(selectedArticle)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={() => downloadArticle(selectedArticle)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoWriterPage;
