import React, { useState } from 'react';

export const SocialMediaSuitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const tabs = [
    { id: 'workflow', name: 'Workflow', icon: '⚡' },
    { id: 'strategy', name: 'Strategy', icon: '🎯' },
    { id: 'calendar', name: 'Calendar', icon: '📅' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'content', name: 'Content Library', icon: '📚' },
  ];

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedulePost = () => {
    if (!postContent.trim()) {
      alert('Please enter post content.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform.');
      return;
    }
    alert(`Post scheduled for ${selectedPlatforms.join(', ')} on ${scheduledDate} at ${scheduledTime}`);
  };

  const renderWorkflowTab = () => (
    <div className="space-y-8">
      {/* Post Creation */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Create New Post</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Post Content</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's happening? Share your thoughts..."
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-400">{postContent.length}/280 characters</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors">
                  AI Enhance
                </button>
                <button className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors">
                  Add Hashtags
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Platforms</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformToggle(platform.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedPlatforms.includes(platform.id)
                      ? `${platform.color} text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{platform.icon}</span>
                  <span>{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Schedule Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Schedule Time</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSchedulePost}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Schedule Post
            </button>
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              Post Now
            </button>
            <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <span className="text-2xl">🤖</span>
            <span className="text-sm">AI Content Ideas</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <span className="text-2xl">📈</span>
            <span className="text-sm">Trending Topics</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <span className="text-2xl">🎨</span>
            <span className="text-sm">Design Templates</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <span className="text-2xl">📊</span>
            <span className="text-sm">Performance Report</span>
          </button>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-white mb-2">
                    Just discovered this game-changing productivity tip! 🚀 Who else struggles with time management?
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📅 Today, 2:30 PM</span>
                    <span>🐦 Twitter</span>
                    <span>💼 LinkedIn</span>
                    <span>👍 24 likes</span>
                    <span>🔄 8 shares</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors">
                    Boost
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStrategyTab = () => (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Content Strategy Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🎯 Target Audience</h4>
            <p className="text-gray-400 text-sm">Tech professionals, entrepreneurs, and digital marketers aged 25-45</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📈 Growth Goals</h4>
            <p className="text-gray-400 text-sm">Increase engagement by 25% and followers by 15% this quarter</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">🗓️ Posting Schedule</h4>
            <p className="text-gray-400 text-sm">3 posts/day on Twitter, 1 post/day on LinkedIn, 5 posts/week on Instagram</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Content Pillars</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Educational Content', percentage: 40, color: 'bg-blue-500' },
            { title: 'Behind the Scenes', percentage: 25, color: 'bg-green-500' },
            { title: 'Industry News', percentage: 20, color: 'bg-purple-500' },
            { title: 'Personal Stories', percentage: 15, color: 'bg-yellow-500' },
          ].map((pillar) => (
            <div key={pillar.title} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{pillar.title}</h4>
                <span className="text-sm text-gray-400">{pillar.percentage}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`${pillar.color} h-2 rounded-full`} 
                  style={{ width: `${pillar.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCalendarTab = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Content Calendar</h3>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-400 py-2">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="aspect-square bg-gray-700 rounded-lg p-2 text-sm">
            <div className="text-gray-400">{((i % 31) + 1)}</div>
            {i % 7 === 1 && (
              <div className="mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full mb-1"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Scheduled Posts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Published Posts</span>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Followers', value: '12.5K', change: '+5.2%', color: 'text-green-400' },
          { title: 'Engagement Rate', value: '4.8%', change: '+1.2%', color: 'text-green-400' },
          { title: 'Reach', value: '45.2K', change: '+12.5%', color: 'text-green-400' },
          { title: 'Clicks', value: '1.2K', change: '-2.1%', color: 'text-red-400' },
        ].map((metric) => (
          <div key={metric.title} className="bg-gray-800 rounded-lg p-6">
            <h4 className="text-gray-400 text-sm mb-2">{metric.title}</h4>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className={`text-sm ${metric.color}`}>{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Platform Performance</h3>
        <div className="space-y-4">
          {platforms.slice(0, 4).map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-xl">{platform.icon}</span>
                <span className="font-semibold">{platform.name}</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-gray-400">Followers</div>
                  <div className="font-semibold">{Math.floor(Math.random() * 10000) + 1000}</div>
                </div>
                <div>
                  <div className="text-gray-400">Engagement</div>
                  <div className="font-semibold">{(Math.random() * 10).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-400">Reach</div>
                  <div className="font-semibold">{Math.floor(Math.random() * 50000) + 5000}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Content Library</h3>
          <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            Upload Content
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-4">
              <div className="aspect-square bg-gray-600 rounded mb-3 flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <div className="text-sm text-gray-400">Image {i + 1}</div>
              <div className="flex gap-1 mt-2">
                <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors">
                  Use
                </button>
                <button className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">📱 Social Media Suite</h1>
          <p className="text-gray-400 text-lg">
            Manage all your social media platforms from one powerful dashboard. Create, schedule, and analyze your content.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'workflow' && renderWorkflowTab()}
          {activeTab === 'strategy' && renderStrategyTab()}
          {activeTab === 'calendar' && renderCalendarTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'content' && renderContentTab()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Video Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded mr-2"></div>
              <span className="font-semibold">Viral Video Factory</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Viral Video Factory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
