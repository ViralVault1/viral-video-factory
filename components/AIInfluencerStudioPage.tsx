import React from 'react';

interface AIInfluencerStudioPageProps {
  onNavigate: (page: string) => void;
}

export const AIInfluencerStudioPage: React.FC<AIInfluencerStudioPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">AI Influencer Studio</h1>
        <p className="text-gray-400 mb-12 text-center">Create AI-powered influencer content</p>
        <div className="bg-gray-800 p-8 rounded-lg">
          <p className="text-gray-300 text-center">AI Influencer Studio features coming soon...</p>
        </div>
      </div>
    </div>
  );
};
