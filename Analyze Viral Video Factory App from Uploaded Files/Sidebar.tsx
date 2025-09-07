import React from 'react';

export function Sidebar() {
  const menuItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Video Generator', icon: '🎬' },
    { name: 'Pricing', icon: '💰' },
    { name: 'AI Agents', icon: '🤖' },
    { name: 'License Generator', icon: '📄' }
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
          <div key={index} style={{ 
            padding: '10px', 
            marginBottom: '5px', 
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'background-color 0.2s'
          }}>
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>
    </div>
  );
}
