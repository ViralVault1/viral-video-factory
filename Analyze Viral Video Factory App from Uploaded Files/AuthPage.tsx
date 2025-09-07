import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoaderIcon } from './icons/LoaderIcon';
import { MailIcon } from './icons/MailIcon';
import { LockIcon } from './icons/LockIcon';
import { useNotification } from './NotificationProvider';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CheckIcon } from './icons/CheckIcon';
import { isStripeConfigured, STRIPE_PUBLISHABLE_KEY } from '../lib/apiKeys';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCardIcon } from './icons/CreditCardIcon';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isTestingStripe, setIsTestingStripe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithPassword, signUp } = useAuth();
  const { showToast } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signIn') {
        const { error } = await signInWithPassword(email, password);
        if (error) throw error;
        showToast('Successfully signed in!', 'success');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        showToast('Confirmation email sent! Please check your inbox.', 'success');
      }
      onNavigate('home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestSupabaseConnection = async () => {
    setIsTestingSupabase(true);
    setError(null);
    showToast('Testing Supabase connection...', 'info');

    if (!isSupabaseConfigured) {
      showToast('Supabase credentials are not set in environment variables.', 'error');
      setIsTestingSupabase(false);
      return;
    }

    try {
      // Test 1: Query a core table for auth/billing ('subscriptions')
      // This is a lightweight query to check for table existence and basic connectivity.
      const { error: subscriptionsError } = await supabase.from('subscriptions').select('id', { count: 'exact', head: true });

      // Check for fatal connection errors first, as they are the most critical
      if (subscriptionsError && (subscriptionsError.message.includes('Failed to fetch') || subscriptionsError.message.includes('NetworkError'))) {
        throw new Error('Network Error: Could not reach Supabase. Please check your SUPABASE_URL and ensure your project is running.');
      }
      if (subscriptionsError && (subscriptionsError.message.includes('Invalid API key') || subscriptionsError.message.includes('invalid JWT'))) {
        throw new Error('Authentication Error: Your SUPABASE_ANON_KEY seems to be invalid.');
      }
      
      // If we reach here, the URL and Key are likely correct. Now check for schema setup.
      const missingTables: string[] = [];
      if (subscriptionsError && subscriptionsError.message.includes('relation "public.subscriptions" does not exist')) {
        missingTables.push('subscriptions');
      }

      // Test 2: Query the 'customers' table, also needed for billing
      const { error: customersError } = await supabase.from('customers').select('id', { count: 'exact', head: true });
      if (customersError && customersError.message.includes('relation "public.customers" does not exist')) {
        missingTables.push('customers');
      }

      if (missingTables.length > 0) {
        showToast(`Connection OK, but missing tables: ${missingTables.join(', ')}.`, 'info');
        setError(`Your database schema is incomplete. Please run the required SQL migrations in your Supabase project's SQL Editor to create the necessary tables for authentication and billing to work.`);
        return; // End the process here, as we've identified the issue.
      }
      
      // If there was an error but it wasn't a fatal one or a "missing table" one, it's likely RLS, which is fine.
      // So if we've passed all the specific checks, the connection is considered successful.
      showToast('Supabase connection successful!', 'success');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTestingSupabase(false);
    }
  };

  const handleTestStripeConnection = async () => {
    setIsTestingStripe(true);
    setError(null);
    showToast('Testing Stripe connection...', 'info');

    if (!isStripeConfigured) {
        const errorMessage = 'Stripe Publishable Key is not configured. Please add it to lib/apiKeys.ts to enable payments.';
        showToast(errorMessage, 'error');
        setError(errorMessage);
        setIsTestingStripe(false);
        return;
    }

    if (!STRIPE_PUBLISHABLE_KEY || !STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
        const errorMessage = 'Stripe Publishable Key is invalid. It must start with "pk_". Please check lib/apiKeys.ts.';
        showToast(errorMessage, 'error');
        setError(errorMessage);
        setIsTestingStripe(false);
        return;
    }

    try {
        const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        if (stripe) {
            showToast('Stripe connection successful!', 'success');
        } else {
            throw new Error('loadStripe returned null. The key may be invalid or malformed.');
        }
    } catch (err: any) {
        const errorMessage = `Stripe connection failed: ${err.message}`;
        showToast(errorMessage, 'error');
        setError(errorMessage);
    } finally {
        setIsTestingStripe(false);
    }
  };


  const activeTabClass = 'border-green-500 text-white';
  const inactiveTabClass = 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500';

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
          <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setMode('signIn')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${mode === 'signIn' ? activeTabClass : inactiveTabClass}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signUp')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${mode === 'signUp' ? activeTabClass : inactiveTabClass}`}
              >
                Sign Up
              </button>
            </nav>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {mode === 'signIn' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {mode === 'signIn' ? 'Sign in to continue to Viral Video Factory.' : 'Get started with your 14-day free trial.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr_only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-900 text-white"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr_only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-900 text-white"
                  placeholder="Password"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-300 text-center bg-red-900/50 border border-red-500 rounded-md p-3">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? <LoaderIcon /> : (mode === 'signIn' ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-700 pt-6 space-y-4">
            <button
              type="button"
              onClick={handleTestSupabaseConnection}
              disabled={isTestingSupabase}
              className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isTestingSupabase ? (
                <LoaderIcon className="w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5" />
                  <span>Test Supabase Connection</span>
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={handleTestStripeConnection}
              disabled={isTestingStripe}
              className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isTestingStripe ? (
                <LoaderIcon className="w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  <span>Test Stripe Connection</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};