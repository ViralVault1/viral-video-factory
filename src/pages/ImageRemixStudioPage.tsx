import React, { useState, useCallback, useRef } from 'react';

export const ImageRemixStudioPage: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setIsUploading(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setUploadedImage(file);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
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

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or use upload instead.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            handleFileUpload(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setError('');
    stopCamera();
  };

  const startRemix = () => {
    if (!uploadedImage) {
      setError('Please upload or capture a photo first');
      return;
    }

    // Simulate remix process
    alert('Image remix started! This would typically use AI to modify your image while keeping the subject intact.');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 mr-3 text-green-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold">Image Remix Studio</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Upload a photo and use AI to change clothing, backgrounds, and more while 
            keeping the original subject intact.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!uploadedImage && !isCameraActive ? (
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Upload Photo Option */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer ${
                  isDragOver 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Photo</h3>
                <p className="text-gray-400 mb-4">
                  Drag & drop or click to browse for an image file
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, GIF, WebP (Max 10MB)
                </p>
              </div>

              {/* Take Photo Option */}
              <div
                className="border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-lg p-8 text-center transition-colors duration-200 cursor-pointer"
                onClick={startCamera}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Take Photo</h3>
                <p className="text-gray-400 mb-4">
                  Use your device's camera to capture a new photo
                </p>
                <p className="text-sm text-gray-500">
                  Camera access required
                </p>
              </div>
            </div>
          ) : isCameraActive ? (
            <div className="bg-gray-800 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Camera</h3>
                <button
                  onClick={stopCamera}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Cancel
                </button>
              </div>
              
              <div className="relative mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="text-center">
                <button
                  onClick={capturePhoto}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Capture Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 mb-12">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Uploaded Image</h3>
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
                  alt="Uploaded preview"
                  className="max-w-full h-64 object-contain mx-auto rounded-lg"
                />
              </div>

              <div className="text-center">
                <button
                  onClick={startRemix}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Start Remix
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isUploading && (
            <div className="text-center mb-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Uploading image...</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-center">
              {error}
            </div>
          )}

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Check out our{' '}
              <a href="#" className="text-green-400 hover:text-green-300 underline">
                image remix guide
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">SOLUTIONS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/api" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">PRODUCTS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/video-generator" className="hover:text-white">AI Video Generator</a></li>
                <li><a href="/auto-writer" className="hover:text-white">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">RESOURCES</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/guide" className="hover:text-white">User Guide</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/community" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">COMPANY</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-white font-semibold">Viral Video Factory</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Viral Video Factory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
