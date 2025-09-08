import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 lg:pl-64">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Viral Video Factory</h3>
            <p className="text-gray-400 text-sm">
              Create engaging faceless videos with AI in minutes. No filming needed.
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="text-gray-400 hover:text-white text-sm">Video Generator</button></li>
              <li><button onClick={() => onNavigate('image-generator')} className="text-gray-400 hover:text-white text-sm">Image Generator</button></li>
              <li><button onClick={() => onNavigate('ai-agents')} className="text-gray-400 hover:text-white text-sm">AI Agents</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('pricing')} className="text-gray-400 hover:text-white text-sm">Pricing</button></li>
              <li><button onClick={() => onNavigate('auth')} className="text-gray-400 hover:text-white text-sm">Sign In</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            © 2024 Viral Video Factory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
