import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface AdContent {
  headline: string;
  script: string;
  callToAction: string;
  targetAudience: string;
  keyFeatures: string[];
}

interface SavedAd {
  id: string;
  product_image_url: string;
  headline: string;
  script: string;
  call_to_action: string;
  target_audience: string;
  key_features: string[];
  created_at: string;
}

export const ProductAdStudioPage: React.FC = () => {
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [savedAds, setSavedAds] = useState<SavedAd[]>([]);
  const [loadingSavedAds, setLoadingSavedAds] = useState(true);

  // Load saved ads on mount
  useEffect(() => {
    if (user) {
      loadSavedAds();
    }
  }, [user]);

  const loadSavedAds = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('product_ads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedAds(data || []);
    } catch (error) {
      console.error('Error loading saved ads:', error);
    } finally {
      setLoadingSavedAds(false);
    }
  };

  const deleteSavedAd = async (id: string) => {
    try {
      const { error } = await supabase
        .from('product_ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSavedAds(savedAds.filter(ad => ad.id !== id));
      toast.success('Ad campaign deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete ad campaign');
    }
  };

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
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setUploadedImage(file);
      setIsUploading(false);
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
        toast.success('Ad content generated successfully!');
        setIsGenerating(false);
      };
      
      reader.onerror = () => {
        setIsGenerating(false);
        throw new Error('Failed to read image');
      };
      
      reader.readAsDataURL(uploadedImage);
    } catch (error: any) {
      console.error('Ad generation error:', error);
      setError(error.message || 'Failed to generate ad. Please try again.');
      toast.error('Failed to generate ad content');
      setIsGenerating(false);
    }
  };

  const saveAd = async () => {
    if (!adContent || !user) {
      toast.error('Please log in to save ad campaigns');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('product_ads')
        .insert({
          user_id: user.id,
          product_image_url: imagePreview,
          headline: adContent.headline,
          script: adContent.script,
          call_to_action: adContent.callToAction,
          target_audience: adContent.targetAudience,
          key_features: adContent.keyFeatures
        });

      if (error) throw error;
      toast.success('Ad campaign saved successfully!');
      loadSavedAds(); // Refresh the saved ads list
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save ad campaign');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Product Ad Studio</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform a simple product image into a complete, ready-to-launch video ad campaign. 
            Generate scripts, visuals, and a compelling call to action in minutes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          {!uploadedImage ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ${
                isDragOver 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Step 1: Upload Your Product Image</h3>
                <p className="text-gray-400 mb-4">
                  Drag & drop a product photo here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, GIF, WebP (Max 10MB)
                </p>
              </div>

              {isUploading && (
                <div className="mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                  <p className="text-sm text-gray-400 mt-2">Uploading...</p>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleBrowseClick}
                disabled={isUploading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Browse Files
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Uploaded Product Image</h3>
                  <button
                    onClick={removeImage}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="mb-6">
                  <img
                    src={imagePreview!}
                    alt="Product preview"
                    className="max-w-full h-64 object-contain mx-auto rounded-lg"
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={generateAd}
                    disabled={isGenerating}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Product...
                      </span>
                    ) : (
                      'Generate Product Ad'
                    )}
                  </button>
                </div>
              </div>

              {adContent && (
                <div className="bg-gray-800 rounded-lg p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-green-400">Generated Ad Campaign</h2>
                    <button
                      onClick={saveAd}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      {isSaving ? 'Saving...' : 'Save Campaign'}
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Headline</h3>
                    <p className="text-xl font-bold text-white">{adContent.headline}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">30-Second Video Script</h3>
                    <p className="text-gray-200 whitespace-pre-line">{adContent.script}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Call to Action</h3>
                    <p className="text-lg text-green-400 font-semibold">{adContent.callToAction}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Target Audience</h3>
                    <p className="text-gray-200">{adContent.targetAudience}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Key Features to Highlight</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-200">
                      {adContent.keyFeatures.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* My Saved Ads Section */}
        {user && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">My Saved Ad Campaigns</h2>
            
            {loadingSavedAds ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading saved campaigns...</p>
              </div>
            ) : savedAds.length === 0 ? (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-lg">No saved ad campaigns yet.</p>
                <p className="text-gray-500 text-sm mt-2">Generate and save your first ad campaign above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedAds.map((ad) => (
                  <div key={ad.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                    {ad.product_image_url && (
                      <img
                        src={ad.product_image_url}
                        alt="Product"
                        className="w-full h-40 object-contain mb-4 rounded-lg bg-gray-700"
                      />
                    )}
                    
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{ad.headline}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(ad.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{ad.script}</p>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setImagePreview(ad.product_image_url);
                          setAdContent({
                            headline: ad.headline,
                            script: ad.script,
                            callToAction: ad.call_to_action,
                            targetAudience: ad.target_audience,
                            keyFeatures: ad.key_features
                          });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        View Full
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this ad campaign?')) {
                            deleteSavedAd(ad.id);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Need help? Check out our{' '}
            <a href="#" className="text-green-400 hover:text-green-300 underline">
              product ad creation guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
