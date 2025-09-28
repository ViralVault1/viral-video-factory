// api/create-checkout-session.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase only if environment variables are available
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

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

  // === SUPABASE CONNECTION TEST ===
  console.log('=== SUPABASE TEST ===');
  console.log('URL exists:', !!process.env.SUPABASE_URL);
  console.log('Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('URL preview:', process.env.SUPABASE_URL?.substring(0, 50));

  if (supabase) {
    console.log('✅ Supabase client created successfully');
    
    // Test basic connection
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Supabase auth test:', error ? 'FAILED' : 'SUCCESS');
      if (error) console.log('Auth error:', error.message);
      
      // Test database query
      const { data: dbTest, error: dbError } = await supabase
        .from('checkout_sessions')
        .select('*')
        .limit(1);
      
      if (dbError) {
        console.log('Database test: Table might not exist -', dbError.message);
      } else {
        console.log('Database test: SUCCESS - checkout_sessions table accessible');
      }
    } catch (supabaseError) {
      console.log('Supabase connection error:', supabaseError.message);
    }
  } else {
    console.log('❌ Supabase not configured - missing environment variables');
  }
  console.log('=== END SUPABASE TEST ===');

  // Validate Stripe environment variable
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
      },
      billing_address_collection: 'required'
    });

    console.log('Stripe session created:', session.id);

    // === OPTIONAL: Store checkout session in Supabase ===
    if (supabase) {
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
          console.warn('Failed to store checkout session in Supabase:', insertError.message);
          // Don't fail the request, just log the warning
        } else {
          console.log('✅ Checkout session stored in Supabase');
        }
      } catch (supabaseError) {
        console.warn('Supabase operation failed:', supabaseError.message);
        // Continue with checkout even if Supabase fails
      }
    } else {
      console.log('Skipping Supabase storage - not configured');
    }

    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: session.id,
      supabaseConnected: !!supabase
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
}
