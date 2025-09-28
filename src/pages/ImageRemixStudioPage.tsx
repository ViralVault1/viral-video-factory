import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  Camera, 
  Wand2, 
  Download, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Star, 
  Coins 
} from 'lucide-react';

interface ImageRemixStudioPageProps {
  onNavigate?: (page: string) => void;
}

const ImageRemixStudioPage: React.FC<ImageRemixStudioPageProps> = ({ onNavigate }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('background');
  const [prompt, setPrompt] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { user, consumeCredits, credits } = useAuth();

  const tools = [
    {
      id: 'background',
      name: 'Change Background',
      description: 'Replace the background while keeping the subject',
      icon: '🌄',
      placeholder: 'e.g., sunset beach, snowy mountains, modern office',
      cost: 5
    },
    {
      id: 'style',
      name: 'Style Transfer',
      description: 'Apply artistic styles to your image',
      icon: '🎨',
      placeholder: 'e.g., oil painting, watercolor, cyberpunk style',
      cost: 3
    },
    {
      id: 'enhance',
      name: 'AI Enhance',
      description: 'Improve quality and resolution',
      icon: '✨',
      placeholder: 'e.g., make it more vibrant, increase sharpness',
      cost: 2
    },
    {
      id: 'object',
      name: 'Add Objects',
      description: 'Add or modify objects in the scene',
      icon: '🔧',
      placeholder: 'e.g., add sunglasses, change clothes, add flowers',
      cost: 4
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setEditedImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      toast.error('Could not access camera. Please grant permission.');
    }
  };

  const captureFromVideo = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setOriginalImage(canvas.toDataURL('image/jpeg'));
      
      // Stop camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setShowCamera(false);
      setEditedImage(null);
    }
  };

  const generateEdit = async () => {
    if (!user) {
      toast('Please sign in to use AI tools');
      if (onNavigate) onNavigate('auth');
      return;
    }

    if (!originalImage || !prompt.trim()) {
      toast.error('Please provide an image and description');
      return;
    }
    
    const tool = tools.find(t => t.id === selectedTool);
    const cost = tool?.cost || 5;
    
    if (credits < cost) {
      toast.error(`Need ${cost} credits but only have ${credits}`);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await consumeCredits('imageGeneration');
      
      // Simulate AI processing - replace with actual AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo, we'll show the same image
      // In production, this would call your AI service
      setEditedImage(originalImage);
      toast.success(`${tool?.name} completed successfully!`);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `ai-edited-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  };

  const resetEditor = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setSelectedTool('background');
    setShowCamera(false);
    
    // Stop camera if active
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-8 h-8 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">AI is working its magic...</h2>
          <p className="text-purple-300 text-lg">Creating your perfect image</p>
          <div className="mt-6 w-64 h-2 bg-slate-700 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Image Studio</h1>
                <p className="text-sm text-purple-300">Professional-grade AI editing</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">{credits}</span>
                  <span className="text-slate-400 text-sm">credits</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!originalImage ? (
          // Upload Interface
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Transform Your Images with AI
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Professional-quality editing powered by cutting-edge artificial intelligence
              </p>
            </div>

            {showCamera ? (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full rounded-xl mb-4"
                />
                <div className="flex gap-4">
                  <button 
                    onClick={captureFromVideo}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </button>
                  <button 
                    onClick={() => {
                      const stream = videoRef.current?.srcObject as MediaStream;
                      stream?.getTracks().forEach(track => track.stop());
                      if (videoRef.current) videoRef.current.srcObject = null;
                      setShowCamera(false);
                    }}
                    className="px-6 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative bg-slate-800/50 hover:bg-slate-700/50 border-2 border-dashed border-slate-600 hover:border-purple-500 rounded-2xl p-8 transition-all duration-300"
                >
                  <Upload className="w-12 h-12 text-slate-400 group-hover:text-purple-400 mx-auto mb-4 transition-colors" />
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Image</h3>
                  <p className="text-slate-400">Drop your image here or click to browse</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button 
                  onClick={handleTakePhoto}
                  className="group relative bg-slate-800/50 hover:bg-slate-700/50 border-2 border-dashed border-slate-600 hover:border-purple-500 rounded-2xl p-8 transition-all duration-300"
                >
                  <Camera className="w-12 h-12 text-slate-400 group-hover:text-purple-400 mx-auto mb-4 transition-colors" />
                  <h3 className="text-xl font-semibold text-white mb-2">Take Photo</h3>
                  <p className="text-slate-400">Use your camera to capture an image</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-4 text-center">
              {tools.map((tool) => (
                <div key={tool.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h4 className="text-sm font-semibold text-white mb-1">{tool.name}</h4>
                  <p className="text-xs text-slate-400">{tool.description}</p>
                  <p className="text-xs text-green-400 mt-2">{tool.cost} credits</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Editing Interface
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Display */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">Original</h3>
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>

                {/* Edited */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 text-center flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    AI Enhanced
                  </h3>
                  {editedImage ? (
                    <img 
                      src={editedImage} 
                      alt="Edited" 
                      className="w-full rounded-xl shadow-2xl"
                    />
                  ) : (
                    <div className="aspect-square bg-slate-700/30 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400">Your edited image will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {editedImage && (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={downloadImage}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    Download HD
                  </button>
                  <button
                    onClick={resetEditor}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    New Image
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 h-fit">
              <h3 className="text-xl font-bold text-white mb-6">AI Tools</h3>

              {/* Tool Selection */}
              <div className="space-y-3 mb-6">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      selectedTool === tool.id
                        ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-2 border-purple-500'
                        : 'bg-slate-700/30 hover:bg-slate-600/40 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">{tool.name}</h4>
                          <span className="text-sm text-green-400">{tool.cost} credits</span>
                        </div>
                        <p className="text-sm text-slate-400">{tool.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Describe your vision
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={tools.find(t => t.id === selectedTool)?.placeholder}
                  rows={4}
                  className="w-full bg-slate-900/50 border-2 border-slate-600 focus:border-purple-500 rounded-xl p-4 text-white placeholder-slate-400 resize-none transition-all duration-200 focus:outline-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateEdit}
                disabled={!prompt.trim() || !user}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg disabled:cursor-not-allowed"
              >
                <Wand2 className="w-6 h-6" />
                Generate Magic ({tools.find(t => t.id === selectedTool)?.cost || 5} credits)
              </button>

              {!user && (
                <p className="text-center text-slate-400 text-sm mt-3">
                  Please sign in to use AI tools
                </p>
              )}

              {/* Tips */}
              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl">
                <h4 className="font-semibold text-purple-300 mb-2">Pro Tips</h4>
                <ul className="text-sm text-purple-200 space-y-1">
                  <li>• Be specific about colors and style</li>
                  <li>• Mention lighting conditions</li>
                  <li>• Use artistic references</li>
                  <li>• Try multiple variations</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageRemixStudioPage;
