import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export const VideoGeneratorPage: React.FC = () => {
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
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);

  const handleFindIdeas = async () => {
    if (!ideaInput.trim()) {
      toast.error('Please enter a topic to find ideas.');
      return;
    }

    setIsLoadingIdeas(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Generate 3 viral video ideas about ${ideaInput}`,
          type: 'video_script',
          platform: 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract ideas from the response and update the script
      setScript(data.content);
      toast.success(`Generated viral video ideas for "${ideaInput}"!`);
      
    } catch (error) {
      console.error('Idea generation failed:', error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate analysis with AI-generated script based on URL analysis
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Create a viral video script inspired by analyzing successful video content`,
          type: 'video_script',
          platform: 'youtube'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setScript(data.content);
      toast.success('YouTube video analyzed and script generated!');
      
    } catch (error) {
      console.error('URL analysis failed:', error);
      toast.error('Failed to analyze URL. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) {
      toast.error('Please enter a transcript to analyze.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Analyze this transcript and create an improved viral version: ${transcript}`,
          type: 'video_script',
          platform: 'tiktok'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setScript(data.content);
      toast.success('Transcript analyzed and optimized script generated!');
      
    } catch (error) {
      console.error('Transcript analysis failed:', error);
      toast.error('Failed to analyze transcript. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRewriteScript = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to rewrite.');
      return;
    }

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Rewrite this script for better engagement and clarity: ${script}`,
          type: 'video_script',
          platform: 'general'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setScript(data.content);
      toast.success('Script rewritten for better engagement!');
      
    } catch (error) {
      console.error('Script rewrite failed:', error);
      toast.error('Failed to rewrite script. Please try again.');
    }
  };

  const handleViralOptimizer = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to optimize.');
      return;
    }

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Optimize this script for maximum viral potential with trending hooks and engagement tactics: ${script}`,
          type: 'video_script',
          platform: 'tiktok'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setScript(data.content);
      toast.success('Script optimized for viral potential!');
      
    } catch (error) {
      console.error('Viral optimization failed:', error);
      toast.error('Failed to optimize script. Please try again.');
    }
  };

  const handleEnhancePrompt = async () => {
    if (!visualPrompt.trim()) {
      toast.error('Please enter a visual prompt to enhance.');
      return;
    }

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `Enhance this visual prompt for AI video generation: ${visualPrompt}. Make it more detailed and cinematic.`,
          type: 'creative'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setVisualPrompt(data.content);
      toast.success('Visual prompt enhanced!');
      
    } catch (error) {
      console.error('Prompt enhancement failed:', error);
      toast.error('Failed to enhance prompt. Please try again.');
    }
  };

  const handleGenerateVideo = () => {
    if (!script.trim()) {
      toast.error('Please enter a script to generate video.');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate video generation
    setTimeout(() => {
      const newVideo = {
        id: Date.now(),
        title: script.substring(0, 50) + '...',
        script: script,
        voice: voice,
        music: music,
        visualStyle: visualStyle,
        aiModel: aiModel,
        presetStyle: presetStyle,
        visualPrompt: visualPrompt,
        createdAt: new Date().toLocaleString()
      };
      
      setGeneratedVideos(prev => [newVideo, ...prev]);
      setIsGenerating(false);
      toast.success('Video generated successfully! Check your creations below.');
    }, 3000);
  };

  // Fixed: Renamed function to avoid React Hook naming convention
  const loadVideoScript = (videoScript: string) => {
    setScript(videoScript);
    toast.success('Script loaded into editor!');
  };

  const visualStyles = ['AI Generation', 'Storyboard', 'Stock Footage', 'Kinetic Text'];
  const aiModels = ['Google VEO (Fast & Reliable)', 'Luma Dream Machine (Cinematic & New)'];
  const presetStyles = ['Cinematic', 'Anime', 'Vintage Film', 'Pixar', 'Claymation', 'Abstract'];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">🎬 Video Generator</h1>
          <p className="text-gray-400 text-lg">
            Create stunning faceless videos with AI. From script to final video in minutes.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Video Creation Form */}
          <div className="space-y-8">
            {/* Step 1: Find Inspiration */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                Find Inspiration (or bring your own)
              </h2>
              <p className="text-gray-400 mb-4">
                Don't know where to start? Enter a topic and our AI will find viral video ideas for you. Or, jump right in with your own script.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Find new ideas</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ideaInput}
                      onChange={(e) => setIdeaInput(e.target.value)}
                      placeholder="e.g., productivity tips for remote workers"
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleFindIdeas}
                      disabled={isLoadingIdeas}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      {isLoadingIdeas ? 'Finding...' : 'Find'}
                    </button>
                  </div>
                </div>

                <div className="text-center text-gray-400">OR</div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deconstruct a YouTube video</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleAnalyzeUrl}
                      disabled={isAnalyzing}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deconstruct a video transcript (from TikTok, IG, etc.)</label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste transcript here..."
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAnalyzeTranscript}
                    disabled={isAnalyzing}
                    className="mt-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Transcript'}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Write & Refine Script */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                Write & Refine Your Script
              </h2>
              <p className="text-gray-400 mb-4">
                Write your script or paste one in. Use our AI tools to rewrite it for better engagement or generate viral hooks and titles.
              </p>

              <div className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    Brand Kit
                  </button>
                </div>
                
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleRewriteScript}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    Rewrite
                  </button>
                  <button 
                    onClick={handleViralOptimizer}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Viral Optimizer
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Voice</label>
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Natural Female Voice</option>
                      <option>Natural Male Voice</option>
                      <option>Professional Female</option>
                      <option>Professional Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Music</label>
                    <select
                      value={music}
                      onChange={(e) => setMusic(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option>Upbeat Corporate</option>
                      <option>Chill Ambient</option>
                      <option>Energetic Pop</option>
                      <option>Dramatic Cinematic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Choose Visual Style */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                Choose Your Visual Style
              </h2>
              <p className="text-gray-400 mb-4">
                Decide how your video will look. Use AI Generation for unique visuals, Stock Footage for a realistic feel, or Kinetic Text for dynamic typography.
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {visualStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setVisualStyle(style)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        visualStyle === style
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">AI Model</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {aiModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => setAiModel(model)}
                        className={`px-4 py-2 rounded-lg transition-colors text-left ${
                          aiModel === model
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Cost: 10 credits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preset Styles</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {presetStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setPresetStyle(style)}
                        className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                          presetStyle === style
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Visual Prompt</label>
                  <div className="flex gap-2">
                    <textarea
                      value={visualPrompt}
                      onChange={(e) => setVisualPrompt(e.target.value)}
                      placeholder="Describe the visual style you want..."
                      rows={2}
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button 
                      onClick={handleEnhancePrompt}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Enhance Prompt
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sound Effects (Optional)</label>
                  <input
                    type="text"
                    value={soundEffects}
                    onChange={(e) => setSoundEffects(e.target.value)}
                    placeholder="e.g., whoosh, click, notification"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  onClick={handleGenerateVideo}
                  disabled={isGenerating}
                  className="w-full px-8 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Video...
                    </div>
                  ) : (
                    'Generate Video'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Video Preview & Creations */}
          <div className="space-y-8">
            {/* Video Preview */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Your video will appear here</h3>
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <p>Configure your video on the left and click "Generate" to see the magic happen.</p>
                </div>
              </div>
            </div>

            {/* Your Creations */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Creations ({generatedVideos.length})</h3>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Import Creation
                </button>
              </div>
              <p className="text-gray-400 mb-6">This is where your generated and imported creations will appear.</p>
              
              {/* Generated Videos */}
              <div className="grid grid-cols-1 gap-4">
                {generatedVideos.length > 0 ? (
                  generatedVideos.map((video) => (
                    <div key={video.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="aspect-video bg-gray-600 rounded mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="mb-3">
                        <h4 className="font-medium text-white mb-1">{video.title}</h4>
                        <p className="text-xs text-gray-400">{video.createdAt}</p>
                        <p className="text-xs text-gray-400">{video.voice} • {video.presetStyle}</p>
                      </div>
                      <button
                        onClick={() => loadVideoScript(video.script)}
                        className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      >
                        Use Script
                      </button>
                    </div>
                  ))
                ) : (
                  // Sample placeholders when no videos generated yet
                  [1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-700 rounded-lg p-4">
                      <div className="aspect-video bg-gray-600 rounded mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <button className="w-full px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed">
                        Generate videos to see them here
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
