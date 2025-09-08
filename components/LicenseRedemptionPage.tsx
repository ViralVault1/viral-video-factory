import React from 'react';

interface LicenseRedemptionPageProps {
  onNavigate: (page: string) => void;
}

export const LicenseRedemptionPage: React.FC<LicenseRedemptionPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Redeem License</h1>
        <p className="text-gray-400 mb-8">Enter your license key to unlock premium features</p>
        <div className="bg-gray-800 p-8 rounded-lg">
          <input 
            type="text" 
            placeholder="Enter license key..." 
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white mb-4"
          />
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Redeem License
          </button>
        </div>
      </div>
    </div>
  );
};
