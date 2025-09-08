import React, { useState } from 'react';

interface SocialStudioPageProps {
  onNavigate: (page: string) => void;
}

export const SocialStudioPage: React.FC<SocialStudioPageProps> = ({ onNavigate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('story');

  const templates = [
    { id: 'story', name: 'Instagram Story', size: '1080x1920', popular: true },
    { id: 'post', name: 'Instagram Post', size: '1080x1080', popular: true },
    { id: 'reel', name: 'Instagram Reel', size: '1080x1920', popular: false },
    { id: 'youtube-thumb', name: 'YouTube Thumbnail', size: '1280x720', popular: true }
  ];

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Social Studio</h1>
          <p className="text-gray-400">Create optimized content for every social platform</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Templates</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm opacity-75">{template.size}</div>
                    {template.popular && (
                      <div className="text-xs text-green-400 mt-1">Popular</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Canvas</h2>
              <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🎨</div>
                  <p>Design your content here</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Tools</h2>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-left">
                  Add Text
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg text-left">
                  Add Image
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg text-left">
                  Add Shape
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg text-left">
                  AI Enhance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
