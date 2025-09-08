import React from 'react';

interface ImageRemixStudioPageProps {
  onNavigate: (page: string) => void;
}

export const ImageRemixStudioPage: React.FC<ImageRemixStudioPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Remix Studio</h1>
        <p className="text-gray-400 mb-12 text-center">Transform and enhance your images with AI</p>
        <div className="bg-gray-800 p-8 rounded-lg">
          <p className="text-gray-300 text-center">Image Remix Studio features coming soon...</p>
        </div>
      </div>
    </div>
  );
};
