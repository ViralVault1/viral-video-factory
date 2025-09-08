import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { Sidebar } from './components/Sidebar';
import { VideoGenerator } from './components/VideoGenerator';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
      case 'home':
        return <HomePage />;
      case 'video-generator':
        return <VideoGenerator />;
      case 'pricing':
        return (
          <div className="flex items-center justify-center flex-1 py-20">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
              <p className="text-gray-400 mb-8">Choose the plan that works for you</p>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
                <div className="bg-gray-700 p-8 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Starter</h3>
                  <p className="text-3xl font-bold mb-4">$19<span className="text-base text-gray-400">/month</span></p>
                  <p className="text-gray-400 mb-6">Perfect for beginners</p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Get Started
                  </button>
                </div>
                <div className="bg-gray-700 p-8 rounded-lg border-2 border-green-600">
                  <h3 className="text-2xl font-bold mb-4">Pro</h3>
                  <p className="text-3xl font-bold mb-4">$49<span className="text-base text-gray-400">/month</span></p>
                  <p className="text-gray-400 mb-6">For serious creators</p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center flex-1 py-20">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{currentPage.replace('-', ' ').toUpperCase()}</h1>
              <p className="text-gray-400">This feature is coming soon!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col">
        <Header onNavigate={handleNavigate} />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
