import React from 'react';

interface SocialMediaSuitePageProps {
  onNavigate: (page: string) => void;
}

export const SocialMediaSuitePage: React.FC<SocialMediaSuitePageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Social Media Suite</h1>
        <p className="text-gray-400 mb-12 text-center">Manage all your social media from one dashboard</p>
        <div className="bg-gray-800 p-8 rounded-lg">
          <p className="text-gray-300 text-center">Social Media Suite features coming soon...</p>
        </div>
      </div>
    </div>
  );
};
