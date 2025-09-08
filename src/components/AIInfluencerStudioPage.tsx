import React, { useState } from 'react';

interface AIInfluencerStudioPageProps {
  onNavigate: (page: string) => void;
}

export const AIInfluencerStudioPage: React.FC<AIInfluencerStudioPageProps> = ({ onNavigate }) => {
  const [selectedPersona, setSelectedPersona] = useState('tech');
  const [contentType, setContentType] = useState('post');

  const personas = [
    { id: 'tech', name: 'Tech Guru', description: 'Expert in technology and gadgets', avatar: '🤖' },
    { id: 'fitness', name: 'Fitness Coach', description: 'Health and wellness expert', avatar: '💪' },
    { id: 'lifestyle', name: 'Lifestyle Blogger', description: 'Fashion and lifestyle content', avatar: '✨' },
    { id: 'business', name: 'Business Expert', description: 'Entrepreneurship and business tips', avatar: '💼' }
  ];

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">AI Influencer Studio</h1>
          <p className="text-gray-400">Create content with AI-powered influencer personas</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Choose Persona</h2>
            <div className="space-y-3">
              {personas.map((persona) => (
                <label key={persona.id} className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
                  <input
                    type="radio"
                    name="persona"
                    value={persona.id}
                    checked={selectedPersona === persona.id}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{persona.avatar}</span>
                    <div>
                      <div className="text-white font-medium">{persona.name}</div>
                      <div className="text-gray-400 text-sm">{persona.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Content Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="post">Social Post</option>
                  <option value="video">Video Script</option>
                  <option value="story">Story Content</option>
                  <option value="caption">Photo Caption</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="What should the content be about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white">
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg">
                Generate Content
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Generated Content</h2>
            <div className="bg-gray-800 rounded-lg p-4 min-h-48 flex items-center justify-center">
              <p className="text-gray-400 text-center">Generated content will appear here</p>
            </div>
            
            <div className="mt-4 space-y-2">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                Copy Content
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                Create Visual
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
