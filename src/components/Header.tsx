import React from 'react';
import { CloseIcon, HomeIcon } from './icons/CommonIcons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onToggleMobileMenu }) => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 lg:pl-64">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white lg:hidden">Viral Video Factory</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Welcome, {user.email}</span>
              <button
                onClick={() => onNavigate('auth')}
                className="text-gray-400 hover:text-white"
              >
                Account
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
