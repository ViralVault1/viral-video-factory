import React, { useState } from 'react';
import { HomePage } from './HomePage';
import { PricingPage } from './PricingPage';
import { ErrorBoundary } from './ErrorBoundary';

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { name: 'Home', icon: '🏠', page: 'home' },
    { name: 'Pricing', icon: '💰', page: 'pricing' }
  ];

  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: '#f8f9fa', 
      padding: '20px',
      borderRight: '1px solid #dee2e6'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#495057' }}>Menu</h2>
      <nav>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            onClick={() => setCurrentPage(item.page)}
            style={{ 
              padding: '10px', 
              marginBottom: '5px', 
              cursor: 'pointer',
              borderRadius: '5px',
              backgroundColor: currentPage === item.page ? '#007bff' : 'transparent',
              color: currentPage === item.page ? 'white' : '#495057',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'pricing': return <PricingPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="App" style={{ display: 'flex', minHeight: '100vh' }}>
      <ErrorBoundary>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main style={{ flex: 1, padding: '20px' }}>
          {renderPage()}
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default App;
