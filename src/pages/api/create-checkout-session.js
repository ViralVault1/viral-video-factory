// pages/api/create-checkout-session.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase (optional)
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req, res) {
  // Set proper headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY');
    return res.status(500).json({ error: 'Payment system not configured' });
  }

  try {
    const { plan, billing, currency, price, successUrl, cancelUrl } = req.body;

    console.log('Request received:', { plan, billing, currency, price });

    // Validate required fields
    if (!plan || !billing || !currency || price === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['plan', 'billing', 'currency', 'price'],
        received: { plan, billing, currency, price }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Viral Video Factory - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            description: `${billing === 'yearly' ? 'Annual' : 'Monthly'} subscription`,
          },
          unit_amount: Math.round(price * 100),
          recurring: {
            interval: billing === 'yearly' ? 'year' : 'month',
          },
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan,
        billing,
        currency,
        price: price.toString()
      }
    });

    console.log('Stripe session created:', session.id);

    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
}
