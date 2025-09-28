import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './NotificationProvider';
import { remixImageWithMask } from '../services/geminiService';
import { LoaderIcon } from './icons/LoaderIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageRemixStudioPageProps {
  onNavigate: (page: string) => void;
}

export const ImageRemixStudioPage: React.FC<ImageRemixStudioPageProps> = ({ onNavigate }) => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [remixedImage, setRemixedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [isErasing, setIsErasing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const { user, consumeCredits } = useAuth();
    const { showToast } = useNotification();
    
    // Using useCallback to memoize the function, preventing re-creation on every render.
    const setupCanvas = useCallback(() => {
        const image = imageRef.current;
        const canvas = canvasRef.current;

        if (image && canvas && image.clientWidth > 0) {
            // Match canvas resolution to the image's displayed size for accurate masking
            canvas.width = image.clientWidth;
            canvas.height = image.clientHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.globalAlpha = 0.5; // Make mask semi-transparent for visibility
                contextRef.current = context;
            }
        }
    }, []); // Empty dependency array as refs are stable.

    // This useEffect is a more robust way to set up the canvas.
    // It handles cases where the image is already cached and the 'load' event might not fire.
    useEffect(() => {
        const image = imageRef.current;
        if (image) {
            // If image is already loaded, setup immediately.
            if (image.complete) {
                setupCanvas();
            } else {
                // Otherwise, add an event listener.
                image.addEventListener('load', setupCanvas);
            }
        }
        // Cleanup function to remove the event listener.
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
            showToast('Please upload a valid image file.', 'error');
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
            }
        } catch (error) {
            showToast('Could not access camera. Please grant permission.', 'error');
        }
    };
    
    const captureFromVideo = () => {
        if (videoRef.current) {
             const canvas = document.createElement('canvas');
             canvas.width = videoRef.current.videoWidth;
             canvas.height = videoRef.current.videoHeight;
             canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
             setOriginalImage(canvas.toDataURL('image/jpeg'));
             
             // Stop all video streams
             const stream = videoRef.current.srcObject as MediaStream;
             stream?.getTracks().forEach(track => track.stop());
             videoRef.current.srcObject = null;
        }
    };


    // Drawing functions
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
    }
    
    const handleGenerateRemix = async () => {
        if (!user) { showToast('Please sign in to remix images.', 'info'); onNavigate('auth'); return; }
        if (!prompt.trim()) { showToast('Please enter a prompt.', 'error'); return; }
        if (!originalImage || !canvasRef.current) return;

        setIsLoading(true);
        setRemixedImage(null);

        try {
            await consumeCredits('imageGeneration');
            // Create a non-transparent, black and white mask for the AI
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = canvasRef.current.width;
            maskCanvas.height = canvasRef.current.height;
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx) throw new Error("Could not create mask context");

            maskCtx.fillStyle = '#000000'; // Unmasked area is black
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
            maskCtx.drawImage(canvasRef.current, 0, 0);
            const maskDataUrl = maskCanvas.toDataURL('image/png');

            const resultUrl = await remixImageWithMask(originalImage, maskDataUrl, prompt);
            setRemixedImage(resultUrl);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const startOver = () => {
        setOriginalImage(null);
        setRemixedImage(null);
        setPrompt('');
        setIsLoading(false);
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center">
                <LoaderIcon className="w-12 h-12 text-green-400" />
                <h2 className="mt-4 text-2xl font-bold text-white">Remixing Your Image...</h2>
                <p className="text-gray-400">The AI is working its magic. This can take a moment.</p>
            </div>
        );
    }
    
    if (remixedImage) {
        return (
            <div className="py-12 px-4 animate-fade-in">
                 <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Your Image, Remixed</h1>
                </div>
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">Original</h3>
                        <img src={originalImage!} alt="Original" className="rounded-xl w-full" />
                    </div>
                     <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">Remixed</h3>
                        <img src={remixedImage} alt="Remixed" className="rounded-xl w-full" />
                    </div>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                     <button onClick={() => {
                         const link = document.createElement('a');
                         link.href = remixedImage;
                         link.download = 'remixed-image.png';
                         link.click();
                     }} className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">
                        <DownloadIcon /> Download
                    </button>
                    <button onClick={startOver} className="flex items-center justify-center gap-2 bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                        <RefreshIcon /> Start Over
                    </button>
                </div>
            </div>
        );
    }

    if (originalImage) {
        return (
             <div className="py-12 px-4 animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Remix Your Image</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Draw a mask over the area you want to change, then describe the transformation.
                    </p>
                </div>
                <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
                    <div className="relative w-full max-w-xl mx-auto">
                        <img 
                            ref={imageRef} 
                            src={originalImage} 
                            alt="To be remixed" 
                            className="rounded-xl w-full opacity-80"
                        />
                        <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseMove={draw} onMouseLeave={stopDrawing} className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded-xl" />
                    </div>
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-6">
                        <div>
                            <h3 className="font-bold text-white mb-2">Masking Tools</h3>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsErasing(false)} className={`flex-1 py-2 text-sm rounded-md ${!isErasing ? 'bg-green-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Draw</button>
                                <button onClick={() => setIsErasing(true)} className={`flex-1 py-2 text-sm rounded-md ${isErasing ? 'bg-purple-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Erase</button>
                                <button onClick={clearMask} className="p-2 bg-gray-700 hover:bg-red-500 rounded-md" title="Clear Mask"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                            <div className="mt-4">
                                <label className="text-sm text-gray-400 block mb-1">Brush Size: {brushSize}</label>
                                <input type="range" min="10" max="100" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-full" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="remix-prompt" className="block text-xl font-bold text-white mb-3">Describe the Change</label>
                            <textarea
                                id="remix-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                placeholder="e.g., a futuristic silver jacket, long flowing blue hair"
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleGenerateRemix} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
                                <SparklesIcon /> Generate Remix
                            </button>
                            <button onClick={startOver} className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600">
                                Start Over
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        )
    }

    return (
        <div className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <MagicWandIcon className="w-12 h-12 text-green-400 mx-auto mb-4"/>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Image Remix Studio</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Upload a photo and use AI to change clothing, backgrounds, and more while keeping the original subject intact.
                    </p>
                </div>

                <div className="mt-12 max-w-xl mx-auto">
                     {videoRef.current?.srcObject ? (
                         <div className="space-y-4">
                            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl"></video>
                            <button onClick={captureFromVideo} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600">
                                <CameraIcon /> Capture Photo
                            </button>
                         </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onClick={() => fileInputRef.current?.click()} className="bg-gray-800 p-8 rounded-2xl border-2 border-dashed border-gray-600 text-center hover:border-green-500 transition-colors">
                                <UploadIcon className="w-12 h-12 mb-4 mx-auto text-gray-400" />
                                <h3 className="text-xl font-bold text-white mb-2">Upload Photo</h3>
                                <p className="text-gray-400 text-sm">Drag & drop or click to browse for an image file.</p>
                                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />
                            </button>
                            <button onClick={handleTakePhoto} className="bg-gray-800 p-8 rounded-2xl border-2 border-dashed border-gray-600 text-center hover:border-green-500 transition-colors">
                                <CameraIcon className="w-12 h-12 mb-4 mx-auto text-gray-400" />
                                <h3 className="text-xl font-bold text-white mb-2">Take Photo</h3>
                                <p className="text-gray-400 text-sm">Use your device's camera to capture a new photo.</p>
                            </button>
                        </div>
                     )}
                     <video ref={videoRef} className="hidden"></video>
                </div>
            </div>
        </div>
    );
};
