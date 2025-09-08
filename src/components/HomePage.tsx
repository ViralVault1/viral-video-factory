import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-6xl font-bold mb-6">
            Create Viral Videos with AI
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Generate engaging faceless videos in minutes. No filming, no editing skills required.
            Our AI handles everything from script to final video.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Start Creating Free
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Your Topic</h3>
              <p className="text-gray-400">Tell us what you want your video to be about</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Creates Content</h3>
              <p className="text-gray-400">Our AI generates script, visuals, and voiceover</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Download & Share</h3>
              <p className="text-gray-400">Get your video ready for all platforms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
