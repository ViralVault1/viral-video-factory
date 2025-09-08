import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CreditDisplayProps {
  onNavigate: (page: string) => void;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({ onNavigate }) => {
  const { user, isPremium } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">Credits</span>
        <span className="text-lg font-bold text-white">{user.credits || 0}</span>
      </div>
      {!isPremium && (
        <button
          onClick={() => onNavigate('pricing')}
          className="w-full bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition-colors"
        >
          Upgrade Plan
        </button>
      )}
    </div>
  );
};
