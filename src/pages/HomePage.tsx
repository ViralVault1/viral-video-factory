import React, { useState, useEffect } from 'react';
import { Sparkles, Video, Wand2, Share2, Download, Play, Loader } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [ideaInput, setIdeaInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [script, setScript] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [music, setMusic] = useState('none');
  const [visualStyle, setVisualStyle] = useState('ai-generation');
  const [aiModel, setAiModel] = useState('byteplus-seedance');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [selectedPresetStyle, setSelectedPresetStyle] = useState('');
  const [mode, setMode] = useState('viral');
  
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [isAnalyzingYoutube, setIsAnalyzingYoutube] = useState(false);
  const [isAnalyzingTranscript, setIsAnalyzingTranscript] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [savedCreations, setSavedCreations] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicFromUrl = params.get('topic');
    if (topicFromUrl) {
      setScript(topicFromUrl);
    }
  }, []);

  const handleFindIdeas = async () => {
    if (!ideaInput.trim()) return;
    
    setIsGeneratingIdeas(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 3 viral video ideas about "${ideaInput}". For each idea, provide a complete 30-second script that is engaging and optimized for social media. Format as a numbered list.`,
          type: 'video-ideas'
        })
      });
      
      const data = await response.json();
      setScript(data.content || data);
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Failed to generate ideas. Please try again.');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleAnalyzeYoutube = async () => {
    if (!youtubeUrl.trim()) return;
    
    setIsAnalyzingYoutube(true);
    try {
      const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      
      const response = await fetch('/api/analyze-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      });
      
      const data = await response.json();
      setTranscript(data.transcript);
      setScript(data.optimizedScript || data.transcript);
    } catch (error) {
      console.error('Error analyzing YouTube video:', error);
      alert('Failed to analyze video. Make sure the URL is valid and the video has captions.');
    } finally {
      setIsAnalyzingYoutube(false);
    }
  };

  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) return;
    
    setIsAnalyzingTranscript(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze this video transcript and extract the key viral elements, hooks, and storytelling structure. Then rewrite it as an optimized 30-60 second script:\n\n${transcript}`,
          type: 'transcript-analysis'
        })
      });
      
      const data = await response.json();
      setScript(data.content || data);
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      alert('Failed to analyze transcript. Please try again.');
    } finally {
      setIsAnalyzingTranscript(false);
    }
  };

  const handleRewrite = async () => {
    if (!script.trim()) return;
    
    setIsRewriting(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Rewrite this script to be more engaging and compelling. Keep the same message but make it punchier and more viral-worthy:\n\n${script}`,
          type: 'script-rewrite'
        })
      });
      
      const data = await response.json();
      setScript(data.content || data);
    } catch (error) {
      console.error('Error rewriting script:', error);
      alert('Failed to rewrite script. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleViralOptimizer = async () => {
    if (!script.trim()) return;
    
    setIsOptimizing(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Optimize this script for maximum viral potential. Add powerful hooks, create curiosity gaps, and structure it for high retention. Keep it under 60 seconds:\n\n${script}`,
          type: 'viral-optimization'
        })
      });
      
      const data = await response.json();
      setScript(data.content || data);
    } catch (error) {
      console.error('Error optimizing script:', error);
      alert('Failed to optimize script. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!script.trim()) {
      alert('Please write a script first!');
      return;
    }
    
    setIsGeneratingVideo(true);
    setGenerationProgress(0);
    setGenerationStatus('Preparing your video...');
    setGeneratedVideoUrl('');
    
    try {
      setGenerationStatus('Creating visual descriptions...');
      setGenerationProgress(20);
      
      const promptResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Convert this script into a detailed visual prompt for video generation. Describe the scenes, mood, style, and visual elements. Make it cinematic and engaging:\n\n${script}\n\nPreset style: ${selectedPresetStyle || 'cinematic'}\nAdditional notes: ${visualPrompt}`,
          type: 'visual-prompt'
        })
      });
      
      const promptData = await promptResponse.json();
      const enhancedPrompt = promptData.content || promptData;
      
      setGenerationStatus('Generating your video with AI...');
      setGenerationProgress(40);
      
      const videoResponse = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script,
          visualPrompt: enhancedPrompt,
          voice,
          music,
          style: selectedPresetStyle || 'cinematic',
          model: aiModel
        })
      });
      
      const videoData = await videoResponse.json();
      
      setGenerationStatus('Rendering your video...');
      setGenerationProgress(60);
      
      let videoUrl = videoData.videoUrl;
      let attempts = 0;
      const maxAttempts = 30;
      
      while (!videoUrl && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`/api/video-status/${videoData.jobId}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          videoUrl = statusData.videoUrl;
          break;
        }
        
        setGenerationProgress(60 + (attempts / maxAttempts) * 30);
        attempts++;
      }
      
      if (!videoUrl) {
        throw new Error('Video generation timed out');
      }
      
      setGenerationStatus('Finalizing...');
      setGenerationProgress(95);
      
      const newCreation = {
        id: Date.now(),
        type: 'video',
        url: videoUrl,
        script,
        timestamp: new Date().toISOString()
      };
      
      setSavedCreations(prev => [newCreation, ...prev]);
      
      setGeneratedVideoUrl(videoUrl);
      setGenerationProgress(100);
      setGenerationStatus('Video ready!');
      
    } catch (error) {
      console.error('Error generating video:', error);
      setGenerationStatus('Failed to generate video');
      alert('Failed to generate video. Please try again or contact support.');
    } finally {
      setTimeout(() => {
        setIsGeneratingVideo(false);
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 2000);
    }
  };

  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = `video-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setMode('viral')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'viral' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Viral
              </button>
              <button
                onClick={() => setMode('pixar')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'pixar' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Pixar
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {mode === 'viral' ? (
              <>Faceless AI Video <span className="text-green-500">Generator</span></>
            ) : (
              <>AI Story <span className="text-green-500">Studio</span></>
            )}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            {mode === 'viral' 
              ? 'Turn your ideas into faceless videos effortlessly. Choose natural voices, let AI craft stunning visuals.'
              : 'Create magical animated stories with AI. From script to stunning Pixar-style animation in minutes.'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Find Inspiration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Find new ideas</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder='e.g., "life hacks for small apartments"'
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={ideaInput}
                      onChange={(e) => setIdeaInput(e.target.value)}
                    />
                    <button 
                      onClick={handleFindIdeas}
                      disabled={isGeneratingIdeas}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {isGeneratingIdeas ? <Loader className="w-5 h-5 animate-spin" /> : 'Find'}
                    </button>
                  </div>
                </div>
                
                <div className="text-center text-gray-500">OR</div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Analyze YouTube video</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Paste YouTube URL..."
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button 
                      onClick={handleAnalyzeYoutube}
                      disabled={isAnalyzingYoutube}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {isAnalyzingYoutube ? <Loader className="w-5 h-5 animate-spin" /> : 'Analyze'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Or paste a transcript</label>
                  <textarea 
                    placeholder="Paste transcript here..."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                  <button 
                    onClick={handleAnalyzeTranscript}
                    disabled={isAnalyzingTranscript}
                    className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isAnalyzingTranscript ? <Loader className="w-5 h-5 animate-spin" /> : 'Analyze Transcript'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                Write Your Script
              </h3>
              
              <div className="space-y-4">
                <textarea 
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 h-32"
                  placeholder="Write your script here..."
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleRewrite}
                    disabled={isRewriting}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isRewriting ? <Loader className="w-4 h-4 animate-spin" /> : 'Rewrite'}
                  </button>
                  <button 
                    onClick={handleViralOptimizer}
                    disabled={isOptimizing}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isOptimizing ? <Loader className="w-4 h-4 animate-spin" /> : 'Viral Optimizer'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Voice</label>
                    <select 
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                    >
                      <option value="alloy">Alloy (Warm)</option>
                      <option value="echo">Echo (Clear)</option>
                      <option value="fable">Fable (Storyteller)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Music</label>
                    <select 
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={music}
                      onChange={(e) => setMusic(e.target.value)}
                    >
                      <option value="none">No Music</option>
                      <option value="uplifting">Uplifting</option>
                      <option value="lofi">Lo-fi Beat</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Choose Visual Style
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Preset Styles</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cinematic', 'Anime', 'Vintage Film', 'Pixar', 'Claymation', 'Abstract'].map(style => (
                      <button 
                        key={style} 
                        onClick={() => setSelectedPresetStyle(selectedPresetStyle === style ? '' : style)}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                          selectedPresetStyle === style 
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
                  <label className="block text-sm font-medium mb-2">Visual Prompt (Optional)</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
                    placeholder="e.g., futuristic city, neon lights..."
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !script.trim()}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors text-lg"
                >
                  {isGeneratingVideo ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    'Generate Video'
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-gray-800 rounded-lg p-6">
              {generatedVideoUrl ? (
                <div className="space-y-4">
                  <video 
                    src={generatedVideoUrl} 
                    controls 
                    className="w-full rounded-lg"
                  />
                  <button 
                    onClick={handleDownloadVideo}
                    className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </button>
                </div>
              ) : isGeneratingVideo ? (
                <div className="text-center py-12">
                  <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">{generationStatus}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{generationProgress}% complete</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your video will appear here</h3>
                  <p className="text-gray-400">
                    Configure your video and click Generate to see the magic happen.
                  </p>
                </div>
              )}
            </div>

            {savedCreations.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Creations</h3>
                <div className="space-y-2">
                  {savedCreations.slice(0, 3).map(creation => (
                    <div key={creation.id} className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg">
                      <Video className="w-8 h-8 text-green-500" />
                      <div className="flex-1 text-sm truncate">{creation.script.slice(0, 40)}...</div>
                      <button className="text-green-500 hover:text-green-400">
                        <Play className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
