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
                  <span className="text-5xl font-extrabold text-white">$19</span>
                  <span className="text-gray-400 font-medium">/month</span>
                </div>
                <button 
                  onClick={() => onCtaClick(plan, plan.cta)}
                  disabled={isLoading === plan.name || !isStripeFullyConfigured}
                  className={`w-full text-center block font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 ${plan.isPopular ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                >
                  {isLoading === plan.name ? <LoaderIcon className="w-6 h-6 mx-auto" /> : 'Get Started'}
                </button>
                <ul className="mt-8 space-y-4 text-left">
                  {['Unlimited video generation', 'All premium templates', 'Priority support', 'API access'].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
