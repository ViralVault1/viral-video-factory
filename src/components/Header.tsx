import React from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 h-16">
      <div className="flex justify-between items-center h-full px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded"></div>
            <span className="text-white font-semibold">Viral Video Factory</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Viral</span>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Pixar</span>
            <span>Guest</span>
          </div>
          <button className="text-gray-400 hover:text-white px-3 py-1 rounded">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
