import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Trash2, Save, Play, Download } from 'lucide-react';

interface AdContent {
  headline: string;
  script: string;
  callToAction: string;
  targetAudience: string;
  keyFeatures: string[];
}

interface VideoResult {
  id: string;
  videoUrl: string;
  status: 'completed';
  createdAt: string;
}

export const ProductAdStudioPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [error, setError] = useState('');
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<VideoResult[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    } else {
      setError('Please upload a valid image file (JPG, PNG, GIF, WebP)');
    }
  }, []);

  const handleFileUpload = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setUploadedImage(file);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAdContent(null);
    setError('');
  };

  const generateAd = async () => {
    if (!uploadedImage) {
      setError('Please upload a product image first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/generate-product-ad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: base64,
            mimeType: uploadedImage.type
          })
        });

        if (!response.ok) {
          throw new Error('Failed to generate ad');
        }

        const data = await response.json();
        const jsonMatch = data.content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Could not parse AI response');
        }

        const content: AdContent = JSON.parse(jsonMatch[0]);
        setAdContent(content);
        alert('Ad content generated successfully!');
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read image');
      };
      
      reader.readAsDataURL(uploadedImage);
    } catch (error: any) {
      console.error('Ad generation error:', error);
      setError(error.message || 'Failed to generate ad. Please try again.');
      alert('Failed to generate ad content');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateVideo = async () => {
    if (!adContent) {
      alert('Please generate ad content first!');
      return;
    }

    setIsGeneratingVideo(true);

    try {
      const videoPrompt = `${adContent.headline}. ${adContent.script}. ${adContent.callToAction}`;

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt
        })
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate video');
      }
      
      if (result.success && result.videoUrl) {
        const newVideo: VideoResult = {
          id: `video_${Date.now()}`,
          videoUrl: result.videoUrl,
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        setGeneratedVideos(prev => [newVideo, ...prev]);
        alert('✅ Product ad video generated successfully!');
      } else {
        throw new Error('No video URL returned');
      }
      
    } catch (error) {
      console.error('Video generation failed:', error);
      alert(`❌ Failed: ${error}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateVideo = async () => {
    if (!adContent) {
      alert('Please generate ad content first!');
      return;
    }

    setIsGeneratingVideo(true);

    try {
      const videoPrompt = `${adContent.headline}. ${adContent.script}. ${adContent.callToAction}`;

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt
        })
      });

      const result = await response.json();
      console.log('API response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate video');
      }
      
      if (result.success && result.videoUrl) {
        const newVideo: VideoResult = {
          id: `video_${Date.now()}`,
          videoUrl: result.videoUrl,
          status: 'completed',
          createdAt: new Date().toISOString()
        };
        setGeneratedVideos(prev => [newVideo, ...prev]);
        alert('✅ Product ad video generated successfully!');
      } else {
        throw new Error('No video URL returned');
      }
      
    } catch (error) {
      console.error('Video generation failed:', error);
      alert(`❌ Failed: ${error}`);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="text-center py-8 border-b border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Product Ad Studio</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upload your product image and let AI generate compelling ad copy instantly
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload Product Image</h2>
              
              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragOver ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 mb-2">Drag & drop product image</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <p className="text-xs text-gray-600 mt-2">JPG, PNG, GIF, WebP (max 10MB)</p>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Product" 
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
                  {error}
                </div>
              )}
              
              {imagePreview && !adContent && (
                <button
                  onClick={generateAd}
                  disabled={isGenerating}
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating Ad Content...
                    </>
                  ) : (
                    '✨ Generate Ad Content'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Generated Content Section */}
          <div className="space-y-6">
            {adContent ? (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Generated Ad Content</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Headline</h3>
                    <p className="text-lg font-semibold text-white">{adContent.headline}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Ad Script</h3>
                    <p className="text-gray-300">{adContent.script}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Call to Action</h3>
                    <p className="text-green-400 font-semibold">{adContent.callToAction}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">Target Audience</h3>
                    <p className="text-gray-300">{adContent.targetAudience}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Key Features</h3>
                    <ul className="space-y-1">
                      {adContent.keyFeatures.map((feature, i) => (
                        <li key={i} className="text-gray-300 flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Headline: ${adContent.headline}\n\nScript: ${adContent.script}\n\nCTA: ${adContent.callToAction}\n\nTarget: ${adContent.targetAudience}\n\nFeatures:\n${adContent.keyFeatures.map(f => `• ${f}`).join('\n')}`
                        );
                        alert('Content copied to clipboard!');
                      }}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      📋 Copy All
                    </button>
                    <button
                      onClick={generateVideo}
                      disabled={isGeneratingVideo}
                      className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          🎬 Generate Video
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No content generated yet</h3>
                  <p className="text-gray-500">
                    Upload a product image to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generated Videos Section */}
        {generatedVideos.length > 0 && (
          <div className="mt-12 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">🎥 Your Product Ad Videos</h2>
              <div className="text-sm text-gray-400">
                {generatedVideos.length} videos generated
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="relative">
                    <video 
                      src={video.videoUrl} 
                      className="w-full h-48 object-cover"
                      controls
                    />
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
                    <button 
                      onClick={() => window.open(video.videoUrl, '_blank')}
                      className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAdStudioPage;
