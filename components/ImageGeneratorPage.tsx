import React from 'react';

interface UserGuidePageProps {
  onNavigate: (page: string) => void;
}

export const UserGuidePage: React.FC<UserGuidePageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">User Guide</h1>
        <div className="bg-gray-800 p-8 rounded-# Create placeholder page components
@'
import React from 'react';

interface ImageGeneratorPageProps {
  onNavigate: (page: string) => void;
}

export const ImageGeneratorPage: React.FC<ImageGeneratorPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Image Generator</h1>
        <p className="text-gray-400 mb-8">Generate stunning images with AI</p>
        <div className="bg-gray-800 p-8 rounded-lg">
          <p className="text-gray-300">Image generation feature coming soon...</p>
        </div>
      </div>
    </div>
  );
};
