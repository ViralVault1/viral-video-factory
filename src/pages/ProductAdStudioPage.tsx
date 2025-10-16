import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { usageService } from '../services/usageService';

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

    if (!user) {
      toast.error('Please log in to generate product ads');
      return;
    }

    // CHECK USAGE LIMIT
    try {
      const userPlan = (user as any).plan || 'free';
      const limitCheck = await usageService.checkLimit(user.id, 'productAds', userPlan);
      
      if (!limitCheck.allowed) {
        toast.error(`You've reached your limit of ${limitCheck.limit} product ads this month.`);
        const upgrade = window.confirm(
          `Upgrade to Creator for unlimited product ads?\n\nCurrent usage: ${limitCheck.current}/${limitCheck.limit}\n\nClick OK to view pricing.`
        );
        if (upgrade) {
          window.location.href = '/pricing';
        }
        return;
      }
    } catch (error) {
      console.error('Error checking usage limit:', error);
      toast.error('Error checking usage limits');
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
        
        // INCREMENT USAGE AFTER SUCCESS
        await usageService.incrementUsage(user.id, 'productAds');
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
      loadSavedAds();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save ad campaign');
    } finally {
      setIsSaving(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-900 text-white p-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product Ad Studio</h1>
      
      {/* Upload Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
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
            <p className="text-gray-400">Drag & drop product image or click to browse</p>
          </div>
        ) : (
          <div className="relative">
            <img src={imagePreview} alt="Product" className="max-w-md mx-auto rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        )}
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
        
        {imagePreview && !adContent && (
          <button
            onClick={generateAd}
            disabled={isGenerating}
            className="mt-4 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Ad Content'}
          </button>
        )}
      </div>

      {/* Generated Ad Content */}
      {adContent && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Ad Content</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Headline:</h3>
              <p>{adContent.headline}</p>
            </div>
            <div>
              <h3 className="font-semibold">Script:</h3>
              <p>{adContent.script}</p>
            </div>
            <div>
              <h3 className="font-semibold">Call to Action:</h3>
              <p>{adContent.callToAction}</p>
            </div>
            <div>
              <h3 className="font-semibold">Target Audience:</h3>
              <p>{adContent.targetAudience}</p>
            </div>
            <div>
              <h3 className="font-semibold">Key Features:</h3>
              <ul className="list-disc list-inside">
                {adContent.keyFeatures.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={saveAd}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Campaign'}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
