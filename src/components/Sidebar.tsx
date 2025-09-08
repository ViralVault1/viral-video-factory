import React from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'social-media-suite', label: 'Social Media Suite', icon: '📱' },
    { id: 'social-studio', label: 'Social Studio', icon: '🎨' },
    { id: 'ai-influencer-studio', label: 'AI Influencer Studio', icon: '🤖' },
    { id: 'video-generator', label: 'Video Generator', icon: '🎬' },
    { id: 'product-ad-studio', label: 'Product Ad Studio', icon: '📢' },
    { id: 'image-generator', label: 'Image Generator', icon: '🖼️' },
    { id: 'image-remix-studio', label: 'Image Remix Studio', icon: '✨' },
    { id: 'video-to-gif', label: 'Video to GIF', icon: '🎞️' },
    { id: 'product-hunt-kit', label: 'Product Hunt Kit', icon: '🚀' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'redeem-license', label: 'Redeem License', icon: '🎫' },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white flex items-center">
          🎬 Viral Video Factory
        </h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Creator Tools
          </h3>
          <nav className="space-y-1">
            {menuItems.slice(0, 9).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-3 ${
                  currentPage === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Launch Tools
          </h3>
          <nav className="space-y-1">
            {menuItems.slice(9, 10).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-3 ${
                  currentPage === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Account
          </h3>
          <nav className="space-y-1">
            {menuItems.slice(10).map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-3 ${
                  currentPage === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <div className="mb-2">Available Credits</div>
          <div className="text-2xl font-bold text-green-400">💎 20</div>
        </div>
      </div>
    </div>
  );
};
