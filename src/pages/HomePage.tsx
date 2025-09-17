import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Video, Wand2, Share2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for form inputs
  const [ideaInput, setIdeaInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [script, setScript] = useState("This is the one thing you're doing wrong with your marketing. You're focusing too much on features, and not enough on the story. People don't buy what you do, they buy why you do it. Start with why, and watch your brand grow.");
  const [voice, setVoice] = useState('Alloy (Warm, Natural)');
  const [music, setMusic] = useState('No Music');
  const [visualStyle, setVisualStyle] = useState('AI Generation');
  const [aiModel, setAiModel] = useState('Google VEO');
  const [visualPrompt, setVisualPrompt] = useState('');
  const [soundEffects, setSoundEffects] = useState('');
  const [selectedPresetStyle, setSelectedPresetStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'viral' | 'pixar'>('viral');

  // Button handlers
  const handleCreateVideoNow = () => {
    navigate('/video-generator');
  };

  const handleFindIdeas = async () => {
    if (!ideaInput.trim()) return;
    // Simulate API call
    alert(`Finding viral ideas for: "${ideaInput}"`);
  };

  const handleAnalyzeYoutube = async () => {
    if (!youtubeUrl.trim()) return;
    // Simulate API call
    alert(`Analyzing YouTube video: ${youtubeUrl}`);
  };

  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) return;
    // Simulate API call
    alert('Analyzing transcript for viral elements...');
  };

  const handleBrandKit = () => {
    alert('Opening Brand Kit...');
  };

  const handleRewrite = async () => {
    if (!script.trim()) return;
    setScript(script + ' [Rewritten for better engagement]');
  };

  const handleViralOptimizer = async () => {
    if (!script.trim()) return;
    setScript(script + ' [Optimized for viral potential]');
  };

  const handleEnhancePrompt = async () => {
    if (!visualPrompt.trim()) return;
    setVisualPrompt(visualPrompt + ', cinematic lighting, high quality, detailed');
  };

  const handleGenerateVideo = async () => {
    if (!script.trim()) {
      alert('Please write a script first!');
      return;
    }
    
    setIsGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false);
      alert('Video generated successfully! Check your creations.');
    }, 3000);
  };

  const handleImportCreation = () => {
    alert('Import creation functionality coming soon!');
  };

  const handleRemixImage = (imageId: number) => {
    navigate('/image-remix-studio');
  };

  const handleUseScript = (videoId: number) => {
    alert(`Using script from video ${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setMode('viral')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'viral' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Viral
              </button>
              <button
                onClick={() => setMode('pixar')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  mode === 'pixar' 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pixar
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {mode === 'viral' ? (
              <>
                Faceless AI Video{' '}
                <span className="gradient-text">Generator</span>
              </>
            ) : (
              <>
                AI Story{' '}
                <span className="gradient-text">Studio</span>
              </>
            )}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            {mode === 'viral' ? (
              'Turn your ideas into faceless videos effortlessly. Choose natural voices, let AI craft stunning visuals. Create short videos on any topic — no camera required.'
            ) : (
              'Create magical animated stories with AI. From script to stunning Pixar-style animation in minutes. Bring your imagination to life with cinematic storytelling.'
            )}
          </p>
          <button 
            onClick={handleCreateVideoNow}
            className="btn-primary text-lg px-8 py-4"
          >
            {mode === 'viral' ? 'Create Video Now' : 'Begin Your Story'}
          </button>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {mode === 'viral' ? 'How It Works' : 'How The Magic Happens'}
          </h2>
          <p className="text-gray-400 text-center mb-12">
            {mode === 'viral' 
              ? 'Create stunning videos in three simple steps.'
              : 'Create stunning videos in three simple steps.'
            }
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {mode === 'viral' ? '1. Write Your Script' : '1. Write Your Story'}
              </h3>
              <p className="text-gray-400">
                {mode === 'viral' 
                  ? 'Got a viral idea? Write a punchy, high-retention script, or let our AI generate one for you.'
                  : 'Start with a magical idea. Our AI helps you craft a heartwarming script perfect for an animated short.'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {mode === 'viral' ? '2. Choose Your Style' : '2. Choose Your Style'}
              </h3>
              <p className="text-gray-400">
                {mode === 'viral'
                  ? 'Pick a voice and music track. Then decide your visual style: AI-generated footage, stock videos, or kinetic typography.'
                  : 'Select a voice and music that fits your story\'s mood. Then choose how your story is animated - with AI characters, cinematic footage, or storyboard text.'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {mode === 'viral' ? '3. Generate & Share' : '3. Generate & Share'}
              </h3>
              <p className="text-gray-400">
                {mode === 'viral'
                  ? 'Hit generate and watch your video come together in moments. Download and post to your social channels.'
                  : 'Click generate and watch as our AI brings your story to life. Download your animated short and share your magic with the world.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Video Creation Workflow */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Creation Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">
              {mode === 'viral' 
                ? 'Start Creating Your Viral Video' 
                : 'Begin Your Magical Story'
              }
            </h2>
            
            {/* Step 1: Find Inspiration */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                {mode === 'viral' 
                  ? 'Find Inspiration (or bring your own)'
                  : 'Find a Spark of Inspiration'
                }
              </h3>
              <p className="text-gray-400 mb-4">
                {mode === 'viral'
                  ? "Don't know where to start? Enter a topic and our AI will find viral video ideas for you. Or, jump right in with your own script."
                  : "Every great story starts with an idea. Enter a topic and let our AI storyteller generate enchanting concepts for you."
                }
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">
                    {mode === 'viral' ? 'Find new ideas' : 'Find new ideas'}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={mode === 'viral' 
                        ? 'e.g., "life hacks for small apartments"'
                        : 'e.g., "a lonely robot who finds a friend"'
                      }
                      className="input-primary flex-1"
                      value={ideaInput}
                      onChange={(e) => setIdeaInput(e.target.value)}
                    />
                    <button 
                      onClick={handleFindIdeas}
                      className="btn-primary"
                    >
                      Find
                    </button>
                  </div>
                </div>
                
                <div className="text-center text-gray-500">OR</div>
                
                <div>
                  <label className="form-label">
                    {mode === 'viral' 
                      ? 'Deconstruct a YouTube video'
                      : 'Deconstruct a YouTube video'
                    }
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Paste a YouTube URL to analyze..."
                      className="input-primary flex-1"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                    />
                    <button 
                      onClick={handleAnalyzeYoutube}
                      className="btn-secondary"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">
                    {mode === 'viral'
                      ? 'Deconstruct a video transcript (from TikTok, IG, etc.)'
                      : 'Deconstruct a video transcript (from TikTok, IG, etc.)'
                    }
                  </label>
                  <textarea 
                    placeholder="Paste the full video script or transcript here..."
                    className="textarea-primary w-full h-24"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                  <button 
                    onClick={handleAnalyzeTranscript}
                    className="btn-secondary mt-2"
                  >
                    Analyze Transcript
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Write & Refine Script */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                {mode === 'viral' 
                  ? 'Write & Refine Your Script'
                  : 'Write Your Story'
                }
              </h3>
              <p className="text-gray-400 mb-4">
                {mode === 'viral'
                  ? 'Write your script or paste one in. Use our AI tools to rewrite it for better engagement or generate viral hooks and titles.'
                  : 'Write your script or use an AI-generated idea. Our tools will help you refine the narrative and prepare it for animation.'
                }
              </p>
              
              <div className="space-y-4">
                <button 
                  onClick={handleBrandKit}
                  className="btn-outline"
                >
                  Brand Kit
                </button>
                <textarea 
                  className="textarea-primary w-full h-32"
                  placeholder={mode === 'viral' 
                    ? 'Write your script here...'
                    : 'In a world made of gears and springs, a tiny clockwork mouse named Pip dreamed of the moon. They said it was just a light in the sky, but Pip knew it was a giant wheel of cheese, waiting for a brave adventurer.'
                  }
                  value={mode === 'pixar' && script === "This is the one thing you're doing wrong with your marketing. You're focusing too much on features, and not enough on the story. People don't buy what you do, they buy why you do it. Start with why, and watch your brand grow." 
                    ? 'In a world made of gears and springs, a tiny clockwork mouse named Pip dreamed of the moon. They said it was just a light in the sky, but Pip knew it was a giant wheel of cheese, waiting for a brave adventurer.'
                    : script
                  }
                  onChange={(e) => setScript(e.target.value)}
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleRewrite}
                    className="btn-secondary"
                  >
                    Rewrite
                  </button>
                  <button 
                    onClick={handleViralOptimizer}
                    className="btn-secondary"
                  >
                    {mode === 'viral' ? 'Viral Optimizer' : 'Viral Optimizer'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Voice</label>
                    <select 
                      className="input-primary w-full"
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                    >
                      <option>Alloy (Warm, Natural)</option>
                      <option>Echo (Clear, Crisp)</option>
                      <option>Fable (Storyteller)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Music</label>
                    <select 
                      className="input-primary w-full"
                      value={music}
                      onChange={(e) => setMusic(e.target.value)}
                    >
                      <option>No Music</option>
                      <option>Uplifting</option>
                      <option>Lo-fi Beat</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Choose Visual Style */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                {mode === 'viral' 
                  ? 'Choose Your Visual Style'
                  : 'Choose Your Animation Style'
                }
              </h3>
              <p className="text-gray-400 mb-4">
                {mode === 'viral'
                  ? 'Decide how your video will look. Use AI Generation for unique visuals, Stock Footage for a realistic feel, or Kinetic Text for dynamic typography.'
                  : 'Select how your story will be told. Use AI Generation to create unique characters and scenes, cinematic Stock Footage, or magical Kinetic Text.'
                }
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                <button 
                  onClick={() => setVisualStyle('AI Generation')}
                  className={`btn-outline p-4 text-center ${visualStyle === 'AI Generation' ? 'bg-green-500 text-white' : ''}`}
                >
                  <Video className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">AI Generation</div>
                </button>
                <button 
                  onClick={() => setVisualStyle('Storyboard')}
                  className={`btn-outline p-4 text-center ${visualStyle === 'Storyboard' ? 'bg-green-500 text-white' : ''}`}
                >
                  <div className="text-sm">Storyboard</div>
                </button>
                <button 
                  onClick={() => setVisualStyle('Stock Footage')}
                  className={`btn-outline p-4 text-center ${visualStyle === 'Stock Footage' ? 'bg-green-500 text-white' : ''}`}
                >
                  <div className="text-sm">Stock Footage</div>
                </button>
                <button 
                  onClick={() => setVisualStyle('Kinetic Text')}
                  className={`btn-outline p-4 text-center ${visualStyle === 'Kinetic Text' ? 'bg-green-500 text-white' : ''}`}
                >
                  <div className="text-sm">Kinetic Text</div>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">AI Model</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setAiModel('Google VEO')}
                      className={`flex-1 ${aiModel === 'Google VEO' ? 'btn-primary' : 'btn-outline'}`}
                    >
                      Google VEO (Fast & Reliable)
                    </button>
                    <button 
                      onClick={() => setAiModel('Luma Dream Machine')}
                      className={`flex-1 ${aiModel === 'Luma Dream Machine' ? 'btn-primary' : 'btn-outline'}`}
                    >
                      Luma Dream Machine (Cinematic & New)
                    </button>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Cost: 10 credits</div>
                </div>
                
                <div>
                  <label className="form-label">Preset Styles</label>
                  <div className="flex flex-wrap gap-2">
                    {['Cinematic', 'Anime', 'Vintage Film', 'Pixar', 'Claymation', 'Abstract'].map(style => (
                      <button 
                        key={style} 
                        onClick={() => setSelectedPresetStyle(selectedPresetStyle === style ? '' : style)}
                        className={`text-sm px-3 py-1 ${selectedPresetStyle === style ? 'btn-primary' : 'btn-outline'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Visual Prompt</label>
                  <textarea 
                    className="textarea-primary w-full h-20"
                    placeholder="e.g., A futuristic city at night, neon lights, flying cars..."
                    value={visualPrompt}
                    onChange={(e) => setVisualPrompt(e.target.value)}
                  />
                  <button 
                    onClick={handleEnhancePrompt}
                    className="btn-outline mt-2"
                  >
                    Enhance Prompt
                  </button>
                </div>
                
                <div>
                  <label className="form-label">Sound Effects (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., whoosh, click, gentle wind"
                    className="input-primary w-full"
                    value={soundEffects}
                    onChange={(e) => setSoundEffects(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={handleGenerateVideo}
                  disabled={isGenerating}
                  className="btn-primary w-full py-3 text-lg"
                >
                  {isGenerating ? 'Generating Video...' : 'Generate Video'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Video Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="card text-center">
              <div className="video-container mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Your video will appear here</h3>
              <p className="text-gray-400">
                Configure your video on the left and click "Generate" to see the magic happen.
              </p>
            </div>
          </div>
        </div>

        {/* Your Creations Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Creations</h2>
            <button 
              onClick={handleImportCreation}
              className="btn-primary"
            >
              Import Creation
            </button>
          </div>
          <p className="text-gray-400 mb-8">
            This is where your generated and imported creations will appear.
          </p>
          
          <div className="space-y-8">
            {/* Images Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Images</h3>
              <div className="gallery-grid">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="gallery-item aspect-square">
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">Image {i}</span>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <button 
                        onClick={() => handleRemixImage(i)}
                        className="btn-primary text-xs px-2 py-1"
                      >
                        Remix Image
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Videos Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Videos</h3>
              <div className="gallery-grid">
                {[1, 2, 3].map(i => (
                  <div key={i} className="gallery-item aspect-video">
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <button 
                        onClick={() => handleUseScript(i)}
                        className="btn-primary text-xs px-2 py-1"
                      >
                        Use Script
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

