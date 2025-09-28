import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ImageRemixStudioPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedTool, setSelectedTool] = useState('background');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, consumeCredits, credits } = useAuth();

  const processImageWithGemini = async (imageData: string, tool: string, prompt: string): Promise<string> => {
    const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your environment variables.');
    }

    // Convert base64 to clean format (remove data:image/jpeg;base64, prefix if present)
    const cleanImageData = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

    // Create the appropriate prompt based on the tool selected
    let editPrompt = '';
    switch (tool) {
      case 'background':
        editPrompt = `Change the background of this image to: ${prompt}. Keep the main subject unchanged.`;
        break;
      case 'style':
        editPrompt = `Apply this style to the image: ${prompt}. Transform the entire image with this style.`;
        break;
      case 'enhance':
        editPrompt = `Enhance this image: ${prompt}. Improve the quality, lighting, and details.`;
        break;
      case 'objects':
        editPrompt = `Modify objects in this image: ${prompt}. Make the requested changes to objects while preserving the overall scene.`;
        break;
      default:
        editPrompt = prompt;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`, {
        method: 'POST',
        headers: {
          'x-goog-api-key': geminiApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: editPrompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: cleanImageData
                }
              }
            ]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Extract the generated image from the response
      const candidate = data.candidates?.[0];
      if (!candidate?.content?.parts) {
        throw new Error('No image generated in response');
      }

      // Find the image part in the response
      const imagePart = candidate.content.parts.find((part: any) => part.inline_data);
      if (!imagePart?.inline_data?.data) {
        throw new Error('No image data found in response');
      }

      // Return the image as a data URL
      return `data:image/jpeg;base64,${imagePart.inline_data.data}`;

    } catch (error) {
      console.error('Gemini processing error:', error);
      throw new Error(`Failed to process image with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateEdit = async () => {
    if (!originalImage || !prompt.trim()) {
      alert('Please upload an image and enter a prompt.');
      return;
    }

    if (!user) {
      alert('Please sign in to use AI features.');
      return;
    }

    if (credits < 5) {
      alert('Insufficient credits. You need at least 5 credits to generate an edit.');
      return;
    }

    setIsGenerating(true);
    setEditedImage(null);

    try {
      // Consume credits first
      await consumeCredits('imageGeneration');
      
      // Process with Gemini - simple and reliable!
      const resultUrl = await processImageWithGemini(originalImage, selectedTool, prompt);
      setEditedImage(resultUrl);
      
      // Show success message
      alert('🎉 Image edited successfully!');
      
    } catch (error) {
      console.error('Error generating edit:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to generate edit'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.jpg';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🎨 AI Image Remix Studio</h1>
          <p className="text-xl text-gray-300">Transform your images with the power of AI</p>
          {user && (
            <div className="mt-4 text-yellow-400">
              Credits remaining: {credits}
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          {/* Tool Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Select Editing Tool</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'background', name: 'Change Background', icon: '🌄' },
                { id: 'style', name: 'Style Transfer', icon: '🎨' },
                { id: 'enhance', name: 'Enhance Image', icon: '✨' },
                { id: 'objects', name: 'Modify Objects', icon: '🔧' }
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTool === tool.id
                      ? 'border-purple-400 bg-purple-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-purple-400'
                  }`}
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <div className="text-sm font-medium">{tool.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Upload Image</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-gray-800/30"
                >
                  {originalImage ? (
                    <img src={originalImage} alt="Original" className="max-w-full max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <div>
                      <div className="text-4xl mb-4">📤</div>
                      <p className="text-gray-300">Click to upload an image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Result Area */}
              <div>
                <div className="border-2 border-gray-600 rounded-xl p-8 text-center bg-gray-800/30 min-h-[200px] flex items-center justify-center">
                  {editedImage ? (
                    <div>
                      <img src={editedImage} alt="Edited" className="max-w-full max-h-64 mx-auto rounded-lg" />
                      <button
                        onClick={downloadImage}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Download Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <div className="text-4xl mb-4">🖼️</div>
                      <p>Your edited image will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Enter Your Prompt</h3>
            <div className="flex gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to change (e.g., 'snow covered mountain background')"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              />
              <button
                onClick={generateEdit}
                disabled={isGenerating || !originalImage || !prompt.trim()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  isGenerating || !originalImage || !prompt.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Generate Magic (5 credits)'
                )}
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Example Prompts</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'snow covered mountain background',
                'make it look like a vintage 1980s photo',
                'enhance the lighting and make it more vibrant',
                'remove the person in the background'
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 bg-gray-800/30 border border-gray-600 rounded-lg text-gray-300 hover:border-purple-400 hover:text-white transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageRemixStudioPage;
