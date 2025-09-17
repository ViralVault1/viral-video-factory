import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Video, 
  Users, 
  BarChart3, 
  Image, 
  Wand2, 
  Film, 
  ShoppingBag, 
  Sparkles, 
  DollarSign, 
  Ticket,
  X,
  PenTool,
  Palette
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const NavLink: React.FC<{ 
    path: string; 
    icon: React.ReactNode; 
    children: React.ReactNode; 
    badge?: string | number;
  }> = ({ path, icon, children, badge }) => {
    const isActive = location.pathname === path;
    
    return (
      <button 
        onClick={() => handleNavigate(path)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-gray-700 text-white' 
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
        }`}
      >
        {icon}
        <span className="flex-grow text-left">{children}</span>
        {badge && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const NavCategory: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">
      {children}
    </h3>
  );

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-white text-lg font-bold">Viral Video Factory</span>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden p-1 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        <NavLink path="/" icon={<Home className="w-5 h-5" />}>
          Dashboard
        </NavLink>
        
        <NavCategory>Creator Tools</NavCategory>
        <NavLink path="/auto-writer" icon={<PenTool className="w-5 h-5" />} badge="2">
          Auto Writer
        </NavLink>
        <NavLink path="/social-media-suite" icon={<BarChart3 className="w-5 h-5" />} badge="1">
          Social Media Suite
        </NavLink>
        <NavLink path="/social-studio" icon={<Users className="w-5 h-5" />} badge="4">
          Social Studio
        </NavLink>
        <NavLink path="/ai-influencer-studio" icon={<Users className="w-5 h-5" />} badge="5">
          AI Influencer Studio
        </NavLink>
        <NavLink path="/video-generator" icon={<Video className="w-5 h-5" />} badge="6">
          Video Generator
        </NavLink>
        <NavLink path="/product-ad-studio" icon={<ShoppingBag className="w-5 h-5" />} badge="7">
          Product Ad Studio
        </NavLink>
        <NavLink path="/image-generator" icon={<Image className="w-5 h-5" />} badge="8">
          Image Generator
        </NavLink>
        <NavLink path="/image-remix-studio" icon={<Palette className="w-5 h-5" />} badge="9">
          Image Remix Studio
        </NavLink>
        <NavLink path="/gif-generator" icon={<Film className="w-5 h-5" />} badge="10">
          Video to GIF
        </NavLink>
        
        <NavCategory>Launch Tools</NavCategory>
        <NavLink path="/product-hunt" icon={<Sparkles className="w-5 h-5" />} badge="11">
          Product Hunt Kit
        </NavLink>

        <NavCategory>Account</NavCategory>
        <NavLink path="/pricing" icon={<DollarSign className="w-5 h-5" />} badge="12">
          💰Pricing
        </NavLink>
        <NavLink path="/redeem-license" icon={<Ticket className="w-5 h-5" />} badge="13">
          🎟️Redeem License
        </NavLink>
      </nav>

      {/* Credits Display */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Available Credits</div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-bold text-lg">
              {user?.credits || 20}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        aria-hidden="true"
      />
      
      {/* Mobile Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 flex flex-col z-50 transition-transform transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 flex-col z-30">
        {sidebarContent}
      </div>
    </>
  );
};

