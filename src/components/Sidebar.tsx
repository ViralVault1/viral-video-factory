import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './NotificationProvider';
import { CloseIcon } from './icons/CloseIcon';
import { HomeIcon } from './icons/HomeIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { VideoCameraIcon } from './icons/VideoCameraIcon';
import { ShoppingBagIcon } from './icons/ShoppingBagIcon';
import { ImageIcon } from './ImageIcon';
import { FilmIcon } from './icons/FilmIcon';
import { ProductHuntIcon } from './icons/ProductHuntIcon';
import { LockIcon } from './icons/LockIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useTheme } from '../contexts/ThemeContext';
import { themeConfig } from '../config/themeConfig';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { CreditDisplay } from './CreditDisplay';
import { UsersGroupIcon } from './icons/UsersGroupIcon';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage, isOpen, setIsOpen }) => {
  const { user, isPremium, loading } = useAuth();
  const { showToast } = useNotification();
  const { theme } = useTheme();
  const config = themeConfig[theme];
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
        if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, setIsOpen]);

  const showLock = !loading && user && !isPremium;

  const handlePremiumNavigate = (page: string) => {
    if (!user) { onNavigate(page); return; }
    if (isPremium) { onNavigate(page); } 
    else {
        showToast('Upgrade to a premium plan to access this feature.', 'info');
        onNavigate('pricing');
    }
  };
  
  const handleScrollToSection = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
        scrollToSection(sectionId);
        return;
    }
    onNavigate('home');
    setTimeout(() => {
        scrollToSection(sectionId);
    }, 100);
  };

  const NavLink: React.FC<{ page: string; icon: React.ReactNode; children: React.ReactNode; isPremium?: boolean; }> = ({ page, icon, children, isPremium }) => {
    const isActive = currentPage === page;
    const onClick = isPremium ? () => handlePremiumNavigate(page) : () => onNavigate(page);
    return (
      <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'}`}>
        {icon}
        <span className="flex-grow text-left">{children}</span>
        {isPremium && showLock && <LockIcon className="w-3.5 h-3.5 flex-shrink-0" />}
      </button>
    );
  };
  
  const NavScrollLink: React.FC<{ sectionId: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ sectionId, icon, children }) => (
    <button onClick={(e) => handleScrollToSection(e, sectionId)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
        {icon}
        <span>{children}</span>
    </button>
  );

  const NavCategory: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">{children}</h3>
  );

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-purple-400" />
            <span className="text-white text-lg font-bold">Viral Video Factory</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <CloseIcon />
          </button>
      </div>
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <NavLink page="home" icon={<HomeIcon className="w-5 h-5"/>}>Dashboard</NavLink>
        
        <NavCategory>Creator Tools</NavCategory>
        <NavLink page="ai-agents" icon={<SparklesIcon className="w-5 h-5"/>} isPremium>AI Agents Hub</NavLink>
        <NavLink page="social-media-suite" icon={<ChartBarIcon className="w-5 h-5"/>} isPremium>Social Media Suite</NavLink>
        <NavLink page="social-studio" icon={<SparklesIcon className="w-5 h-5"/>} isPremium>Social Studio</NavLink>
        <NavLink page="ai-influencer-studio" icon={<UsersGroupIcon className="w-5 h-5"/>}>AI Influencer Studio</NavLink>
        <NavScrollLink sectionId="generator-workflow" icon={<VideoCameraIcon className="w-5 h-5"/>}>Video Generator</NavScrollLink>
        <NavLink page="product-ad-studio" icon={<ShoppingBagIcon className="w-5 h-5"/>}>Product Ad Studio</NavLink>
        <NavLink page="image-generator" icon={<ImageIcon className="w-5 h-5"/>}>Image Generator</NavLink>
        <NavLink page="image-remix-studio" icon={<MagicWandIcon className="w-5 h-5"/>}>Image Remix Studio</NavLink>
        <NavLink page="gif-generator" icon={<FilmIcon className="w-5 h-5"/>}>Video to GIF</NavLink>
        
        <NavCategory>Launch Tools</NavCategory>
        <NavLink page="product-hunt" icon={<ProductHuntIcon className="w-5 h-5"/>}>Product Hunt Kit</NavLink>

        <NavCategory>Account</NavCategory>
        <NavLink page="pricing" icon={<span className="w-5 h-5 text-center text-lg">💰</span>}>Pricing</NavLink>
        <NavLink page="redeem-license" icon={<span className="w-5 h-5 text-center text-lg">🎟️</span>}>Redeem License</NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <CreditDisplay onNavigate={onNavigate} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true"></div>
      <div ref={sidebarRef} className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 flex flex-col z-50 transition-transform transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 flex-col z-30">
        {sidebarContent}
      </div>
    </>
  );
};
