// api/create-checkout-session.js
import { createClient } from '@supabase/supabase-js';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, billing, currency, price, priceId, successUrl, cancelUrl } = req.body;

    console.log('Creating checkout session:', { plan, billing, currency, price });

    // Validate required fields
    if (!plan || !billing || !currency || !price) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['plan', 'billing', 'currency', 'price']
      });
    }

    // Validate Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY environment variable');
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Viral Video Factory - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              description: `${billing === 'yearly' ? 'Annual' : 'Monthly'} subscription to Viral Video Factory ${plan} plan`,
              images: [`${req.headers.origin}/logo.png`], // Add your logo URL
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: {
              interval: billing === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/dashboard?welcome=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing`,
      metadata: {
        plan: plan,
        billing: billing,
        currency: currency,
        price: price.toString()
      },
      customer_creation: 'always',
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
      subscription_data: {
        metadata: {
          plan: plan,
          billing: billing
        }
      },
      custom_fields: [
        {
          key: 'company',
          label: {
            type: 'custom',
            custom: 'Company Name (Optional)'
          },
          type: 'text',
          optional: true
        }
      ]
    });

    console.log('Stripe session created:', session.id);

    // Store checkout session in Supabase for tracking
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { error: insertError } = await supabase
          .from('checkout_sessions')
          .insert({
            session_id: session.id,
            plan: plan,
            billing: billing,
            currency: currency,
            price: price,
            status: 'pending',
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.warn('Failed to store checkout session in Supabase:', insertError);
          // Don't fail the request, just log the warning
        }
      } catch (supabaseError) {
        console.warn('Supabase operation failed:', supabaseError);
        // Continue with checkout even if Supabase fails
      }
    }

    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Checkout session creation failed:', error);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: 'Your card was declined.' });
    }
    
    if (error.type === 'StripeRateLimitError') {
      return res.status(429).json({ error: 'Too many requests made to the API too quickly' });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Invalid parameters were supplied to Stripe\'s API' });
    }
    
    if (error.type === 'StripeAPIError') {
      return res.status(500).json({ error: 'An error occurred with Stripe\'s API' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
