import React, { useState } from 'react';
import { Header } from './components/Header';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">
                Create Viral Videos with AI
              </h1>
              <p className="text-gray-400 mb-8">
                Generate engaging content in minutes with our AI-powered platform
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
              <p className="text-gray-400">Choose the plan that works for you</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}

export default App;
