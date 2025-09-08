import React, { useState } from 'react';

export const VideoGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');

  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Faceless AI Video <span className="text-green-400">Generator</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Turn your ideas into faceless videos effortlessly. Choose natural voices, let AI craft
            stunning visuals. Create short videos on any topic — no camera required.
          </p>
          <button className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg">
            Create Video Now
          </button>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">How It Works</h2>
          <p className="text-gray-400 text-center mb-8">Create stunning videos in three simple steps.</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Write Your Script</h3>
              <p className="text-gray-400">
                Got a viral idea? Write a punchy, high-retention script, or let our AI generate one for you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Choose Your Style</h3>
              <p className="text-gray-400">
                Pick a voice and music track. Then decide your visual style: AI-generated footage, stock videos, or kinetic typography.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Generate & Share</h3>
              <p className="text-gray-400">
                Hit generate and watch your video come together in moments. Download and post to your social channels.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Start Creating Your Viral Video
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">
                  1. Find Inspiration (or bring your own)
                </h3>
                <p className="text-gray-400 mb-4">
                  Don't know where to start? Enter a topic and our AI will find viral video ideas for you. Or jump right in with your own script.
                </p>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mb-4">
                  Find new ideas
                </button>
                <div className="relative">
                  <input
                    type="text"
                    placeholder='e.g. "life hacks for small apartments"'
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
                  />
                  <button className="absolute right-2 top-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">
                    Find
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-full h-64 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🎬</div>
                  <p>Your video preview will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
