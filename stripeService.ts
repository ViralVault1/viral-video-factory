import { loadStripe } from '@stripe/stripe-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { STRIPE_PUBLISHABLE_KEY, isStripeConfigured } from '../lib/apiKeys';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY!);


/**
 * This function calls a Supabase Edge Function to create a Stripe Checkout session,
 * and then redirects the user to the Stripe Checkout page.
 * 
 * You need to create a Supabase Edge Function named 'create-checkout-session'.
 * This function should:
 * 1. Be authenticated to get the user's ID.
 * 2. Get the user's Stripe customer ID from your 'customers' table, or create a new one.
 * 3. Use the Stripe Node.js library to create a checkout session:
 *    stripe.checkout.sessions.create({
 *      payment_method_types: ['card'],
 *      customer: stripe_customer_id,
 *      line_items: [{ price: priceId, quantity: 1 }],
 *      mode: 'subscription',
 *      success_url: `${window.location.origin}/`,
 *      cancel_url: `${window.location.origin}/pricing`,
 *    })
 * 4. Return the session ID to the client.
 */
export const handleCheckout = async (priceId: string) => {
  try {
    if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Please add your API keys.');
    }
    if (!isStripeConfigured) {
        throw new Error('Action required: Please set your Stripe Publishable Key in the lib/apiKeys.ts file to enable checkout.');
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('You must be logged in to start checkout.');
    }

    let sessionId: string;

    try {
        // Use the Supabase client to invoke the edge function.
        // This automatically handles authentication headers and the base URL.
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
            body: { priceId },
        });

        if (error) {
            // The error object from Supabase invoke can be a FunctionsHttpError, FunctionsRelayError, etc.
            throw new Error(error.message || 'An unknown error occurred when creating the checkout session.');
        }

        sessionId = data.sessionId;

    } catch (error) {
        console.error('Error invoking create-checkout-session function:', error);
        // Re-throw a more user-friendly error. The original catch for TypeError is no longer needed.
        throw new Error(`Failed to connect to the payment server. Please check your network and ensure backend functions are deployed correctly.`);
    }

    if (!sessionId) {
      throw new Error('Could not create a checkout session. Please try again.');
    }

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe.js has not loaded yet.');
    }

    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

    if (stripeError) {
      throw new Error(`Could not redirect to Stripe: ${stripeError.message}`);
    }

  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};