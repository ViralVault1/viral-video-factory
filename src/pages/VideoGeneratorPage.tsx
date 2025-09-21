import React, { useState } from 'react';
import { Play, Upload, FileText, Wand2, Download, Eye, Copy, Trash2 } from 'lucide-react';

const VideoGeneratorPage: React.FC = () => {
  const [ideaInput, setIdeaInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [script, setScript] = useState('This is the one thing you\'re doing wrong with your marketing. You\'re focusing too much on features, and not enough on the story. People don\'t buy what you do, they buy why you do it. Start with why, and watch your brand grow.');
  const [voice, setVoice] = useState('Natural Female Voice');
  const [music, setMusic] = useState('Upbeat Corporate');
  const [visualStyle, setVisualStyle] = useState('AI Generation');
  const [aiModel, setAiModel] = useState('Google VEO (Fast & Reliable)');
  const [presetStyle, setPresetStyle] = useState('Cinematic');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [soundEffects, setSoundEffects] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFindIdeas = () => {
    if (!ideaInput.trim()) {
      alert('Please enter a topic to find ideas.');
      return;
    }
    alert(`Finding viral video ideas for: "${ideaInput}"`);
  };

  const handleAnalyzeUrl = () => {
    if (!youtubeUrl.trim()) {
      alert('Please enter a YouTube URL to analyze.');
      return;
    }
    alert(`Analyzing YouTube video: ${youtubeUrl}`);
  };

  const handleAnalyzeTranscript = () => {
    if (!transcript.trim()) {
      alert('Please enter a transcript to analyze.');
      return;
    }
    alert('Analyzing transcript for viral elements...');
  };

  const handleGenerateVideo = () => {
    if (!script.trim()) {
      alert('Please enter a script to generate video.');
      return;
    }
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Video generated successfully! Check your creations below.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-8 border-b border-gray-700">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">AI Video Generator</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Create viral videos with AI. From script to final video, automate your entire video creation workflow.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input & Configuration */}
          <div className="space-y-6">
            {/* Find Ideas Section */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Find Viral Ideas
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your topic (e.g., 'productivity tips', 'cooking hacks')"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleFindIdeas}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  🔍 Find Ideas
                </button>
              </div>
            </div>

            {/* Analyze Existing Video */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Analyze Existing Video
              </h2>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Paste YouTube URL to analyze"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAnalyzeUrl}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                >
                  📊 Analyze Video
                </button>
              </div>
            </div>

            {/* Transcript Analysis */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Analyze Transcript
              </h2>
              <div className="space-y-4">
                <textarea
                  placeholder="Paste video transcript here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                />
                <button
                  onClick={handleAnalyzeTranscript}
                  className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition-colors"
                >
                  🎯 Analyze Transcript
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Video Generation */}
          <div className="space-y-6">
            {/* Script Input */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Video Script
              </h2>
              <textarea
                placeholder="Enter your video script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Voice & Audio Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🎤 Voice & Audio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Voice</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Natural Female Voice</option>
                    <option>Natural Male Voice</option>
                    <option>Professional Female</option>
                    <option>Professional Male</option>
                    <option>Energetic Female</option>
                    <option>Energetic Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background Music</label>
                  <select
                    value={music}
                    onChange={(e) => setMusic(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Upbeat Corporate</option>
                    <option>Chill Ambient</option>
                    <option>Energetic Pop</option>
                    <option>Dramatic Cinematic</option>
                    <option>No Music</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🎨 Visual Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Visual Style</label>
                    <select
                      value={visualStyle}
                      onChange={(e) => setVisualStyle(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>AI Generation</option>
                      <option>Stock Footage</option>
                      <option>Mixed Media</option>
                      <option>Animation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Model</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>Google VEO (Fast & Reliable)</option>
                      <option>Runway Gen-3 (High Quality)</option>
                      <option>Stable Video (Cost Effective)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preset Style</label>
                    <select
                      value={presetStyle}
                      onChange={(e) => setPresetStyle(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>Cinematic</option>
                      <option>Modern Corporate</option>
                      <option>Social Media</option>
                      <option>Educational</option>
                      <option>Entertainment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sound Effects</label>
                    <input
                      type="text"
                      placeholder="e.g., whoosh, click, applause"
                      value={soundEffects}
                      onChange={(e) => setSoundEffects(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visual Prompt (Optional)</label>
                  <textarea
                    placeholder="Describe the visual style you want (e.g., 'modern office setting with soft lighting')"
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6">
              <button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !script.trim()}
                className="w-full px-6 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    🎬 Generate Video
                  </>
                )}
              </button>
              <p className="text-center text-sm mt-2 text-white text-opacity-80">
                Estimated time: 2-5 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Generated Videos Section */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🎥 Your Generated Videos</h2>
            <div className="text-sm text-gray-400">
              0 videos generated
            </div>
          </div>
          
          <div className="text-center py-12">
            <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No videos generated yet</h3>
            <p className="text-gray-500">
              Create your first video using the generator above
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
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

export default VideoGeneratorPage;
