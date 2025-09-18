import React, { useState } from 'react';
import { Image, Sparkles } from 'lucide-react';
import openai from '../config/openai';

interface ImageGenerationRequest {
  prompt: string;
  negativePrompt: string;
  aspectRatio: string;
  promptIdea: string;
}

export const ImageGeneratorPage: React.FC = () => {
  const [formData, setFormData] = useState<ImageGenerationRequest>({
    prompt: '',
    negativePrompt: '',
    aspectRatio: 'square',
    promptIdea: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const promptIdeas = [
    '-- Select a creative starting point --',
    'A futuristic cityscape at sunset with flying cars',
    'A magical forest with glowing mushrooms and fairy lights',
    'A steampunk robot in a Victorian workshop',
    'An underwater palace with coral gardens',
    'A space station orbiting a distant planet',
    'A cozy coffee shop in a rainy city',
    'A dragon perched on a mountain peak',
    'A cyberpunk street market at night',
    'A floating island with waterfalls',
    'A vintage library with floating books'
  ];

  const aspectRatios = [
    { id: 'square', label: 'Square (1:1)', active: true },
    { id: 'portrait', label: 'Portrait (9:16)', active: false },
    { id: 'landscape', label: 'Landscape (16:9)', active: false },
    { id: 'portrait_alt', label: 'Portrait (3:4)', active: false }
  ];

  const handlePromptIdeaChange = (value: string) => {
    if (value !== '-- Select a creative starting point --') {
      setFormData(prev => ({ ...prev, prompt: value, promptIdea: value }));
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
  try {
    // Method 1: Direct link approach (fallback)
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-image-${index + 1}.png`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: Open in new tab so user can right-click save
    window.open(imageUrl, '_blank');
    alert('Download failed. The image has opened in a new tab - you can right-click and "Save image as..." to download it.');
  }
};

  const handleGenerateImage = async () => {
    if (!formData.prompt.trim()) {
      alert('Please enter a prompt to generate an image.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: formData.prompt,
        n: 1,
        size: "1024x1024",
      });
      
      const imageUrl = response.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI');
      }
      setGeneratedImages([imageUrl, ...generatedImages.slice(0, 3)]); // Keep latest 4 images
      
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Failed to generate image. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="text-center py-8 border-b border-slate-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Describe any scene or character and watch our AI bring it to life as a high-quality 
          image. Perfect for thumbnails, social media posts, or concept art.
        </p>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Prompt Ideas */}
            <div>
              <label className="block text-sm font-medium mb-2">Prompt Ideas</label>
              <select
                value={formData.promptIdea}
                onChange={(e) => handlePromptIdeaChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                {promptIdeas.map((idea, index) => (
                  <option key={index} value={idea}>
                    {idea}
                  </option>
                ))}
              </select>
            </div>

            {/* Your Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Prompt</label>
              <textarea
                placeholder="e.g. A robot skateboarding on Mars, cinematic lighting"
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Negative Prompt <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                placeholder="e.g. text, watermarks, blurry, extra limbs"
                value={formData.negativePrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, negativePrompt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium mb-3">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-3">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setFormData(prev => ({ ...prev, aspectRatio: ratio.id }))}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.aspectRatio === ratio.id
                        ? 'bg-green-600 border-green-500 text-white'
                        : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating || !formData.prompt.trim()}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Image...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {/* Right Column - Generated Images */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Generated Images</h3>
            
            {generatedImages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No images generated yet</p>
                <p className="text-sm">Enter a prompt and click "Generate Image" to create your first image.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`AI generated artwork ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg border border-slate-600 cursor-pointer"
                      onClick={() => window.open(image, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleDownload(image, index)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Download
                      </button>
                      <button 
                        onClick={() => window.open(image, '_blank')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        View Full Size
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Generations */}
        {generatedImages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Your Recent Generations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Recent generation ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-slate-600 cursor-pointer"
                    onClick={() => window.open(image, '_blank')}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleDownload(image, index)}
                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    >
                      Download
                    </button>
                    <button 
                      onClick={() => window.open(image, '_blank')}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
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
