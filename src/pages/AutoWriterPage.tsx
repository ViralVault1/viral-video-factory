import React, { useState } from 'react';
import { FileText, Plus, Trash2, Sparkles, Copy, Download } from 'lucide-react';

interface ArticleTitle {
  id: string;
  title: string;
}

interface ArticleConfig {
  niche: string;
  articleStyle: string;
  pointOfView: string;
  articleLength: string;
  featuredImage: string;
  imagesInArticle: string;
  photoStyle: string;
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  generatedAt: Date;
}

const AutoWriterPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [customTitles, setCustomTitles] = useState('');
  const [articleQueue, setArticleQueue] = useState<ArticleTitle[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [config, setConfig] = useState<ArticleConfig>({
    niche: 'Pets and pet care',
    articleStyle: 'Informative',
    pointOfView: 'Second-person',
    articleLength: 'Medium (~1500 words)',
    featuredImage: 'Yes (+1 Credit)',
    imagesInArticle: '3 Images (+3 Credits)',
    photoStyle: 'Photographic'
  });

  const handleGenerateTitles = async () => {
    if (!topic.trim()) return;
    
    setIsGeneratingTitles(true);
    
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Generate 5 compelling article titles about "${topic}" in the ${config.niche} niche. 
      Style: ${config.articleStyle}
      Target audience: People interested in ${config.niche}
      
      Requirements:
      - Make titles engaging and click-worthy
      - Include keywords related to ${topic}
      - Vary the title formats (how-to, lists, guides, etc.)
      - Keep titles under 60 characters when possible
      
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
      title: title.trim()
    }));
    
    setArticleQueue(prev => [...prev, ...newTitles]);
    setCustomTitles('');
  };

  const handleRemoveFromQueue = (id: string) => {
    setArticleQueue(prev => prev.filter(item => item.id !== id));
  };

  const calculateCredits = () => {
    let creditsPerArticle = 1; // Base cost
    
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
      
      for (const article of articleQueue) {
        try {
          const prompt = `Write a comprehensive ${config.articleStyle.toLowerCase()} article about: "${article.title}"

          Requirements:
          - Niche: ${config.niche}
          - Writing style: ${config.articleStyle}
          - Point of view: ${config.pointOfView}
          - Target word count: ~${wordTarget} words
          - Include proper headings (H2, H3)
          - Make it SEO-friendly with natural keyword usage
          - Write engaging introduction and conclusion
          - Include practical tips and actionable advice
          - Use ${config.pointOfView} perspective throughout
          
          Structure the article with:
          1. Engaging introduction
          2. Multiple main sections with H2 headings
          3. Subsections with H3 headings where appropriate
          4. Practical examples and tips
          5. Strong conclusion with key takeaways
          
          Write in ${config.articleStyle.toLowerCase()} tone and make it valuable for readers interested in ${config.niche}.`;

          const result = await model.generateContent(prompt);
          const content = result.response.text();
          const wordCount = content.split(/\s+/).length;
          
          generatedArticles.push({
            id: article.id,
            title: article.title,
            content: content,
            wordCount: wordCount,
            generatedAt: new Date()
          });
          
          // Small delay between generations to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate article for "${article.title}":`, error);
        }
      }
      
      setGeneratedContent(prev => [...generatedArticles, ...prev]);
      setArticleQueue([]);
      
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
    const file = new Blob([article.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          Generate hundreds of high-quality, SEO-optimized articles powered by AI. From title 
          generation to final content, automate your entire writing workflow.
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-6">
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
                  disabled={isGeneratingTitles || !topic.trim()}
                  className="mt-3 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isGeneratingTitles ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Titles
                    </>
                  )}
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
                disabled={articleQueue.length === 0 || isGeneratingContent}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
                  Add article titles to the queue to start generating content.
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

        {/* Generated Content Section */}
        {generatedContent.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Articles ({generatedContent.length})</h2>
            
            <div className="space-y-4">
              {generatedContent.map((article) => (
                <div key={article.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-green-400">{article.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{article.wordCount} words</span>
                      <span>•</span>
                      <span>{article.generatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setSelectedContent(selectedContent?.id === article.id ? null : article)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      {selectedContent?.id === article.id ? 'Hide' : 'View'} Content
                    </button>
                    <button
                      onClick={() => handleCopyContent(article.content)}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => handleDownloadContent(article)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                  
                  {selectedContent?.id === article.id && (
                    <div className="bg-slate-800 p-4 rounded-lg mt-3">
                      <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono max-h-96 overflow-y-auto">
                        {article.content}
                      </pre>
                    </div>
                  )}
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
