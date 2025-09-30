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

// Stripe price IDs - update these with your actual Stripe price IDs
const STRIPE_PRICE_IDS = {
  creator: {
    monthly: 'price_1S2fIqBNxC40aDQMlitES7ai',
    yearly: 'price_1S2fPYBNxC40aDQMc5hHPk2N'
  },
  pro: {
    monthly: 'price_1S2fJkBNxC40aDQMSkwdoLmi',
    yearly: 'price_1S2fQ1BNxC40aDQM4cmLCSok'
  }
};

export const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState<string | null>(null);

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
      name: 'Free',
      price: 0,
      yearlyPrice: 0,
      description: 'Perfect for trying out AI content tools.',
      buttonText: 'Get Started Free',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      features: [
        { name: 'AI Script Generation', included: true, value: 'Unlimited' },
        { name: 'AI Image Generation', included: true, value: '10 / month' },
        { name: 'Product Ad Concepts', included: true, value: '5 / month' },
        { name: 'Basic AI voices', included: true },
        { name: 'Community support', included: true },
        { name: 'Watermark on exports', included: true },
        { name: 'Premium AI models', included: false },
        { name: 'Priority support', included: false }
      ]
    },
    {
      name: 'Creator',
      price: 29,
      yearlyPrice: 24,
      description: 'For content creators and marketers.',
      buttonText: 'Start Creating',
      buttonStyle: 'bg-green-500 hover:bg-green-600 text-white',
      popular: true,
      features: [
        { name: 'AI Script Generation', included: true, value: 'Unlimited' },
        { name: 'AI Image Generation', included: true, value: '100 / month' },
        { name: 'Product Ad Concepts', included: true, value: 'Unlimited' },
        { name: 'Premium AI voices', included: true },
        { name: 'No watermarks', included: true },
        { name: 'Advanced script tools', included: true },
        { name: 'Trending content analysis', included: true },
        { name: 'Priority email support', included: true }
      ]
    },
    {
      name: 'Pro',
      price: 99,
      yearlyPrice: 79,
      description: 'For agencies and power users.',
      buttonText: 'Go Pro',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
      features: [
        { name: 'Everything in Creator', included: true },
        { name: 'AI Image Generation', included: true, value: '500 / month' },
        { name: 'Bring Your Own API Keys', included: true },
        { name: 'Team collaboration (3 seats)', included: true },
        { name: 'API access', included: true },
        { name: 'White-label options', included: true },
        { name: 'Priority support + Slack', included: true },
        { name: 'Custom integrations', included: true }
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'AI Scripts & Captions', free: 'Unlimited', creator: 'Unlimited', pro: 'Unlimited' },
    { name: 'AI Image Generation', free: '10/month', creator: '100/month', pro: '500/month' },
    { name: 'Product Ad Concepts', free: '5/month', creator: 'Unlimited', pro: 'Unlimited' },
    { name: 'Remove Watermark', free: '—', creator: '✓', pro: '✓' },
    { name: 'Premium AI Models', free: '—', creator: '✓', pro: '✓' },
    { name: 'Trending Analysis', free: '—', creator: '✓', pro: '✓' },
    { name: 'BYOK (Use Your Keys)', free: '—', creator: '—', pro: '✓' },
    { name: 'API Access', free: '—', creator: '—', pro: '✓' },
    { name: 'Team Seats', free: '1', creator: '1', pro: '3' },
    { name: 'Priority Support', free: '—', creator: 'Email', pro: 'Email + Slack' },
    { name: 'Community Access', free: '✓', creator: '✓', pro: '✓' }
  ];

  const handlePlanSelect = async (planName: string, price: number) => {
    if (planName === 'Free') {
      // Redirect to signup/dashboard
      window.location.href = '/auth';
      return;
    }

    if (planName === 'Pro') {
      // Contact sales for Pro plan
      const subject = encodeURIComponent('Pro Plan Inquiry - Viral Video Factory');
      const body = encodeURIComponent('Hi,\n\nI am interested in the Pro plan. Please contact me to discuss options.\n\nThanks!');
      window.open(`mailto:sales@viralvideofactory.com?subject=${subject}&body=${body}`, '_blank');
      return;
    }

    setIsLoading(planName);

    try {
      const priceId = STRIPE_PRICE_IDS[planName.toLowerCase() as keyof typeof STRIPE_PRICE_IDS]?.[isYearly ? 'yearly' : 'monthly'];
      
      if (!priceId) {
        throw new Error('Price ID not configured for this plan');
      }

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
      window.location.href = checkoutUrl;
      
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Unable to start checkout: ${errorMessage}\n\nPlease try again or contact support.`);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg mb-8">Honest pricing. Real features. No AI video promises we can't keep.</p>
        
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
              SAVE 17%
            </span>
          )}
          
          <div className="relative ml-4">
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {pricingTiers.map((tier) => (
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
                    {getCurrencySymbol()}{tier.price === 0 ? 0 : convertPrice(isYearly ? tier.yearlyPrice : tier.price)}
                  </span>
                  {tier.price > 0 && <span className="text-gray-400">/month</span>}
                  {isYearly && tier.price > 0 && (
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
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold">
                    <div>Free</div>
                    <div className="text-sm text-gray-400 font-normal">$0</div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div className="text-green-500">Creator</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 24 : 29)}/month
                    </div>
                  </th>
                  <th className="text-center p-6 font-semibold">
                    <div>Pro</div>
                    <div className="text-sm text-gray-400 font-normal">
                      {getCurrencySymbol()}{convertPrice(isYearly ? 79 : 99)}/month
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-4 text-gray-300">{feature.name}</td>
                    <td className="p-4 text-center text-gray-400">{feature.free}</td>
                    <td className="p-4 text-center text-white">{feature.creator}</td>
                    <td className="p-4 text-center text-white">{feature.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">SOLUTIONS</h3>
              <ul className="space-y-2">
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">PRODUCTS</h3>
              <ul className="space-y-2">
                <li><a href="/image-generator" className="text-gray-400 hover:text-white transition-colors">AI Image Generator</a></li>
                <li><a href="/product-ad-studio" className="text-gray-400 hover:text-white transition-colors">Product Ad Studio</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">RESOURCES</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">COMPANY</h3>
              <ul className="space-y-2">
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
