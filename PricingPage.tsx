

import React, { useState } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './NotificationProvider';
import { LoaderIcon } from './icons/LoaderIcon';
import { handleCheckout } from '../services/stripeService';
import { CrossIcon } from './icons/CrossIcon';
import { pricingPlans, currencies, featureComparison, Currency, areStripePriceIdsConfigured } from '../config/pricingConfig';
import { isStripeConfigured } from '../lib/apiKeys';
import { ContactSalesModal } from './ContactSalesModal';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

type Plan = typeof pricingPlans.monthly[0];

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

  const { user, subscription } = useAuth();
  const { showToast } = useNotification();

  const plans = pricingPlans[billingCycle];
  const selectedCurrency = currencies[currency];
  
  const isPriceIdsConfigured = areStripePriceIdsConfigured;
  const isStripeFullyConfigured = isPriceIdsConfigured && isStripeConfigured;

  const onCtaClick = async (plan: Plan, cta: string) => {
    if (cta === 'Contact Sales') {
      setIsSalesModalOpen(true);
      return;
    }
    
    if (user?.isGuest) {
        showToast("Guest users cannot manage subscriptions. Please sign up for a real account.", 'info');
        onNavigate('auth');
        return;
    }

    if (!user) {
      showToast('Please sign in to choose a plan.', 'info');
      onNavigate('auth');
      return;
    }

    const currentPlanPriceIds = Object.values(plan.priceIds);
    if (subscription && currentPlanPriceIds.includes(subscription.price_id) && (subscription.status === 'active' || subscription.status === 'trialing')) {
        showToast("You are already subscribed to this plan.", 'info');
        return;
    }

    const priceId = plan.priceIds[currency];
    setIsLoading(plan.name);

    try {
      await handleCheckout(priceId);
    } catch (error: any) {
      showToast(error.message || 'Could not start checkout session.', 'error');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <ContactSalesModal isOpen={isSalesModalOpen} onClose={() => setIsSalesModalOpen(false)} />
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-2xl mx-auto">

          {!isStripeFullyConfigured && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 p-6 rounded-lg mb-16 max-w-4xl mx-auto shadow-lg" role="alert">
                  <h3 className="font-bold text-xl text-red-200">Configuration Required</h3>
                  {!isStripeConfigured && (
                      <p className="mt-2">
                          Your Stripe Publishable Key is not set. Please add <code className="bg-red-800/50 text-white px-1.5 py-0.5 rounded-sm font-mono">STRIPE_PUBLISHABLE_KEY</code> to your environment variables to enable checkout.
                      </p>
                  )}
                  {!isPriceIdsConfigured && (
                      <>
                          <p className="mt-2">
                              The payment system is not yet configured. You must replace the placeholder Stripe Price IDs for <strong>both monthly and yearly plans for each currency</strong> in the <code className="bg-red-800/50 text-white px-1.5 py-0.5 rounded-sm font-mono">config/pricingConfig.ts</code> file.
                          </p>
                          <p className="mt-2 text-red-400 font-semibold">
                              Important: Make sure you are using Price IDs (which start with <code className="bg-red-800/50 text-white px-1 py-0.5 rounded-sm font-mono">price_...</code>), not Product IDs (which start with <code className="bg-red-800/50 text-white px-1 py-0.5 rounded-sm font-mono">prod_...</code>).
                          </p>
                      </>
                  )}
                  <p className="mt-2 text-sm text-red-400">
                      All checkout buttons are currently disabled.
                  </p>
              </div>
          )}

          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-400">Simple, transparent pricing. No hidden fees.</p>

            <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
              <span className={`font-medium transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <label htmlFor="billing-toggle" className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  id="billing-toggle" 
                  className="sr-only peer" 
                  checked={billingCycle === 'yearly'}
                  onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  aria-label="Toggle between monthly and yearly billing"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
              <span className={`font-medium transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
              <span className="bg-green-500/20 text-green-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">SAVE 20%</span>
               <div className="relative">
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-8 py-1.5 appearance-none"
                    aria-label="Select currency"
                  >
                    {Object.keys(currencies).map(key => (
                      <option key={key} value={key}>{currencies[key as Currency].name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <ChevronDownIcon className="w-4 h-4" />
                  </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative bg-gray-800 rounded-2xl p-8 border transition-all duration-300 ${plan.isPopular ? 'border-green-500 scale-105' : 'border-gray-700'}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                      <span className="inline-block bg-green-500 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6 h-12">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-white">{selectedCurrency.symbol}{plan.prices[currency]}</span>
                  <span className="text-gray-400 font-medium">{plan.billingCycle}</span>
                </div>
                <button 
                  onClick={() => onCtaClick(plan, plan.cta)}
                  disabled={isLoading === plan.name || !isStripeFullyConfigured}
                  className={`w-full text-center block font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 ${plan.isPopular ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-white hover:bg-gray-600'} ${!isStripeFullyConfigured && 'cursor-not-allowed'}`}
                >
                  {isLoading === plan.name ? <LoaderIcon className="w-6 h-6 mx-auto" /> : plan.cta}
                </button>
                <ul className="mt-8 space-y-4 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      {feature.startsWith('- ') ? (
                        <CrossIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                      ) : (
                        <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      )}
                      <span className={`${feature.startsWith('- ') ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                        {feature.startsWith('- ') ? feature.substring(2) : feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-24">
              <h3 className="text-3xl font-bold text-white text-center mb-10">Compare All Features</h3>
              <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700">
                  <table className="w-full text-left min-w-[600px]">
                      <thead>
                          <tr className="border-b border-gray-700">
                              <th className="p-4 text-lg font-semibold text-white w-1/3">Features</th>
                              <th className="p-4 text-center">
                                  <span className="block text-lg font-semibold text-white">Starter</span>
                                  <span className="block text-gray-400 text-sm">{selectedCurrency.symbol}{plans[0].prices[currency]}{plans[0].billingCycle}</span>
                              </th>
                              <th className="p-4 text-center">
                                  <span className="block text-lg font-semibold text-green-400">Creator</span>
                                  <span className="block text-gray-400 text-sm">{selectedCurrency.symbol}{plans[1].prices[currency]}{plans[1].billingCycle}</span>
                              </th>
                              <th className="p-4 text-center">
                                  <span className="block text-lg font-semibold text-white">Scale</span>
                                  <span className="block text-gray-400 text-sm">{selectedCurrency.symbol}{plans[2].prices[currency]}{plans[2].billingCycle}</span>
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          {featureComparison.map(category => (
                              <React.Fragment key={category.category}>
                                  <tr className="bg-gray-900/50">
                                      <td colSpan={4} className="p-4 font-bold text-white text-base">{category.category}</td>
                                  </tr>
                                  {category.features.map(feature => (
                                      <tr key={feature.name} className="border-b border-gray-700 last:border-b-0">
                                          <td className="p-4 text-gray-300">{feature.name}</td>
                                          <td className="p-4 text-center text-gray-300 font-medium">
                                              {typeof feature.starter === 'boolean' ? 
                                                  (feature.starter ? <CheckIcon className="w-6 h-6 text-green-400 mx-auto" /> : <span className="text-gray-500 text-2xl">—</span>) :
                                                  feature.starter
                                              }
                                          </td>
                                          <td className="p-4 text-center text-gray-300 font-medium">
                                              {typeof feature.creator === 'boolean' ? 
                                                  (feature.creator ? <CheckIcon className="w-6 h-6 text-green-400 mx-auto" /> : <span className="text-gray-500 text-2xl">—</span>) :
                                                  feature.creator
                                              }
                                          </td>
                                          <td className="p-4 text-center text-gray-300 font-medium">
                                              {typeof feature.scale === 'boolean' ? 
                                                  (feature.scale ? <CheckIcon className="w-6 h-6 text-green-400 mx-auto" /> : <span className="text-gray-500 text-2xl">—</span>) :
                                                  feature.scale
                                              }
                                          </td>
                                      </tr>
                                  ))}
                              </React.Fragment>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
        </div>
      </section>
    </>
  );
};
