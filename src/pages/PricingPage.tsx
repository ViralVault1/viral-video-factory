import React, { useState } from 'react';

interface PricingTier {
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  buttonText: string;
  buttonStyle: string;
  popular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    value?: string;
  }>;
}

interface CurrencyData {
  symbol: string;
  rate: number;
  code: string;
}

export const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Currency conversion rates (in a real app, these would come from an API)
  const currencies: Record<string, CurrencyData> = {
    USD: { symbol: '$', rate: 1, code: 'USD' },
    EUR: { symbol: '€', rate: 0.85, code: 'EUR' },
    GBP: { symbol: '£', rate: 0.73, code: 'GBP' }
  };

  const convertPrice = (price: number): number => {
    return Math.round(price * currencies[selectedCurrency].rate);
  };

  const getCurrencySymbol = (): string => {
    return currencies[selectedCurrency].symbol;
  };

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: 19,
      yearlyPrice: 15,
      description: 'For individuals just starting out with video content.',
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      features: [
        { name: 'Content Credits', included: true, value: '200 / Month' },
        { name: 'Videos with watermark', included: true },
        { name: 'Standard video quality (720p)', included: true },
        { name: 'Access to standard AI voices', included: true },
        { name: 'Basic script generation', included: true },
        { name: 'AI Content Strategy', included: false },
        { name: 'Product Ad Studio', included: false }
      ]
    },
    {
      name: 'Creator',
      price: 49,
      yearlyPrice: 39,
      description: 'Perfect for content creators, marketers, and YouTubers.',
      buttonText: 'Start Creating',
      buttonStyle: 'bg-green-500 hover:bg-green-600 text-white',
      popular: true,
      features: [
        { name: 'Content Credits', included: true, value: '500 / Month' },
        { name: 'No watermark on videos', included: true },
        { name: 'Full HD quality (1080p)', included: true },
        { name: 'Access to premium AI voices', included: true },
        { name: 'Advanced script rewriting', included: true },
        { name: 'Trending content analysis', included: true },
        { name: 'AI Content Strategy', included: true },
        { name: 'Product Ad Studio', included: true }
      ]
    },
    {
      name: 'Scale',
      price: 99,
      yearlyPrice: 79,
      description: 'For agencies, businesses, and power users.',
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      features: [
        { name: 'Content Credits', included: true, value: '1500 / Month' },
        { name: '4K video quality', included: true },
        { name: 'AI Content Strategy', included: true },
        { name: 'Product Ad Studio', included: true },
        { name: 'Team collaboration (3 seats)', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: true }
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'Content Credits', starter: '200 / month', creator: '500 / month', scale: '1500 / Month' },
    { name: 'Video Quality', starter: '720p', creator: '1080p', scale: '4K' },
    { name: 'Remove Watermark', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Max Video Duration', starter: '60s', creator: '90s', scale: '3min' },
    { name: 'Premium AI Voices', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Advanced Script Rewriting', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Trending Content Analysis', starter: '—', creator: '✓', scale: '✓' },
    { name: 'AI Content Strategy', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Product Ad Studio', starter: '—', creator: '✓', scale: '✓' },
    { name: 'API Access', starter: '—', creator: '—', scale: '✓' },
    { name: 'Team Seats', starter: '1', creator: '1', scale: '3 seats included' },
    { name: 'Priority Support', starter: '—', creator: '—', scale: '✓' },
    { name: 'Community Access', starter: '✓', creator: '✓', scale: '✓' }
  ];

import React, { useState } from 'react';

interface PricingTier {
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  buttonText: string;
  buttonStyle: string;
  popular?: boolean;
  features: Array<{
    name: string;
    included: boolean;
    value?: string;
  }>;
}

interface CurrencyData {
  symbol: string;
  rate: number;
  code: string;
}

// Stripe price IDs - your actual price IDs from Stripe dashboard
const STRIPE_PRICE_IDS = {
  starter: {
    monthly: 'price_1S2f00BNxC40aDQMJ6IJQUDD',
    yearly: 'price_1S2fP1BNxC40aDQM830ATipu'
  },
  creator: {
    monthly: 'price_1S2fIqBNxC40aDQMlitES7ai',
    yearly: 'price_1S2fPYBNxC40aDQMc5hHPk2N'
  },
  scale: {
    monthly: 'price_1S2fJkBNxC40aDQMSkwdoLmi',
    yearly: 'price_1S2fQ1BNxC40aDQM4cmLCSok'
  }
};

export const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Currency conversion rates (in a real app, these would come from an API)
  const currencies: Record<string, CurrencyData> = {
    USD: { symbol: '

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg mb-8">Simple, transparent pricing. No hidden fees.</p>
        
        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
          {isYearly && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
              SAVE 20%
            </span>
          )}
          
          {/* Fixed Currency Selector */}
          <div className="relative">
            <select 
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer min-w-[100px]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-gray-800 rounded-lg p-8 ${
                tier.popular ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {getCurrencySymbol()}{convertPrice(isYearly ? tier.yearlyPrice : tier.price)}
                  </span>
                  <span className="text-gray-400">/month</span>
                  {isYearly && (
                    <div className="text-sm text-gray-400 mt-1">
                      Billed {getCurrencySymbol()}{convertPrice(tier.yearlyPrice * 12)} yearly
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handlePlanSelect(tier.name, tier.price)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${tier.buttonStyle}`}
                >
                  {tier.buttonText}
                </button>
              </div>
              
              <div className="mt-8">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center mb-3">
                    {feature.included ? (
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={feature.included ? 'text-white' : 'text-gray-500'}>
                      {feature.name}
                      {feature.value && (
                        <span className="text-gray-400 ml-2">({feature.value})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare All Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold">
                    <div>Starter</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 15 : 19)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div className="text-green-500">Creator</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 39 : 49)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div>Scale</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 79 : 99)}/month
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    Core Features
                  </td>
                </tr>
                {comparisonFeatures.slice(0, 4).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
                
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    AI Tools
                  </td>
                </tr>
                {comparisonFeatures.slice(4, 9).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
                
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    Support & Collaboration
                  </td>
                </tr>
                {comparisonFeatures.slice(9).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Video Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded mr-2"></div>
              <span className="font-semibold">Viral Video Factory</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Viral Video Factory. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};, rate: 1, code: 'USD' },
    EUR: { symbol: '€', rate: 0.85, code: 'EUR' },
    GBP: { symbol: '£', rate: 0.73, code: 'GBP' }
  };

  const convertPrice = (price: number): number => {
    return Math.round(price * currencies[selectedCurrency].rate);
  };

  const getCurrencySymbol = (): string => {
    return currencies[selectedCurrency].symbol;
  };

  const pricingTiers: PricingTier[] = [
    {
      name: 'Starter',
      price: 19,
      yearlyPrice: 15,
      description: 'For individuals just starting out with video content.',
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      features: [
        { name: 'Content Credits', included: true, value: '200 / Month' },
        { name: 'Videos with watermark', included: true },
        { name: 'Standard video quality (720p)', included: true },
        { name: 'Access to standard AI voices', included: true },
        { name: 'Basic script generation', included: true },
        { name: 'AI Content Strategy', included: false },
        { name: 'Product Ad Studio', included: false }
      ]
    },
    {
      name: 'Creator',
      price: 49,
      yearlyPrice: 39,
      description: 'Perfect for content creators, marketers, and YouTubers.',
      buttonText: 'Start Creating',
      buttonStyle: 'bg-green-500 hover:bg-green-600 text-white',
      popular: true,
      features: [
        { name: 'Content Credits', included: true, value: '500 / Month' },
        { name: 'No watermark on videos', included: true },
        { name: 'Full HD quality (1080p)', included: true },
        { name: 'Access to premium AI voices', included: true },
        { name: 'Advanced script rewriting', included: true },
        { name: 'Trending content analysis', included: true },
        { name: 'AI Content Strategy', included: true },
        { name: 'Product Ad Studio', included: true }
      ]
    },
    {
      name: 'Scale',
      price: 99,
      yearlyPrice: 79,
      description: 'For agencies, businesses, and power users.',
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      features: [
        { name: 'Content Credits', included: true, value: '1500 / Month' },
        { name: '4K video quality', included: true },
        { name: 'AI Content Strategy', included: true },
        { name: 'Product Ad Studio', included: true },
        { name: 'Team collaboration (3 seats)', included: true },
        { name: 'Priority support', included: true },
        { name: 'API access', included: true }
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'Content Credits', starter: '200 / month', creator: '500 / month', scale: '1500 / Month' },
    { name: 'Video Quality', starter: '720p', creator: '1080p', scale: '4K' },
    { name: 'Remove Watermark', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Max Video Duration', starter: '60s', creator: '90s', scale: '3min' },
    { name: 'Premium AI Voices', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Advanced Script Rewriting', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Trending Content Analysis', starter: '—', creator: '✓', scale: '✓' },
    { name: 'AI Content Strategy', starter: '—', creator: '✓', scale: '✓' },
    { name: 'Product Ad Studio', starter: '—', creator: '✓', scale: '✓' },
    { name: 'API Access', starter: '—', creator: '—', scale: '✓' },
    { name: 'Team Seats', starter: '1', creator: '1', scale: '3 seats included' },
    { name: 'Priority Support', starter: '—', creator: '—', scale: '✓' },
    { name: 'Community Access', starter: '✓', creator: '✓', scale: '✓' }
  ];

  const handlePlanSelect = async (planName: string, price: number) => {
    if (planName === 'Scale') {
      // Check if Scale plan has Stripe pricing configured
      const scalePriceId = STRIPE_PRICE_IDS.scale?.[isYearly ? 'yearly' : 'monthly'];
      
      if (scalePriceId && !scalePriceId.includes('placeholder')) {
        // Scale plan has Stripe pricing - proceed with checkout
        setIsLoading(planName);
        
        try {
          const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              priceId: scalePriceId,
              plan: planName.toLowerCase(),
              billing: isYearly ? 'yearly' : 'monthly',
              currency: selectedCurrency,
              price: convertPrice(isYearly ? pricingTiers.find(t => t.name === planName)?.yearlyPrice || price : price),
              successUrl: `${window.location.origin}/dashboard?welcome=true&plan=${planName.toLowerCase()}`,
              cancelUrl: `${window.location.origin}/pricing`
            })
          });

          if (!response.ok) {
            throw new Error('Failed to create checkout session');
          }

          const { checkoutUrl } = await response.json();
          window.location.href = checkoutUrl;
          return;
          
        } catch (error: any) {
          console.error('Scale checkout error:', error);
          alert(`Unable to start checkout: ${error.message}`);
          setIsLoading(null);
          return;
        }
      } else {
        // Scale plan uses sales contact - open email
        const subject = encodeURIComponent('Scale Plan Inquiry - Viral Video Factory');
        const body = encodeURIComponent('Hi,\n\nI am interested in the Scale plan for my business. Please contact me to discuss enterprise options and pricing.\n\nThanks!');
        window.open(`mailto:sales@viralvideofactory.com?subject=${subject}&body=${body}`, '_blank');
        return;
      }
    }

    setIsLoading(planName);

    try {
      // Get the Stripe price ID
      const priceId = STRIPE_PRICE_IDS[planName.toLowerCase() as keyof typeof STRIPE_PRICE_IDS]?.[isYearly ? 'yearly' : 'monthly'];
      
      if (!priceId) {
        throw new Error('Price ID not configured for this plan');
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          plan: planName.toLowerCase(),
          billing: isYearly ? 'yearly' : 'monthly',
          currency: selectedCurrency,
          price: convertPrice(isYearly ? pricingTiers.find(t => t.name === planName)?.yearlyPrice || price : price),
          successUrl: `${window.location.origin}/dashboard?welcome=true&plan=${planName.toLowerCase()}`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // Show user-friendly error message
      alert(`Unable to start checkout: ${error.message}\n\nPlease try again or contact support if the issue persists.`);
      
      setIsLoading(null);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg mb-8">Simple, transparent pricing. No hidden fees.</p>
        
        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
          {isYearly && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
              SAVE 20%
            </span>
          )}
          
          {/* Fixed Currency Selector */}
          <div className="relative">
            <select 
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer min-w-[100px]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-gray-800 rounded-lg p-8 ${
                tier.popular ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {getCurrencySymbol()}{convertPrice(isYearly ? tier.yearlyPrice : tier.price)}
                  </span>
                  <span className="text-gray-400">/month</span>
                  {isYearly && (
                    <div className="text-sm text-gray-400 mt-1">
                      Billed {getCurrencySymbol()}{convertPrice(tier.yearlyPrice * 12)} yearly
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handlePlanSelect(tier.name, tier.price)}
                  disabled={isLoading === tier.name}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${tier.buttonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === tier.name ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    tier.buttonText
                  )}
                </button>
              </div>
              
              <div className="mt-8">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center mb-3">
                    {feature.included ? (
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={feature.included ? 'text-white' : 'text-gray-500'}>
                      {feature.name}
                      {feature.value && (
                        <span className="text-gray-400 ml-2">({feature.value})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare All Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold">
                    <div>Starter</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 15 : 19)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div className="text-green-500">Creator</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 39 : 49)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div>Scale</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 79 : 99)}/month
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    Core Features
                  </td>
                </tr>
                {comparisonFeatures.slice(0, 4).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
                
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    AI Tools
                  </td>
                </tr>
                {comparisonFeatures.slice(4, 9).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
                
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    Support & Collaboration
                  </td>
                </tr>
                {comparisonFeatures.slice(9).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Video Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded mr-2"></div>
              <span className="font-semibold">Viral Video Factory</span>
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

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg mb-8">Simple, transparent pricing. No hidden fees.</p>
        
        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
          {isYearly && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
              SAVE 20%
            </span>
          )}
          
          {/* Fixed Currency Selector */}
          <div className="relative">
            <select 
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer min-w-[100px]"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-gray-800 rounded-lg p-8 ${
                tier.popular ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-400 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {getCurrencySymbol()}{convertPrice(isYearly ? tier.yearlyPrice : tier.price)}
                  </span>
                  <span className="text-gray-400">/month</span>
                  {isYearly && (
                    <div className="text-sm text-gray-400 mt-1">
                      Billed {getCurrencySymbol()}{convertPrice(tier.yearlyPrice * 12)} yearly
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handlePlanSelect(tier.name, tier.price)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${tier.buttonStyle}`}
                >
                  {tier.buttonText}
                </button>
              </div>
              
              <div className="mt-8">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center mb-3">
                    {feature.included ? (
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={feature.included ? 'text-white' : 'text-gray-500'}>
                      {feature.name}
                      {feature.value && (
                        <span className="text-gray-400 ml-2">({feature.value})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare All Features Section */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold">
                    <div>Starter</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 15 : 19)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div className="text-green-500">Creator</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 39 : 49)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div>Scale</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 79 : 99)}/month
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    Core Features
                  </td>
                </tr>
                {comparisonFeatures.slice(0, 4).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
                
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    AI Tools
                  </td>
                </tr>
                {comparisonFeatures.slice(4, 9).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
                
                <tr className="border-b border-gray-700">
                  <td colSpan={4} className="p-4 bg-gray-750 font-semibold text-gray-300">
                    Support & Collaboration
                  </td>
                </tr>
                {comparisonFeatures.slice(9).map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.starter}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Video Generator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Script Generator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded mr-2"></div>
              <span className="font-semibold">Viral Video Factory</span>
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
