import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Trash2, Save, Play, Download, Copy, Check } from 'lucide-react';

interface AdContent {
  headline: string;
  script: string;
  callToAction: string;
  targetAudience: string;
  keyFeatures: string[];
}

interface VideoResult {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  createdAt: Date;
}

const ProductAdStudioPage: React.FC = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Handle file upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProductImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please upload an image file');
      }
    }
  }, []);

  // Generate ad content
  const generateAdContent = useCallback(async () => {
    if (!productImage) {
      alert('Please upload a product image first!');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAdContent: AdContent = {
        headline: "Transform Your Lifestyle with This Amazing Product!",
        script: "Are you tired of the same old routine? Discover the revolutionary solution that's changing lives everywhere. Our premium product combines cutting-edge technology with unbeatable quality to deliver results you can see and feel. Don't wait - join thousands of satisfied customers who've already made the switch.",
        callToAction: "Order Now - Limited Time 50% Off!",
        targetAudience: "Health-conscious adults aged 25-45 looking for premium lifestyle products",
        keyFeatures: [
          "Premium quality materials",
          "30-day money-back guarantee", 
          "Free shipping worldwide",
          "Award-winning design",
          "Eco-friendly packaging"
        ]
      };
      
      setAdContent(mockAdContent);
    } catch (error) {
      console.error('Error generating ad content:', error);
      alert('Failed to generate ad content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [productImage]);

  // Generate video
  const generateVideo = useCallback(async () => {
    if (!adContent) {
      alert('Please generate ad content first!');
      return;
    }

    setIsGeneratingVideo(true);
    try {
      // Simulate video generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newVideo: VideoResult = {
        id: `video_${Date.now()}`,
        url: `https://example.com/videos/ad_${Date.now()}.mp4`,
        thumbnail: productImage || '/api/placeholder/300/200',
        title: adContent.headline.substring(0, 50) + '...',
        createdAt: new Date()
      };
      
      setVideos(prev => [newVideo, ...prev]);
      alert('Video generated successfully!');
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [adContent, productImage]);

  // Copy text to clipboard
  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      alert('Failed to copy text');
    }
  }, []);

  // Download video
  const downloadVideo = useCallback((video: VideoResult) => {
    // In a real app, this would trigger an actual download
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Clear all data
  const clearAll = useCallback(() => {
    setProductImage(null);
    setAdContent(null);
    setVideos([]);
    setCopiedText(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎬 Product Ad Studio
          </h1>
          <p className="text-gray-300 text-lg">
            Upload your product image and generate compelling ad content + videos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Content Generation */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">📸 Product Image</h2>
              
              {!productImage ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-white/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-white/70 mb-4" />
                    <p className="text-white/70 text-lg mb-2">Upload Product Image</p>
                    <p className="text-white/50 text-sm">PNG, JPG, or GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={productImage}
                    alt="Product"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => setProductImage(null)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Generate Ad Content */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">✨ AI Ad Generation</h2>
              
              <button
                onClick={generateAdContent}
                disabled={!productImage || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating AI Content...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Generate Ad Content
                  </>
                )}
              </button>
            </div>

            {/* Generate Video */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">🎥 Video Generation</h2>
              
              <button
                onClick={generateVideo}
                disabled={!adContent || isGeneratingVideo}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isGeneratingVideo ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate Video (10s)
                  </>
                )}
              </button>
            </div>

            {/* Clear All */}
            <button
              onClick={clearAll}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          </div>

          {/* Right Column - Generated Content */}
          <div className="space-y-6">
            {/* Ad Content Display */}
            {adContent && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">📝 Generated Ad Content</h2>
                
                <div className="space-y-4">
                  {/* Headline */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/80">Headline</label>
                      <button
                        onClick={() => copyToClipboard(adContent.headline, 'headline')}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {copiedText === 'headline' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-white bg-white/5 p-3 rounded-lg">{adContent.headline}</p>
                  </div>

                  {/* Script */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/80">Script</label>
                      <button
                        onClick={() => copyToClipboard(adContent.script, 'script')}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {copiedText === 'script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-white bg-white/5 p-3 rounded-lg text-sm leading-relaxed">{adContent.script}</p>
                  </div>

                  {/* Call to Action */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/80">Call to Action</label>
                      <button
                        onClick={() => copyToClipboard(adContent.callToAction, 'cta')}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {copiedText === 'cta' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-white bg-white/5 p-3 rounded-lg font-semibold">{adContent.callToAction}</p>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="text-sm font-medium text-white/80 block mb-2">Target Audience</label>
                    <p className="text-white/80 bg-white/5 p-3 rounded-lg text-sm">{adContent.targetAudience}</p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <label className="text-sm font-medium text-white/80 block mb-2">Key Features</label>
                    <ul className="text-white/80 bg-white/5 p-3 rounded-lg text-sm space-y-1">
                      {adContent.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Videos */}
            {videos.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">🎬 Generated Videos</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-white/5 rounded-lg p-4">
                      <div className="aspect-video bg-gray-800 rounded-lg mb-3 relative overflow-hidden">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/80" />
                        </div>
                      </div>
                      <h3 className="text-white font-medium text-sm mb-2">{video.title}</h3>
                      <p className="text-white/60 text-xs mb-3">
                        {video.createdAt.toLocaleString()}
                      </p>
                      <button
                        onClick={() => downloadVideo(video)}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdStudioPage;
