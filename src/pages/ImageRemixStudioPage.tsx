// src/pages/ImageRemixStudioPage.js (Export Fixed)
import React, { useState, useRef } from 'react';
import { 
  Image, 
  Wand2, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Upload, 
  Palette, 
  Zap, 
  Copy,
  X,
  Eye,
  Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Simple placeholder components to avoid import errors
const LLMStatus = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
    <Zap className="h-4 w-4 text-purple-600" />
    <span className="text-sm font-medium">AI Router</span>
    <span className="text-xs text-gray-600">Online</span>
  </div>
);

const useLLM = () => ({
  generateContent: async (prompt) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      content: `Generated content for: ${prompt}`,
      provider: 'gemini',
      cost: 0.001
    };
  },
  isLoading: false,
  error: null,
  costEstimate: 0.001
});

const ImageRemixStudioPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [remixConfig, setRemixConfig] = useState({
    style: 'photorealistic',
    intensity: 50,
    prompt: '',
    negativePrompt: '',
    aspectRatio: '1:1'
  });
  const [remixedImages, setRemixedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef(null);
  
  const { generateContent, isLoading, error, costEstimate } = useLLM();

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file,
          url: e.target.result,
          name: file.name
        });
        setActiveTab('remix');
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate remix prompt
  const generateRemixPrompt = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to remix');
      return;
    }

    try {
      const promptGenerationPrompt = `Create an optimized image remix prompt for the style "${remixConfig.style}". 
      Current prompt: "${remixConfig.prompt}"
      
      Generate a detailed, creative prompt that will transform the image while maintaining its core elements. 
      Focus on ${remixConfig.style} aesthetics.
      
      Return only the enhanced prompt, no explanations.`;

      const result = await generateContent(promptGenerationPrompt);

      setRemixConfig(prev => ({
        ...prev,
        prompt: result.content
      }));

      toast.success('AI-enhanced prompt generated!');
    } catch (error) {
      console.error('Prompt generation failed:', error);
      toast.error('Failed to generate prompt');
    }
  };

  // Process image remix
  const processRemix = async () => {
    if (!selectedImage || !remixConfig.prompt.trim()) {
      toast.error('Please upload an image and provide a remix prompt');
      return;
    }

    setIsProcessing(true);
    try {
      const remixPrompt = `Transform this image: ${remixConfig.prompt}
      Style: ${remixConfig.style}
      Intensity: ${remixConfig.intensity}%
      Negative prompt: ${remixConfig.negativePrompt}
      Aspect ratio: ${remixConfig.aspectRatio}`;

      const result = await generateContent(remixPrompt);

      const newRemix = {
        id: Date.now(),
        originalImage: selectedImage.url,
        remixedImage: selectedImage.url, // Placeholder
        prompt: remixConfig.prompt,
        style: remixConfig.style,
        timestamp: new Date().toISOString(),
        analysis: result.content
      };

      setRemixedImages(prev => [newRemix, ...prev]);
      toast.success('Image remix completed!');
    } catch (error) {
      console.error('Remix processing failed:', error);
      toast.error('Failed to process remix');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate batch variations
  const generateBatchVariations = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    const styles = ['photorealistic', 'artistic', 'cartoon', 'cyberpunk', 'vintage'];
    setIsProcessing(true);

    try {
      for (const style of styles) {
        const stylePrompt = `Transform this image in ${style} style. Maintain the core composition while applying ${style} aesthetics and characteristics.`;
        
        const result = await generateContent(stylePrompt);

        const variation = {
          id: Date.now() + Math.random(),
          originalImage: selectedImage.url,
          remixedImage: selectedImage.url, // Placeholder
          prompt: stylePrompt,
          style: style,
          timestamp: new Date().toISOString(),
          analysis: result.content
        };

        setRemixedImages(prev => [variation, ...prev]);
      }

      toast.success(`Generated ${styles.length} style variations!`);
    } catch (error) {
      console.error('Batch variation failed:', error);
      toast.error('Failed to generate variations');
    } finally {
      setIsProcessing(false);
    }
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

  // Upload Tab
  const UploadTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-purple-400 cursor-pointer transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Image to Remix</h3>
          <p className="text-gray-600">Click to select or drag and drop</p>
          <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, WebP up to 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {selectedImage && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Selected Image</h3>
          <div className="flex items-center gap-4">
            <img 
              src={selectedImage.url} 
              alt="Selected" 
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium">{selectedImage.name}</p>
              <p className="text-sm text-gray-600">Ready for remixing</p>
              <button
                onClick={() => setActiveTab('remix')}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Start Remixing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Remix Tab
  const RemixTab = () => (
    <div className="space-y-6">
      {!selectedImage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Please upload an image first to start remixing.</p>
          <button
            onClick={() => setActiveTab('upload')}
            className="mt-2 text-yellow-600 hover:text-yellow-800 font-medium"
          >
            Go to Upload →
          </button>
        </div>
      )}

      {selectedImage && (
        <>
          {/* Original Image Preview */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Original Image</h3>
            <img 
              src={selectedImage.url} 
              alt="Original" 
              className="max-w-full h-48 object-contain rounded-lg border"
            />
          </div>

          {/* Remix Configuration */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">Remix Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={remixConfig.style}
                  onChange={(e) => setRemixConfig(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="photorealistic">Photorealistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="vintage">Vintage</option>
                  <option value="oil-painting">Oil Painting</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="digital-art">Digital Art</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensity: {remixConfig.intensity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={remixConfig.intensity}
                  onChange={(e) => setRemixConfig(prev => ({ ...prev, intensity: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remix Prompt</label>
              <div className="flex gap-2">
                <textarea
                  value={remixConfig.prompt}
                  onChange={(e) => setRemixConfig(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe how you want to transform the image..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="3"
                />
                <button
                  onClick={generateRemixPrompt}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Negative Prompt (Optional)</label>
              <input
                type="text"
                value={remixConfig.negativePrompt}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, negativePrompt: e.target.value }))}
                placeholder="What to avoid in the remix..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={processRemix}
                disabled={isProcessing || !remixConfig.prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : 'Generate Remix'}
              </button>

              <button
                onClick={generateBatchVariations}
                disabled={isProcessing}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Results Tab
  const ResultsTab = () => (
    <div className="space-y-6">
      {remixedImages.length === 0 ? (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Remixes Yet</h3>
          <p className="text-gray-600">Start by uploading an image and creating your first remix.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remixedImages.map((remix) => (
            <div key={remix.id} className="bg-white rounded-lg border overflow-hidden">
              {/* Image Preview */}
              <div className="relative">
                <img 
                  src={remix.remixedImage} 
                  alt="Remixed" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {remix.style}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-sm">{remix.style}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(remix.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {remix.prompt}
                </p>

                {remix.analysis && (
                  <div className="bg-gray-50 rounded p-2 mb-3">
                    <p className="text-xs text-gray-600">{remix.analysis}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(remix.prompt)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <Copy className="h-3 w-3" />
                    Copy Prompt
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Palette className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Image Remix Studio</h1>
                <p className="text-sm text-gray-600">Transform images with AI-powered remixing</p>
              </div>
            </div>
            <LLMStatus />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'upload', label: 'Upload Image', icon: Upload },
              { id: 'remix', label: 'Remix Studio', icon: Wand2 },
              { id: 'results', label: 'Results', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'results' && remixedImages.length > 0 && (
                    <span className="bg-purple-100 text-purple-600 text-xs rounded-full px-2 py-1">
                      {remixedImages.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'upload' && <UploadTab />}
          {activeTab === 'remix' && <RemixTab />}
          {activeTab === 'results' && <ResultsTab />}
        </div>

        {/* Cost Estimation */}
        {costEstimate > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Estimated cost: ${costEstimate.toFixed(4)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageRemixStudioPage;
