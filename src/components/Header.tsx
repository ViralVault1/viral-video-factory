import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 lg:z-30 border-b border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={onMenuClick}
                type="button"
                className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="block h-6 w-6" />
              </button>
            </div>
            
            {/* Logo */}
            <button 
              onClick={() => navigate('/')} 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-white text-xl font-bold hidden sm:block">
                Viral Video Factory
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme indicators */}
            <div className="flex items-center gap-4 mr-4">
              <span className="text-sm text-gray-400 hidden sm:inline">Viral</span>
              <div className="w-11 h-6 bg-gray-700 rounded-full relative">
                <div className="absolute top-0.5 left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all"></div>
              </div>
              <span className="text-sm text-gray-400 hidden sm:inline">Pixar</span>
            </div>
            
            {/* User section */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm mr-4 hidden md:inline">
                  Guest
                </span>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')} 
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

