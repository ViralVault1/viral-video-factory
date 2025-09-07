import React from 'react';

export function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      features: ['10 videos per month', 'Basic templates', 'Email support']
    },
    {
      name: 'Pro',
      price: '$29',
      features: ['50 videos per month', 'Advanced templates', 'Priority support', 'AI agents']
    },
    {
      name: 'Enterprise',
      price: '$99',
      features: ['Unlimited videos', 'Custom templates', '24/7 support', 'API access']
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pricing Plans</h1>
      <p>Choose the perfect plan for your video creation needs</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '30px'
      }}>
        {plans.map((plan, index) => (
          <div key={index} style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'white'
          }}>
            <h3>{plan.name}</h3>
            <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff', margin: '10px 0' }}>
              {plan.price}<span style={{ fontSize: '0.5em' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} style={{ padding: '5px 0' }}>
                  ✓ {feature}
                </li>
              ))}
            </ul>
            <button style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '15px'
            }}>
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
