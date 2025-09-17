import React, { useState } from 'react';

export const AIInfluencerStudioPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    backstory: '',
    personalityTraits: '',
    visualStyle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('AI Influencer Name is required');
      return false;
    }
    if (!formData.backstory.trim()) {
      setError('Backstory is required');
      return false;
    }
    if (!formData.personalityTraits.trim()) {
      setError('Please select personality traits');
      return false;
    }
    if (!formData.visualStyle.trim()) {
      setError('Visual Style is required');
      return false;
    }
    return true;
  };

  const handleConfirmPersona = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(`AI Influencer "${formData.name}" has been created successfully! Your virtual personality is ready to start creating content.`);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          backstory: '',
          personalityTraits: '',
          visualStyle: ''
        });
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError('Failed to create AI Influencer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const personalityOptions = [
    'Select Personality Traits...',
    'Creative & Artistic',
    'Professional & Business-focused',
    'Fun & Energetic',
    'Calm & Mindful',
    'Tech-savvy & Innovative',
    'Fashion & Style-focused',
    'Fitness & Health-oriented',
    'Educational & Informative',
    'Humorous & Entertaining',
    'Inspirational & Motivational'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 mr-3 text-green-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold">AI Influencer Studio</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Your command center for creating, branding, and launching a virtual AI personality from scratch.
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-green-400">1. Define The Persona</h2>
              <p className="text-gray-400">
                This is the soul of your AI. Their personality will influence all the content they create.
              </p>
            </div>

            <div className="space-y-6">
              {/* AI Influencer Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  AI Influencer Name (e.g., "Aura")
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter a unique name for your AI influencer"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Backstory */}
              <div>
                <label htmlFor="backstory" className="block text-sm font-medium text-gray-300 mb-2">
                  Backstory (e.g., "A rogue AI from a distant star system who crash-landed on Earth and is now fascinated by human culture...")
                </label>
                <textarea
                  id="backstory"
                  value={formData.backstory}
                  onChange={(e) => handleInputChange('backstory', e.target.value)}
                  placeholder="Create an engaging backstory that will make your AI influencer memorable and relatable"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                />
              </div>

              {/* Personality Traits */}
              <div>
                <label htmlFor="personality" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Personality Traits...
                </label>
                <select
                  id="personality"
                  value={formData.personalityTraits}
                  onChange={(e) => handleInputChange('personalityTraits', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {personalityOptions.map((option, index) => (
                    <option 
                      key={index} 
                      value={index === 0 ? '' : option}
                      disabled={index === 0}
                      className={index === 0 ? 'text-gray-400' : 'text-white'}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visual Style */}
              <div>
                <label htmlFor="visualStyle" className="block text-sm font-medium text-gray-300 mb-2">
                  Visual Style (e.g., "A cyberpunk anime character with neon pink hair, holographic tattoos, and futuristic chrome clothing...")
                </label>
                <textarea
                  id="visualStyle"
                  value={formData.visualStyle}
                  onChange={(e) => handleInputChange('visualStyle', e.target.value)}
                  placeholder="Describe the visual appearance and style of your AI influencer in detail"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mt-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300">
                {success}
              </div>
            )}

            {/* Confirm Button */}
            <div className="mt-8">
              <button
                onClick={handleConfirmPersona}
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating AI Influencer...
                  </>
                ) : (
                  'Confirm Persona'
                )}
              </button>
            </div>
          </div>

          {/* Next Steps Preview */}
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">2</div>
                <div>
                  <div className="font-medium text-gray-300">Content Strategy Development</div>
                  <div>AI will analyze your persona and create a content strategy tailored to your influencer's personality</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">3</div>
                <div>
                  <div className="font-medium text-gray-300">Visual Asset Generation</div>
                  <div>Generate profile pictures, content images, and brand assets based on your visual style</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">4</div>
                <div>
                  <div className="font-medium text-gray-300">Content Creation & Launch</div>
                  <div>Start creating posts, videos, and engaging with your audience as your AI influencer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need inspiration? Check out our{' '}
              <a href="#" className="text-green-400 hover:text-green-300 underline">
                AI influencer creation guide
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">SOLUTIONS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/api" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">PRODUCTS</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/video-generator" className="hover:text-white">AI Video Generator</a></li>
                <li><a href="/auto-writer" className="hover:text-white">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">RESOURCES</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/guide" className="hover:text-white">User Guide</a></li>
                <li><a href="/blog" className="hover:text-white">Blog</a></li>
                <li><a href="/community" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">COMPANY</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-white font-semibold">Viral Video Factory</span>
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
