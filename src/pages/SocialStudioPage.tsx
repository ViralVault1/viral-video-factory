import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface VideoIdea {
  title: string;
  hook: string;
  angle: string;
}

export const SocialStudioPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<VideoIdea[]>([]);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic to generate ideas.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 5 viral video concept ideas about "${topic}". For each idea, provide:
1. A compelling video title/hook
2. The emotional angle or storytelling approach
3. Why this would resonate with viewers

Format as JSON array with objects containing: title, hook, angle`,
          type: 'video-ideas'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      
      // Parse the AI response
      let ideas: VideoIdea[];
      try {
        const jsonMatch = data.content?.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          ideas = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback parsing if not proper JSON
          ideas = parseIdeasFromText(data.content || data);
        }
      } catch {
        ideas = parseIdeasFromText(data.content || data);
      }

      setGeneratedIdeas(ideas);
      toast.success(`Generated ${ideas.length} viral video concepts!`);
      
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseIdeasFromText = (text: string): VideoIdea[] => {
    // Fallback parser if AI doesn't return proper JSON
    const lines = text.split('\n').filter(line => line.trim());
    const ideas: VideoIdea[] = [];
    
    for (let i = 0; i < Math.min(5, Math.floor(lines.length / 3)); i++) {
      ideas.push({
        title: lines[i * 3] || `Idea ${i + 1}`,
        hook: lines[i * 3 + 1] || 'Engaging hook',
        angle: lines[i * 3 + 2] || 'Compelling angle'
      });
    }
    
    return ideas.length > 0 ? ideas : [{
      title: `Viral content about ${topic}`,
      hook: 'Engaging storytelling approach',
      angle: 'Relatable and shareable content'
    }];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateIdeas();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h1 className="text-4xl font-bold">Social Studio</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Your quick-start ideation engine. Enter a topic and get viral video concepts with hooks and angles.
            </p>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. Sustainable home living, Retro gaming..."
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              disabled={isGenerating}
            />
            
            <button
              onClick={handleGenerateIdeas}
              disabled={isGenerating || !topic.trim()}
              className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg inline-flex items-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Ideas...
                </>
              ) : (
                '✨ Generate Ideas'
              )}
            </button>
          </div>

          {generatedIdeas.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
              {/* Viral Angles */}
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-xl font-semibold mb-4">Viral Angles</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Use these high-level formats to structure your content and keep your audience engaged.
                </p>
                <div className="space-y-3">
                  {generatedIdeas.slice(0, 3).map((idea, index) => (
                    <div key={index} className="flex items-start bg-gray-700 p-3 rounded">
                      <span className="text-green-500 mr-3">✦</span>
                      <div>
                        <p className="text-white font-medium">{idea.angle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Use Concepts */}
              <div className="bg-gray-800 rounded-lg p-6 text-left">
                <h3 className="text-xl font-semibold mb-4">Ready-to-Use Video Concepts</h3>
                <div className="space-y-4">
                  {generatedIdeas.map((idea, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">{idea.title}</h4>
                      <p className="text-gray-400 text-sm italic mb-3">"{idea.hook}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {generatedIdeas.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setGeneratedIdeas([])}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Generate New Ideas
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="/image-generator" className="text-gray-400 hover:text-white transition-colors">AI Image Generator</a></li>
                <li><a href="/product-ad-studio" className="text-gray-400 hover:text-white transition-colors">Product Ad Studio</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
