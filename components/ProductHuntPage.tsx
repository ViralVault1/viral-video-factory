import React from 'react';

interface ProductHuntPageProps {
  onNavigate: (page: string) => void;
}

export const ProductHuntPage: React.FC<ProductHuntPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Product Hunt Kit</h1>
        <p className="text-gray-400 mb-8">Launch your product successfully</p>
        <div className="bg-gray-800 p-8 rounded-lg">
          <p className="text-gray-300">Product Hunt features coming soon...</p>
        </div>
      </div>
    </div>
  );
};
