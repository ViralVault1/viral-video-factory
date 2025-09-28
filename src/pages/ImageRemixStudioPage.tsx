import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
// DALL-E service for image remixing
import { 
  Loader2, 
  Sparkles, 
  Upload, 
  Camera, 
  RotateCcw, 
  Download, 
  Wand2, 
  Trash2 
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
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [isErasing, setIsErasing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const { user, consumeCredits } = useAuth();
    
    // Setup canvas for drawing masks
    const setupCanvas = useCallback(() => {
        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (image && canvas && image.clientWidth > 0) {
            canvas.width = image.clientWidth;
            canvas.height = image.clientHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.globalAlpha = 0.5;
                contextRef.current = context;
            }
        }
    }, []);

    useEffect(() => {
        const image = imageRef.current;
        if (image) {
            if (image.complete) {
                setupCanvas();
            } else {
                image.addEventListener('load', setupCanvas);
            }
        }
        return () => {
            if (image) {
                image.removeEventListener('load', setupCanvas);
            }
        };
    }, [originalImage, setupCanvas]);

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

    // Drawing functions for mask creation
    const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        if (contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }
    };

    const stopDrawing = () => {
        if (contextRef.current) {
            contextRef.current.closePath();
            setIsDrawing(false);
        }
    };

    const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineWidth = brushSize;
        contextRef.current.strokeStyle = isErasing ? '#000000' : '#FFFFFF';
        contextRef.current.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };
    
    const clearMask = () => {
        if (canvasRef.current && contextRef.current) {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
        if (!originalImage || !canvasRef.current) return;

        setIsLoading(true);
        setRemixedImage(null);

        try {
            await consumeCredits('imageGeneration');
            
            // Create mask for AI processing
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = canvasRef.current.width;
            maskCanvas.height = canvasRef.current.height;
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx) throw new Error("Could not create mask context");

            maskCtx.fillStyle = '#000000';
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            maskCtx.drawImage(canvasRef.current, 0, 0);
            const maskDataUrl = maskCanvas.toDataURL('image/png');

            // Use DALL-E for image editing
            const resultUrl = await remixImageWithDallE(originalImage, maskDataUrl, prompt);
            setRemixedImage(resultUrl);
            toast.success('Image remix completed successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to remix image');
        } finally {
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
                            Draw a mask over the area you want to change, then describe the transformation.
                        </p>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Image with canvas overlay */}
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Draw Your Mask</h3>
                            <div className="relative">
                                <img 
                                    ref={imageRef} 
                                    src={originalImage} 
                                    alt="To be remixed" 
                                    className="rounded-lg w-full opacity-80"
                                />
                                <canvas 
                                    ref={canvasRef} 
                                    onMouseDown={startDrawing} 
                                    onMouseUp={stopDrawing} 
                                    onMouseMove={draw} 
                                    onMouseLeave={stopDrawing} 
                                    className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded-lg"
                                />
                            </div>
                        </div>
                        
                        {/* Controls */}
                        <div className="bg-slate-800 rounded-xl p-6 space-y-6">
                            {/* Masking tools */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Masking Tools</h3>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <button 
                                        onClick={() => setIsErasing(false)} 
                                        className={`py-2 px-4 text-sm rounded-lg transition-colors ${
                                            !isErasing 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    >
                                        Draw
                                    </button>
                                    <button 
                                        onClick={() => setIsErasing(true)} 
                                        className={`py-2 px-4 text-sm rounded-lg transition-colors ${
                                            isErasing 
                                                ? 'bg-purple-500 text-white' 
                                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                    >
                                        Erase
                                    </button>
                                    <button 
                                        onClick={clearMask} 
                                        className="py-2 px-4 bg-slate-700 hover:bg-red-500 text-slate-300 hover:text-white rounded-lg transition-colors"
                                        title="Clear Mask"
                                    >
                                        <Trash2 className="w-4 h-4 mx-auto" />
                                    </button>
                                </div>
                                
                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Brush Size: {brushSize}px
                                    </label>
                                    <input 
                                        type="range" 
                                        min="10" 
                                        max="100" 
                                        value={brushSize} 
                                        onChange={e => setBrushSize(Number(e.target.value))} 
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
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
                                    placeholder="e.g., a futuristic silver jacket, long flowing blue hair, sunset background"
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
                                    Generate Remix
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
                    <Wand2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Image Remix Studio
                    </h1>
                    <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                        Upload a photo and use AI to change clothing, backgrounds, and more while keeping the original subject intact.
                    </p>
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
