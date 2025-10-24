import React, { useState, useCallback } from 'react';
import { Upload, Trash2, Save, Play, Download, Copy, Check } from 'lucide-react';
import { aiAgentsRouter, createAgentRequest } from '../services/aiAgentsService';

interface AdContent {
  headline: string;
  script: string;
  callToAction: string;
  targetAudience: string;
  keyFeatures: string[];
}

interface VideoResult {
  id: string;
  videoUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  script: string;
}

const ProductAdStudioPage: React.FC = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<VideoResult[]>([]);
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

  // Generate ad content using Manus AI Agents
  const generateAdContent = useCallback(async () => {
    if (!productImage) {
      alert('Please upload a product image first!');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Using Manus AI Agents for product analysis...');
      
      // Create agent request for content strategy
      const agentRequest = createAgentRequest(
        'content-strategy',
        'analyze-product-image',
        {
          imageData: productImage,
          requestType: 'product-ad-analysis',
          outputFormat: 'social-media-ad',
          targetLength: '5-seconds',
          platforms: ['instagram', 'tiktok', 'facebook']
        },
        'user-123' // TODO: Replace with actual user ID from auth context
      );

      // Process request through AI agents router
      const agentResponse = await aiAgentsRouter.processRequest(agentRequest);
      
      console.log('Manus AI Agent response:', agentResponse);
      
      if (agentResponse.success && agentResponse.data) {
        const analysisData = agentResponse.data;
        
        setAdContent({
          headline: analysisData.productName || analysisData.headline || "Premium Product",
          script: analysisData.videoScript || analysisData.script || generateDefaultScript(),
          callToAction: analysisData.callToAction || "Shop Now - Limited Time Offer!",
          targetAudience: analysisData.targetAudience || "Quality-conscious consumers",
          keyFeatures: analysisData.keyFeatures || [
            "Premium quality materials",
            "Professional design", 
            "Excellent value",
            "Customer satisfaction guaranteed"
          ]
        });
        
        console.log('Successfully processed with Manus AI Agents');
      } else {
        throw new Error('Invalid response from AI agents');
      }
      
    } catch (error) {
      console.error('Manus AI Agents error:', error);
      
      // Fallback to basic analysis if agents fail
      console.log('Falling back to basic analysis...');
      const fallbackContent = await generateFallbackContent();
      setAdContent(fallbackContent);
      
    } finally {
      setIsGenerating(false);
    }
  }, [productImage]);

  // Fallback content generation if AI agents are unavailable
  const generateFallbackContent = async (): Promise<AdContent> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      headline: "Premium Quality Product",
      script: "[0-1s] Product reveal with professional lighting [1-3s] Close-up showcasing premium materials [3-4s] Lifestyle demonstration [4-5s] Strong call-to-action",
      callToAction: "Shop Now - Limited Time Offer!",
      targetAudience: "Quality-conscious consumers who value premium products",
      keyFeatures: [
        "Premium quality construction",
        "Professional design",
        "Excellent durability",
        "Great value proposition"
      ]
    };
  };

  // Default script generator
  const generateDefaultScript = (): string => {
    return "[0-1s] Eye-catching product reveal [1-3s] Key features highlight [3-4s] Benefits demonstration [4-5s] Clear call-to-action";
  };

  // Generate video using AI agents for script optimization
  const generateVideo = useCallback(async () => {
    if (!adContent) {
      alert('Please generate ad content first!');
      return;
    }

    setIsGeneratingVideo(true);
    
    try {
      console.log('Optimizing script with AI agents before video generation...');
      
      // Use script-optimization agent to enhance the content
      const optimizationRequest = createAgentRequest(
        'script-optimization',
        'optimize-for-video',
        {
          script: adContent.script,
          headline: adContent.headline,
          targetAudience: adContent.targetAudience,
          platform: 'social-media',
          duration: '5-seconds'
        },
        'user-123' // TODO: Replace with actual user ID
      );

      let optimizedContent = adContent;
      
      try {
        const optimizationResponse = await aiAgentsRouter.processRequest(optimizationRequest);
        if (optimizationResponse.success && optimizationResponse.data) {
          optimizedContent = {
            ...adContent,
            script: optimizationResponse.data.optimizedScript || adContent.script
          };
          console.log('Script optimized by AI agents');
        }
      } catch (optimizationError) {
        console.log('Script optimization failed, using original content:', optimizationError);
      }

      // Generate video with optimized content
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Product Ad: ${optimizedContent.headline}. ${optimizedContent.script}`,
          visualPrompt: `Professional product advertisement with engaging visuals, social media optimized`
        })
      });

      const result = await response.json();
      console.log('Video API response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate video');
      }
      
      if (result.success && result.videoUrl) {
        const newVideo: VideoResult = {
          id: `video_${Date.now()}`,
          videoUrl: result.videoUrl,
          status: 'completed',
          createdAt: new Date().toISOString(),
          script: `${optimizedContent.headline}: ${optimizedContent.script}`
        };
        setGeneratedVideos(prev => [newVideo, ...prev]);
        alert('Video generated successfully with AI optimization!');
      } else {
        throw new Error('No video URL returned');
      }
      
    } catch (error) {
      console.error('Video generation failed:', error);
      alert(`Failed to generate video: ${error.message}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [adContent]);

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

  // Clear all data
  const clearAll = useCallback(() => {
    setProductImage(null);
    setAdContent(null);
    setGeneratedVideos([]);
    setCopiedText(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Product Ad Studio
          </h1>
          <p className="text-gray-300 text-lg">
            Upload your product image and generate compelling ad content + videos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Content Generation */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Product Image</h2>
              
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
            <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">AI Ad Generation</h2>
              
              <button
                onClick={generateAdContent}
                disabled={!productImage || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Analyzing with Gemini AI...
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
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Social Media Video Generation</h2>
              
              <button
                onClick={generateVideo}
                disabled={!adContent || isGeneratingVideo}
                className="w-full px-6 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingVideo ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Social Ad...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Generate 5s Social Media Ad
                  </>
                )}
              </button>
              <p className="text-center text-sm mt-2 text-white text-opacity-80">
                Quick 5-second ads for Instagram, TikTok & Facebook
              </p>
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
              <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Generated Ad Content</h2>
                
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
          </div>
        </div>

        {/* Generated Videos Section */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Generated Product Ad Videos</h2>
            <div className="text-sm text-gray-400">
              {generatedVideos.length} videos generated
            </div>
          </div>
          
          {generatedVideos.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No product ad videos generated yet</h3>
              <p className="text-gray-500">
                Create your first product ad video using the generator above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="relative">
                    {video.videoUrl ? (
                      <video 
                        src={video.videoUrl} 
                        className="w-full h-48 object-cover"
                        controls
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded">
                        {video.status}
                      </span>
                    </div>
                    <p className="text-white text-sm mb-3 line-clamp-2">
                      {video.script.substring(0, 100)}...
                    </p>
                    {video.videoUrl && (
                      <button 
                        onClick={() => window.open(video.videoUrl, '_blank')}
                        className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download Video
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAdStudioPage;
