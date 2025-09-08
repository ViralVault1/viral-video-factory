import React, { useState } from 'react';

interface SocialMediaSuitePageProps {
  onNavigate: (page: string) => void;
}

export const SocialMediaSuitePage: React.FC<SocialMediaSuitePageProps> = ({ onNavigate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', connected: true, followers: '12.3K' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', connected: true, followers: '45.2K' },
    { id: 'youtube', name: 'YouTube', icon: '📺', connected: false, followers: '0' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', connected: true, followers: '8.9K' }
  ];

  const analytics = [
    { metric: 'Total Reach', value: '156K', change: '+12%' },
    { metric: 'Engagement Rate', value: '4.2%', change: '+0.8%' },
    { metric: 'New Followers', value: '2.1K', change: '+15%' },
    { metric: 'Video Views', value: '89K', change: '+22%' }
  ];

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Social Media Suite</h1>
          <p className="text-gray-400">Manage all your social media accounts from one dashboard</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {analytics.map((item, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{item.metric}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-400">{item.value}</span>
                <span className="text-green-400 text-sm">{item.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Connected Platforms</h2>
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h3 className="text-white font-medium">{platform.name}</h3>
                      <p className="text-gray-400 text-sm">{platform.followers} followers</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {platform.connected ? (
                      <span className="text-green-400 text-sm">Connected</span>
                    ) : (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => onNavigate('video-generator')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-left"
              >
                🎬 Create New Video
              </button>
              <button 
                onClick={() => onNavigate('image-generator')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-left"
              >
                🖼️ Generate Image
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-left">
                📅 Schedule Post
              </button>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg text-left">
                📊 View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
