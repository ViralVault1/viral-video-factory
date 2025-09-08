import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { Sidebar } from './components/Sidebar';
import { VideoGenerator } from './components/VideoGenerator';
import { AIAgentsHub } from './components/AIAgentsHub';
import { AuthPage } from './components/AuthPage';
import { ProductAdStudioPage } from './components/ProductAdStudioPage';
import { LicenseGeneratorPage } from './components/LicenseGeneratorPage';
import { ImageGeneratorPage } from './components/ImageGeneratorPage';
import { SocialMediaSuitePage } from './components/SocialMediaSuitePage';
import { SocialStudioPage } from './components/SocialStudioPage';
import { AIInfluencerStudioPage } from './components/AIInfluencerStudioPage';

function App() {
  const [currentPage, setCurrentPage] = useState('video-generator');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <HomePage />;
      case 'home':
        return <HomePage />;
      case 'video-generator':
        return <VideoGenerator />;
      case 'social-media-suite':
        return <SocialMediaSuitePage onNavigate={handleNavigate} />;
      case 'social-studio':
        return <SocialStudioPage onNavigate={handleNavigate} />;
      case 'ai-influencer-studio':
        return <AIInfluencerStudioPage onNavigate={handleNavigate} />;
      case 'product-ad-studio':
        return <ProductAdStudioPage onNavigate={handleNavigate} />;
      case 'image-generator':
        return <ImageGeneratorPage onNavigate={handleNavigate} />;
      case 'ai-agents':
        return <AIAgentsHub onNavigate={handleNavigate} />;
      case 'license-generator':
        return <LicenseGeneratorPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'pricing':
        return (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Pricing Plans</h1>
                <p className="text-gray-400">Choose the plan that works for you</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-700 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Starter</h3>
                  <p className="text-3xl font-bold mb-4">$19<span className="text-base text-gray-400">/month</span></p>
                  <p className="text-gray-400 mb-6">Perfect for beginners</p>
                  <ul className="text-gray-300 text-sm mb-6 space-y-2">
                    <li>• 10 videos per month</li>
                    <li>• Basic templates</li>
                    <li>• Standard voices</li>
                  </ul>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Get Started
                  </button>
                </div>
                <div className="bg-gray-700 p-8 rounded-lg border-2 border-green-600">
                  <h3 className="text-2xl font-bold mb-4">Pro</h3>
                  <p className="text-3xl font-bold mb-4">$49<span className="text-base text-gray-400">/month</span></p>
                  <p className="text-gray-400 mb-6">For content creators</p>
                  <ul className="text-gray-300 text-sm mb-6 space-y-2">
                    <li>• 50 videos per month</li>
                    <li>• Premium templates</li>
                    <li>• All AI voices</li>
                    <li>• Priority support</li>
                  </ul>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Get Started
                  </button>
                </div>
                <div className="bg-gray-700 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                  <p className="text-3xl font-bold mb-4">$199<span className="text-base text-gray-400">/month</span></p>
                  <p className="text-gray-400 mb-6">For teams and agencies</p>
                  <ul className="text-gray-300 text-sm mb-6 space-y-2">
                    <li>• Unlimited videos</li>
                    <li>• Custom branding</li>
                    <li>• API access</li>
                    <li>• Dedicated support</li>
                  </ul>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">{currentPage.replace('-', ' ').toUpperCase()}</h1>
              <p className="text-gray-400">This feature is coming soon!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
