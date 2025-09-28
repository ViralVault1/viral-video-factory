import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Loader2, 
  Sparkles, 
  Upload, 
  Camera, 
  RotateCcw, 
  Download, 
  Wand2, 
  Trash2,
  Coins
} from 'lucide-react';

interface ImageRemixStudioPageProps {
  onNavigate?: (page: string) => void;
}

// DALL-E service for image editing
const remixImageWithDallE = async (originalImage: string, maskDataUrl: string, prompt: string): Promise<string> => {
  const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not found. Please add REACT_APP_OPENAI_API_KEY to your environment variables.');
  }

  try {
    // Convert base64 images to blobs
    const originalBlob = await fetch(originalImage).then(r => r.blob());
    const maskBlob = await fetch(maskDataUrl).then(r => r.blob());

    // Create form data for the API request
    const formData = new FormData();
    formData.append('image', originalBlob, 'original.png');
    formData.append('mask', maskBlob, 'mask.png');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('Invalid response from OpenAI API');
    }

    return data.data[0].url;
  } catch (error: any) {
    console.error('DALL-E API Error:', error);
    throw new Error(error.message || 'Failed to remix image with DALL-E');
  }
};

const ImageRemixStudioPage: React.FC<ImageRemixStudioPageProps> = ({ onNavigate }) => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [remixedImage, setRemixedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [maskType, setMaskType] = useState<'background' | 'foreground' | 'custom'>('background');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const { user, consumeCredits, credits } = useAuth();
    
    const IMAGE_GENERATION_COST = 5;

    // Simple credit display component
    const CreditDisplay = () => {
        const getCreditColor = () => {
            if (credits >= 20) return 'text-green-400';
            if (credits >= 10) return 'text-yellow-400';
            return 'text-red-400';
        };

        return (
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                <Coins className={`w-5 h-5 ${getCreditColor()}`} />
                <span className={`font-bold ${getCreditColor()}`}>{credits}</span>
                <span className="text-slate-400 text-sm">credits</span>
            </div>
        );
    };
    
    // Create a simple mask based on user selection
    const createMask = (imageWidth: number, imageHeight: number): string => {
        const canvas = document.createElement('canvas');
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('Could not create canvas context');
        
        // Create mask based on selection type
        if (maskType === 'background') {
            // White background (area to change), black foreground (area to keep)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, imageWidth, imageHeight);
            
            // Create a simple center oval for foreground (subject to keep)
            const centerX = imageWidth / 2;
            const centerY = imageHeight / 2;
            const radiusX = imageWidth * 0.25;
            const radiusY = imageHeight * 0.35;
            
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.fill();
        } else if (maskType === 'foreground') {
            // Black background (area to keep), white foreground (area to change)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, imageWidth, imageHeight);
            
            // Create a simple center oval for foreground (subject to change)
            const centerX = imageWidth / 2;
            const centerY = imageHeight / 2;
            const radiusX = imageWidth * 0.25;
            const radiusY = imageHeight * 0.35;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            // Custom: Simple horizontal split
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, imageWidth, imageHeight / 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, imageHeight / 2, imageWidth, imageHeight / 2);
        }
        
        return canvas.toDataURL('image/png');
    };

    const handleFileChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImage(reader.result as string);
        };
        reader.readAsDataURL(file);
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
        }
    };

    const handleGenerateRemix = async () => {
        if (!user) { 
            toast('Please sign in to remix images.'); 
            if (onNavigate) {
                onNavigate('auth'); 
            }
            return; 
        }
        if (!prompt.trim()) { 
            toast.error('Please enter a prompt describing what you want to change.'); 
            return; 
        }
        if (!originalImage) return;

        setIsLoading(true);
        setRemixedImage(null);

        try {
            await consumeCredits('imageGeneration');
            
            // Create a simple mask based on user selection
            const img = new Image();
            img.onload = async () => {
                try {
                    const maskDataUrl = createMask(img.naturalWidth, img.naturalHeight);
                    const resultUrl = await remixImageWithDallE(originalImage, maskDataUrl, prompt);
                    setRemixedImage(resultUrl);
                    toast.success('Image remix completed successfully!');
                } catch (error: any) {
                    toast.error(error.message || 'Failed to remix image');
                } finally {
                    setIsLoading(false);
                }
            };
            img.onerror = () => {
                toast.error('Failed to load image');
                setIsLoading(false);
            };
            img.src = originalImage;
            
        } catch (error: any) {
            toast.error(error.message || 'Failed to remix image');
            setIsLoading(false);
        }
    };

    const downloadImage = () => {
        if (remixedImage) {
            const link = document.createElement('a');
            link.href = remixedImage;
            link.download = 'remixed-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Image downloaded successfully!');
        }
    };

    const startOver = () => {
        setOriginalImage(null);
        setRemixedImage(null);
        setPrompt('');
        setIsLoading(false);
        setShowCamera(false);
        
        // Stop camera if active
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-4">
                <Loader2 className="w-16 h-16 text-green-400 animate-spin mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Remixing Your Image...</h2>
                <p className="text-slate-400 text-lg max-w-md">
                    The AI is working its magic. This can take a moment to complete.
                </p>
            </div>
        );
    }
    
    // Results view
    if (remixedImage) {
        return (
            <div className="min-h-screen bg-slate-900 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Your Image, Remixed
                        </h1>
                        <p className="text-slate-400 text-lg">
                            AI has transformed your image based on your prompt
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-slate-400 mb-4 text-center">Original</h3>
                            <img 
                                src={originalImage!} 
                                alt="Original" 
                                className="rounded-lg w-full shadow-lg"
                            />
                        </div>
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-green-400 mb-4 text-center">Remixed</h3>
                            <img 
                                src={remixedImage} 
                                alt="Remixed" 
                                className="rounded-lg w-full shadow-lg"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                            onClick={downloadImage}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download Image
                        </button>
                        <button 
                            onClick={startOver}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Editing view
    if (originalImage) {
        return (
            <div className="min-h-screen bg-slate-900 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Remix Your Image
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Choose what to change and describe your transformation.
                        </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Image preview */}
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Your Image</h3>
                            <div className="relative">
                                <img 
                                    ref={imageRef} 
                                    src={originalImage} 
                                    alt="To be remixed" 
                                    className="rounded-lg w-full"
                                />
                                {/* Visual indicator overlay */}
                                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                                    {maskType === 'background' && (
                                        <div className="absolute inset-0 bg-green-500/20 border-2 border-green-500/50 rounded-lg flex items-center justify-center">
                                            <div className="bg-slate-900/80 px-3 py-1 rounded text-green-300 text-sm">
                                                Background will be changed
                                            </div>
                                        </div>
                                    )}
                                    {maskType === 'foreground' && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-3/5 bg-green-500/20 border-2 border-green-500/50 rounded-full flex items-center justify-center">
                                            <div className="bg-slate-900/80 px-3 py-1 rounded text-green-300 text-sm">
                                                Subject will be changed
                                            </div>
                                        </div>
                                    )}
                                    {maskType === 'custom' && (
                                        <div className="absolute inset-0">
                                            <div className="h-1/2 bg-red-500/20 border-b border-red-500/50 flex items-center justify-center">
                                                <div className="bg-slate-900/80 px-3 py-1 rounded text-red-300 text-sm">
                                                    Top half unchanged
                                                </div>
                                            </div>
                                            <div className="h-1/2 bg-green-500/20 flex items-center justify-center">
                                                <div className="bg-slate-900/80 px-3 py-1 rounded text-green-300 text-sm">
                                                    Bottom half changed
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Controls */}
                        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
                            {/* Selection tools */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">What to Change</h3>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => setMaskType('background')} 
                                        className={`w-full p-4 text-left rounded-lg transition-colors ${
                                            maskType === 'background'
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    >
                                        <div className="font-medium">Change Background</div>
                                        <div className="text-sm opacity-80">Keep the main subject, change everything else</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => setMaskType('foreground')} 
                                        className={`w-full p-4 text-left rounded-lg transition-colors ${
                                            maskType === 'foreground'
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    >
                                        <div className="font-medium">Change Subject</div>
                                        <div className="text-sm opacity-80">Keep the background, change the main subject</div>
                                    </button>
                                    
                                    <button 
                                        onClick={() => setMaskType('custom')} 
                                        className={`w-full p-4 text-left rounded-lg transition-colors ${
                                            maskType === 'custom'
                                                ? 'bg-green-600 text-white' 
                                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    >
                                        <div className="font-medium">Change Bottom Half</div>
                                        <div className="text-sm opacity-80">Keep top, change bottom half of image</div>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Prompt input */}
                            <div>
                                <label htmlFor="remix-prompt" className="block text-lg font-semibold text-white mb-3">
                                    Describe the Change
                                </label>
                                <textarea
                                    id="remix-prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    rows={4}
                                    placeholder={
                                        maskType === 'background' 
                                            ? "e.g., a beautiful sunset beach, snowy mountains, futuristic city"
                                            : maskType === 'foreground'
                                            ? "e.g., wearing a red dress, as a cartoon character, with blue hair"
                                            : "e.g., wearing different shoes, standing on grass, with a dog"
                                    }
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-slate-400 resize-none"
                                />
                            </div>
                            
                            {/* Action buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={handleGenerateRemix}
                                    disabled={!prompt.trim()}
                                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Generate Remix ({IMAGE_GENERATION_COST} credits)
                                </button>
                                <button 
                                    onClick={startOver}
                                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
                                >
                                    Start Over
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Initial upload view
    return (
        <div className="min-h-screen bg-slate-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <Wand2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Image Remix Studio
                            </h1>
                        </div>
                        {user && <CreditDisplay />}
                    </div>
                    <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                        Upload a photo and use AI to change clothing, backgrounds, and more while keeping the original subject intact.
                    </p>
                    
                    {user && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <Coins className="w-4 h-4" />
                            <span>Each image remix costs {IMAGE_GENERATION_COST} credits</span>
                        </div>
                    )}
                    
                    {user && credits < IMAGE_GENERATION_COST && (
                        <div className="mt-4 bg-red-900/20 border border-red-500/50 rounded-lg p-3 max-w-md mx-auto">
                            <div className="text-red-400 text-sm">
                                ⚠️ You need {IMAGE_GENERATION_COST} credits but only have {credits}. Contact support to add more credits.
                            </div>
                        </div>
                    )}
                </div>

                <div className="max-w-2xl mx-auto">
                    {showCamera ? (
                        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className="w-full rounded-lg"
                            />
                            <div className="flex gap-4">
                                <button 
                                    onClick={captureFromVideo}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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
                                    className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                className="bg-slate-800 hover:bg-slate-700 p-8 rounded-xl border-2 border-dashed border-slate-600 hover:border-green-500 text-center transition-all group"
                            >
                                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400 group-hover:text-green-400 transition-colors" />
                                <h3 className="text-xl font-semibold text-white mb-2">Upload Photo</h3>
                                <p className="text-slate-400 text-sm">
                                    Click to browse for an image file
                                </p>
                                <input 
                                    ref={fileInputRef} 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handleFileChange(e.target.files)} 
                                />
                            </button>
                            
                            <button 
                                onClick={handleTakePhoto} 
                                className="bg-slate-800 hover:bg-slate-700 p-8 rounded-xl border-2 border-dashed border-slate-600 hover:border-green-500 text-center transition-all group"
                            >
                                <Camera className="w-12 h-12 mx-auto mb-4 text-slate-400 group-hover:text-green-400 transition-colors" />
                                <h3 className="text-xl font-semibold text-white mb-2">Take Photo</h3>
                                <p className="text-slate-400 text-sm">
                                    Use your device's camera to capture a photo
                                </p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageRemixStudioPage;
