import React, { useState } from 'react';

export const ProductHuntPage: React.FC = () => {
  const [productHuntUrl, setProductHuntUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKit, setGeneratedKit] = useState<{
    scripts: string[];
    socialMedia: string[];
    ideas: string[];
  } | null>(null);

  const handleGenerateKit = async () => {
    if (!productHuntUrl.trim()) {
      alert('Please enter a Product Hunt URL to generate a viral kit.');
      return;
    }

    if (!productHuntUrl.includes('producthunt.com')) {
      alert('Please enter a valid Product Hunt URL.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const kit = {
        scripts: [
          "🚀 Just discovered this game-changing tool on Product Hunt!",
          "This Product Hunt launch is about to revolutionize how we work",
          "Why this Product Hunt winner deserves your attention"
        ],
        socialMedia: [
          "🔥 TRENDING: New tool just launched on @ProductHunt - this is huge!",
          "Found the next unicorn startup on Product Hunt 🦄 #ProductHunt #Startup",
          "This Product Hunt launch is going viral for all the right reasons ✨"
        ],
        ideas: [
          "Create a reaction video to the Product Hunt launch",
          "Interview the founder about their journey",
          "Compare this tool with existing alternatives",
          "Show a day-in-the-life using this product"
        ]
      };
      
      setGeneratedKit(kit);
      setIsGenerating(false);
      alert('Generated complete viral marketing kit!');
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateKit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Product Hunt Viral Kit Generator</h1>
            <p className="text-gray-400 text-lg">
              Paste your Product Hunt link to generate viral video ideas, scripts, and social media copy in seconds.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="url"
                value={productHuntUrl}
                onChange={(e) => setProductHuntUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://www.producthunt.com/posts/..."
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                disabled={isGenerating}
              />
            </div>
            
            <button
              onClick={handleGenerateKit}
              disabled={isGenerating || !productHuntUrl.trim()}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Kit...
                </div>
              ) : (
                '🚀 Generate Kit'
              )}
            </button>
          </div>

          {/* Generated Kit */}
          {generatedKit && (
            <div className="space-y-6">
              {/* Video Scripts */}
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-xl font-semibold mb-4 text-center text-green-500">📹 Video Scripts</h3>
                <div className="space-y-3">
                  {generatedKit.scripts.map((script, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 mt-1">{index + 1}.</span>
                      <span className="text-gray-300">{script}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Copy */}
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-xl font-semibold mb-4 text-center text-blue-500">📱 Social Media Copy</h3>
                <div className="space-y-3">
                  {generatedKit.socialMedia.map((copy, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1">•</span>
                      <span className="text-gray-300">{copy}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Ideas */}
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-xl font-semibold mb-4 text-center text-purple-500">💡 Content Ideas</h3>
                <div className="space-y-3">
                  {generatedKit.ideas.map((idea, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-purple-500 mr-3 mt-1">→</span>
                      <span className="text-gray-300">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setGeneratedKit(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Generate New Kit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Video Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded mr-2"></div>
              <span className="font-semibold">Viral Video Factory</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Viral Video Factory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
