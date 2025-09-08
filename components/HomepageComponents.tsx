import React from 'react';

export const Hero: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => (
  <div className="text-center py-20 px-4">
    <h1 className="text-5xl font-bold text-white mb-8">Create Viral Videos with AI</h1>
    <p className="text-xl text-gray-400 mb-8">Generate engaging faceless videos in minutes. No filming needed.</p>
    <button onClick={onCTAClick} className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
      Start Creating
    </button>
  </div>
);

export const HowItWorks: React.FC = () => (
  <div className="py-20 bg-gray-800 px-4">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">1</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Enter Topic</h3>
          <p className="text-gray-400">Describe what you want your video to be about</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">2</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Generates</h3>
          <p className="text-gray-400">Our AI creates script, visuals, and voiceover</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">3</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Download & Share</h3>
          <p className="text-gray-400">Get your video and share it across platforms</p>
        </div>
      </div>
    </div>
  </div>
);

export const Showcase: React.FC = () => (
  <div className="py-20 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-12">Trusted by Creators</h2>
      <p className="text-gray-400">Join thousands of content creators using our platform</p>
    </div>
  </div>
);

export const FAQ: React.FC = () => (
  <div className="py-20 bg-gray-800 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-6">
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">How does the AI video generation work?</h3>
          <p className="text-gray-300">Our AI analyzes your topic and creates a complete video with script, visuals, and voiceover automatically.</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-2">Can I customize the generated videos?</h3>
          <p className="text-gray-300">Yes, you can edit scripts, change voices, swap visuals, and adjust all aspects of your video.</p>
        </div>
      </div>
    </div>
  </div>
);

export const GeneratorWorkflow: React.FC<{ onNavigate: any; initialScript?: any }> = ({ initialScript }) => (
  <div id="generator-workflow" className="py-20 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Video Generator</h2>
      <div className="bg-gray-800 p-8 rounded-lg">
        <p className="text-gray-300 text-center mb-6">Enter your topic to generate a viral video</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="What do you want your video to be about?"
            className="w-full p-4 bg-gray-900 border border-gray-600 rounded-lg text-white"
            defaultValue={initialScript || ''}
          />
          <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Generate Video
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const CreationsGallery: React.FC<{ onNavigate: any }> = () => (
  <div className="py-20 bg-gray-800 px-4">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-12">Recent Creations</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-700 rounded-lg p-4">
            <div className="aspect-video bg-gray-600 rounded mb-4"></div>
            <h3 className="text-white font-semibold">Sample Video {i}</h3>
            <p className="text-gray-400 text-sm">Created with AI</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const VideoShowcase: React.FC<{ onNavigate: any }> = () => (
  <div className="py-20 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-12">Video Showcase</h2>
      <p className="text-gray-400">See what our users have created</p>
    </div>
  </div>
);
