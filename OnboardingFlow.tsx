import React, { useState } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    contentType: '',
    voicePreference: 'alloy',
    videoStyle: 'professional',
    targetAudience: '',
  });

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Viral Video Factory',
      description: 'Create engaging faceless videos with AI in minutes',
      component: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get you started!</h2>
            <p className="text-gray-600">We'll help you create your first viral video in just a few steps.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-900">1. Choose Topic</div>
              <div className="text-blue-700">Pick your content theme</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-900">2. AI Generation</div>
              <div className="text-green-700">Let AI create your video</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-900">3. Share & Earn</div>
              <div className="text-purple-700">Publish and go viral</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'content-type',
      title: 'What type of content do you want to create?',
      description: 'This helps us customize the experience for you',
      component: (
        <div className="space-y-4">
          {[
            { id: 'educational', label: 'Educational Content', desc: 'Tutorials, how-tos, explanations', icon: '🎓' },
            { id: 'entertainment', label: 'Entertainment', desc: 'Fun facts, stories, viral content', icon: '🎬' },
            { id: 'business', label: 'Business & Marketing', desc: 'Product demos, company updates', icon: '💼' },
            { id: 'lifestyle', label: 'Lifestyle & Health', desc: 'Tips, advice, wellness content', icon: '🌟' },
            { id: 'news', label: 'News & Commentary', desc: 'Current events, analysis', icon: '📰' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setUserPreferences(prev => ({ ...prev, contentType: type.id }))}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                userPreferences.contentType === type.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'voice-preference',
      title: 'Choose your preferred voice',
      description: 'Select the voice that will narrate your videos',
      component: (
        <div className="space-y-4">
          {[
            { id: 'alloy', label: 'Alloy', desc: 'Neutral, professional tone' },
            { id: 'echo', label: 'Echo', desc: 'Warm, friendly voice' },
            { id: 'fable', label: 'Fable', desc: 'Storytelling, engaging' },
            { id: 'onyx', label: 'Onyx', desc: 'Deep, authoritative' },
            { id: 'nova', label: 'Nova', desc: 'Energetic, youthful' },
            { id: 'shimmer', label: 'Shimmer', desc: 'Clear, articulate' },
          ].map((voice) => (
            <button
              key={voice.id}
              onClick={() => setUserPreferences(prev => ({ ...prev, voicePreference: voice.id }))}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                userPreferences.voicePreference === voice.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{voice.label}</div>
                  <div className="text-sm text-gray-600">{voice.desc}</div>
                </div>
                <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                  Preview
                </button>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'video-style',
      title: 'What style fits your brand?',
      description: 'Choose the visual style for your videos',
      component: (
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'professional', label: 'Professional', desc: 'Clean, corporate look' },
            { id: 'creative', label: 'Creative', desc: 'Artistic, unique style' },
            { id: 'minimal', label: 'Minimal', desc: 'Simple, focused design' },
            { id: 'dynamic', label: 'Dynamic', desc: 'Energetic, fast-paced' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setUserPreferences(prev => ({ ...prev, videoStyle: style.id }))}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                userPreferences.videoStyle === style.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{style.label}</div>
              <div className="text-sm text-gray-600 mt-1">{style.desc}</div>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      description: 'Ready to create your first viral video',
      component: (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect!</h2>
            <p className="text-gray-600">Your preferences have been saved. Let's create your first video!</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Tips for Success:</h3>
            <ul className="text-sm text-gray-700 space-y-1 text-left">
              <li>• Start with trending topics in your niche</li>
              <li>• Keep videos under 60 seconds for maximum engagement</li>
              <li>• Use eye-catching thumbnails and titles</li>
              <li>• Post consistently for best results</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
      localStorage.setItem('onboardingCompleted', 'true');
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'content-type':
        return userPreferences.contentType !== '';
      case 'voice-preference':
        return userPreferences.voicePreference !== '';
      case 'video-style':
        return userPreferences.videoStyle !== '';
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-gray-600 mb-6">
            {steps[currentStep].description}
          </p>
          {steps[currentStep].component}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

