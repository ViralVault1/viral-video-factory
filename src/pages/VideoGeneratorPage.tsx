import React, { useState } from 'react';
import { Play, Wand2, Copy, Download } from 'lucide-react';

interface VideoIdea {
  title: string;
  description: string;
}

interface Hook {
  type: string;
  text: string;
}

interface ViralResults {
  hooks: Hook[];
  titles: string[];
}

interface VideoResult {
  id: string;
  videoUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  script: string;
}

const VideoGeneratorPage: React.FC = () => {
  const [ideaInput, setIdeaInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [script, setScript] = useState('This is the one thing you\'re doing wrong with your marketing. You\'re focusing too much on features, and not enough on the story. People don\'t buy what you do, they buy why you do it. Start with why, and watch your brand grow.');
  const [voice, setVoice] = useState('Natural Female Voice');
  const [music, setMusic] = useState('Upbeat Corporate');
  const [presetStyle, setPresetStyle] = useState('Cinematic');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [soundEffects, setSoundEffects] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFindingIdeas, setIsFindingIdeas] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<VideoIdea[]>([]);
  const [generatedVideos, setGeneratedVideos] = useState<VideoResult[]>([]);
  const [showViralOptimizer, setShowViralOptimizer] = useState(false);
  const [viralResults, setViralResults] = useState<ViralResults>({
    hooks: [],
    titles: []
  });

  const VIDEO_WEBHOOK_URL = 'https://hook.eu2.make.com/pookemkmpmd4joku89ni436lsok6t7ev';

  const handleFindIdeas = async () => {
    if (!ideaInput.trim()) {
      alert('Please enter a topic to find ideas.');
      return;
    }

    setIsFindingIdeas(true);
    setGeneratedIdeas([]);

    setTimeout(() => {
      const mockIdeas: VideoIdea[] = [
        {
          title: `${ideaInput.charAt(0).toUpperCase() + ideaInput.slice(1)}: Expectation vs. REALITY (My house is a disaster!)`,
          description: `You think getting a new ${ideaInput} is all cuddles and cute naps? Think again! This video hilariously captures the unfiltered reality of bringing home a tiny furball, from chewed shoes to surprise potty breaks and zoomies at 3 AM. It's a relatable and funny ride for anyone who's survived ${ideaInput}hood or is contemplating it. Get ready for some honest, adorable chaos!`
        },
        {
          title: `Warning: Cuteness Overload! My New ${ideaInput.charAt(0).toUpperCase() + ideaInput.slice(1)}'s First Week Adventures`,
          description: `Prepare for an explosion of cuteness! Follow our new ${ideaInput} through their first week at home, showcasing all their adorable 'firsts': first nap in their new bed, first wobbly walk, first tiny bark, and endless cuddles. This heartwarming compilation is designed to melt hearts and is perfect for a feel-good moment. You'll want to watch it on repeat!`
        },
        {
          title: `${ideaInput.charAt(0).toUpperCase() + ideaInput.slice(1)} Crying At Night? This Sound Trick SAVED My Sleep! #${ideaInput.charAt(0).toUpperCase() + ideaInput.slice(1)}Hack`,
          description: `Is your new ${ideaInput} keeping you up all night with their crying? You're not alone! This quick video reveals a simple, game-changing trick using a specific sound that helped our ${ideaInput} settle down in their crate and sleep through the night. It's a must-watch for any new ${ideaInput} parent desperate for some peace and quiet. Tried, tested, and works like a charm!`
        }
      ];
      setGeneratedIdeas(mockIdeas);
      setIsFindingIdeas(false);
    }, 2000);
  };

  const handleAnalyzeUrl = async () => {
    if (!youtubeUrl.trim()) {
      alert('Please enter a YouTube URL to analyze.');
      return;
    }
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('Video analyzed! Key viral elements identified.');
    }, 2000);
  };

  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) {
      alert('Please enter a transcript to analyze.');
      return;
    }
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('Transcript analyzed for viral patterns!');
    }, 1500);
  };

  const handleViralOptimizer = () => {
    if (!script.trim()) {
      alert('Please enter a script first to optimize.');
      return;
    }

    const mockResults: ViralResults = {
      hooks: [
        {
          type: "Challenge & Curiosity Gap",
          text: "I dare you not to smile. Get ready for an explosion of cuteness as our new puppy experiences all their adorable 'firsts'!"
        },
        {
          type: "Emotional Connection & Direct Value Prop",
          text: "Prepare for a heartwarming overload! Follow our new puppy through their first week at home, filled with wobbly walks, tiny barks, and endless cuddles."
        },
        {
          type: "Intrigue & Emotional Benefit",
          text: "This video is scientifically proven to melt hearts. Witness the pure joy of our new puppy's very first week with us!"
        }
      ],
      titles: [
        "WARNING: Extreme Cuteness! Our Puppy's FIRST WEEK At Home",
        "You Won't Believe How Cute Our New Puppy's First Week Was!",
        "Heart-Melting Moments: Our Puppy's Adorable Firsts!"
      ]
    };

    setViralResults(mockResults);
    setShowViralOptimizer(true);
  };

  const handleUseHook = (hook: Hook) => {
    const lines = script.split('\n');
    lines[0] = `Hook: ${hook.text}`;
    setScript(lines.join('\n'));
    setShowViralOptimizer(false);
  };

  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    alert('Title copied to clipboard!');
  };

  const handleUseIdea = (idea: VideoIdea) => {
    const newScript = `Hook: ${idea.title}

Opening: ${idea.description.split('.')[0]}.

Main Content: ${idea.description.split('.').slice(1, -1).join('. ')}.

Call to Action: ${idea.description.split('.').slice(-1)[0]}`;

    setScript(newScript);
    
    setTimeout(() => {
      document.getElementById('script-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleGenerateVideo = async () => {
    if (!script.trim()) {
      alert('Please enter a script.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch(VIDEO_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: script,
          visualPrompt: visualPrompt || `${presetStyle} style scene`,
          presetStyle: presetStyle,
          requestId: `video_${Date.now()}`,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const result = await response.json();
      
      if (result.success && result.videoUrl) {
        const newVideo: VideoResult = {
          id: result.requestId || `video_${Date.now()}`,
          videoUrl: result.videoUrl,
          status: 'completed',
          createdAt: new Date().toISOString(),
          script: script
        };
        setGeneratedVideos(prev => [newVideo, ...prev]);
        alert('✅ Video generated successfully!');
      } else {
        alert('🎬 Video is generating! This takes 3-5 minutes. Check back soon.');
      }
      
    } catch (error) {
      console.error('Video generation failed:', error);
      alert(`❌ Failed: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Find Inspiration (or bring your own)
              </h2>
              <p className="text-gray-400 mb-4 text-sm">
                Don't know where to start? Enter a topic and our AI will find viral video ideas for you. Or, jump right in with your own script.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Find new ideas</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="new puppy"
                      value={ideaInput}
                      onChange={(e) => setIdeaInput(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleFindIdeas}
                      disabled={isFindingIdeas}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {isFindingIdeas ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        '⚙️'
                      )}
                      Find
                    </button>
                  </div>
                </div>

                <div className="text-center text-gray-500 text-sm">OR</div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deconstruct a YouTube video</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste a YouTube URL to analyze..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={handleAnalyzeUrl}
                      disabled={isAnalyzing}
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        '🔍'
                      )}
                      Analyze
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Deconstruct a video transcript (from TikTok, IG, etc.)</label>
                  <textarea
                    placeholder="Paste the full video script or transcript here..."
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  />
                  <button
                    onClick={handleAnalyzeTranscript}
                    disabled={isAnalyzing}
                    className="mt-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                        '✏️'
                    )}
                    Analyze Transcript
                  </button>
                </div>
              </div>

              {generatedIdeas.length > 0 && (
                <div className="mt-6 space-y-4">
                  {generatedIdeas.map((idea, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <h3 className="font-semibold text-white mb-2">{idea.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{idea.description}</p>
                      <button
                        onClick={() => handleUseIdea(idea)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
                      >
                        Use this idea
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div id="script-section" className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Write & Refine Your Script
                </h2>
                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  ✏️ Brand Kit
                </button>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Write your script or paste one in. Use our AI tools to rewrite it for better engagement or generate viral hooks and titles.
              </p>
              <textarea
                placeholder="Enter your video script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setScript(prev => prev)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-medium transition-colors flex items-center gap-2"
                >
                  ⚙️ Rewrite
                </button>
                <button
                  onClick={handleViralOptimizer}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors flex items-center gap-2"
                >
                  ✨ Viral Optimizer
                </button>
              </div>
            </div>

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

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🎨 Visual Settings</h3>
              <div className="space-y-4">
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
                ⏱️ Takes 3-5 minutes via Hunyuan AI
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🎥 Your Generated Videos</h2>
            <div className="text-sm text-gray-400">
              {generatedVideos.length} videos generated
            </div>
          </div>
          
          {generatedVideos.length === 0 ? (
            <div className="text-center py-12">
              <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No videos generated yet</h3>
              <p className="text-gray-500">
                Create your first video using the generator above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedVideos.map((video) => (
                <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="relative">
                    {video.imageUrl && (
                      <img 
                        src={video.imageUrl} 
                        alt="Video thumbnail"
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded">
                        {video.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {video.videoUrl && (
                        <button 
                          onClick={() => window.open(video.videoUrl, '_blank')}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Video
                        </button>
                      )}
                      {video.imageUrl && (
                        <button 
                          onClick={() => window.open(video.imageUrl, '_blank')}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Image
                        </button>
                      )}
                      {video.audioUrl && (
                        <button 
                          onClick={() => window.open(video.audioUrl, '_blank')}
                          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm flex items-center justify-center gap-1"
                        >
                          <Play className="w-3 h-3" />
                          Audio
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showViralOptimizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Viral Optimizer Results</h2>
                </div>
                <button
                  onClick={() => setShowViralOptimizer(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-400 mb-8 text-center">
                Here are some AI-powered variations to boost your video's performance.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Optimized Hooks</h3>
                  <div className="space-y-4">
                    {viralResults.hooks.map((hook: Hook, index: number) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <div className="text-purple-400 text-sm font-medium mb-2">{hook.type}</div>
                        <p className="text-gray-300 mb-3">"{hook.text}"</p>
                        <button
                          onClick={() => handleUseHook(hook)}
                          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-medium transition-colors"
                        >
                          ✓ Use This Hook
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Viral Titles</h3>
                  <div className="space-y-4">
                    {viralResults.titles.map((title: string, index: number) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                        <p className="text-gray-300 flex-1">{title}</p>
                        <button
                          onClick={() => handleCopyTitle(title)}
                          className="ml-3 p-2 text-gray-400 hover:text-white transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGeneratorPage;
