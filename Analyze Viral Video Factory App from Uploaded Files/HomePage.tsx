import React from 'react';

export function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Viral Video Factory</h1>
      <p>Create viral content with AI-powered tools</p>
      <div style={{ marginTop: '20px' }}>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Get Started
        </button>
      </div>
    </div>
  );
}
