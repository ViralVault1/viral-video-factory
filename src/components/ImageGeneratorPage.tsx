import React, { useState } from 'react';

interface ImageGeneratorPageProps {
  onNavigate: (page: string) => void;
}

export const ImageGeneratorPage: React.FC<ImageGeneratorPageProps> = ({ onNavigate }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    { id: 'realistic', name: 'Realistic', description: 'Photo-realistic images' },
    { id: 'artistic', name: 'Artistic', description: 'Artistic and creative style' },
    { id: 'cartoon', name: 'Cartoon', description: 'Cartoon-style illustrations' },
    { id: 'abstract', name: 'Abstract', description: 'Abstract and conceptual' }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">AI Image Generator</h1>
          <p className="text-gray-400">Create stunning images from text descriptions using advanced AI</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Image Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Describe your image</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    rows={4}
                    placeholder="A futuristic city skyline at sunset with flying cars..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map((styleOption) => (
                      <label key={styleOption.id} className="flex items-center p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                        <input
                          type="radio"
                          name="style"
                          value={styleOption.id}
                          checked={style === styleOption.id}
                          onChange={(e) => setStyle(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="text-white font-medium">{styleOption.name}</div>
                          <div className="text-gray-400 text-sm">{styleOption.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="1:1">Square (1:1)</option>
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="9:16">Portrait (9:16)</option>
                    <option value="4:3">Standard (4:3)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Generated Image</h2>
            <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center mb-4">
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                  <p className="text-gray-400">Creating your image...</p>
                </div>
              ) : (
                <p className="text-gray-400">Your generated image will appear here</p>
              )}
            </div>
            
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                Download HD
              </button>
              <button 
                onClick={() => onNavigate('product-ad-studio')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Use in Ad Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
