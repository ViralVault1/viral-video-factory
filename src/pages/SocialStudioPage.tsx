import React, { useState } from 'react';

export const SocialStudioPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic to generate ideas.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const ideas = [
        `"5 ${topic} Hacks That Will Change Your Life"`,
        `"The Truth About ${topic} Nobody Talks About"`,
        `"I Tried ${topic} for 30 Days - Here's What Happened"`,
        `"${topic}: Beginner vs Expert Comparison"`,
        `"Why Everyone is Wrong About ${topic}"`
      ];
      
      setGeneratedIdeas(ideas);
      setIsGenerating(false);
      alert(`Generated ${ideas.length} viral video ideas for "${topic}"!`);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateIdeas();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h1 className="text-4xl font-bold">Social Studio</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Your quick-start ideation engine. Enter a topic and get a list of viral video concepts ready to be created.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g. Sustainable home living, Retro gaming..."
                className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                disabled={isGenerating}
              />
            </div>
            
            <button
              onClick={handleGenerateIdeas}
              disabled={isGenerating || !topic.trim()}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Ideas...
                </div>
              ) : (
                '✨ Generate Ideas'
              )}
            </button>
          </div>

          {/* Generated Ideas */}
          {generatedIdeas.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 text-left">
              <h3 className="text-xl font-semibold mb-4 text-center">Generated Video Ideas</h3>
              <div className="space-y-3">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">•</span>
                    <span className="text-gray-300">{idea}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setGeneratedIdeas([])}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Generate New Ideas
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
