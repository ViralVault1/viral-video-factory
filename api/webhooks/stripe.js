// api/webhooks/stripe.js
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable body parsing to handle raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Get raw body
    const buf = await buffer(req);
    
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log('Webhook verified:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Processing checkout completion:', session.id);

  try {
    // Get customer and subscription details
    const customer = await stripe.customers.retrieve(session.customer);
    const subscription = session.subscription 
      ? await stripe.subscriptions.retrieve(session.subscription)
      : null;

    // Extract plan details from metadata
    const planName = session.metadata?.plan || 'unknown';
    const billing = session.metadata?.billing || 'monthly';
    const currency = session.metadata?.currency || 'usd';
    const price = session.metadata?.price || '0';

    // Create or update user in Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        email: customer.email,
        stripe_customer_id: customer.id,
        subscription_status: subscription?.status || 'active',
        plan: planName,
        billing_cycle: billing,
        subscription_id: subscription?.id,
        current_period_start: subscription?.current_period_start 
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : new Date().toISOString(),
        current_period_end: subscription?.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (userError) {
      console.error('Failed to create/update user:', userError);
      throw userError;
    }

    // Update checkout session status
    const { error: sessionError } = await supabase
      .from('checkout_sessions')
      .update({
        status: 'completed',
        customer_id: customer.id,
        subscription_id: subscription?.id,
        user_id: userData.id,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', session.id);

    if (sessionError) {
      console.warn('Failed to update checkout session:', sessionError);
    }

    // Set user credits based on plan
    const creditAllocation = getCreditAllocation(planName);
    if (creditAllocation > 0) {
      const { error: creditsError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userData.id,
          credits: creditAllocation,
          plan: planName,
          billing_cycle: billing,
          last_reset: new Date().toISOString(),
          next_reset: getNextResetDate(billing)
        }, {
          onConflict: 'user_id'
        });

      if (creditsError) {
        console.error('Failed to set user credits:', creditsError);
      }
    }

    console.log('Checkout completion processed successfully for user:', userData.id);

  } catch (error) {
    console.error('Error processing checkout completion:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Processing subscription creation:', subscription.id);

  const { error } = await supabase
    .from('users')
    .update({
      subscription_id: subscription.id,
      subscription_status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', subscription.customer);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Processing subscription update:', subscription.id);

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
}

async function handleSubscriptionCanceled(subscription) {
  console.log('Processing subscription cancellation:', subscription.id);

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', subscription.id);

  if (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('Processing successful payment:', invoice.id);

  // Reset credits for recurring payments
  if (invoice.subscription) {
    const { data: userData } = await supabase
      .from('users')
      .select('id, plan, billing_cycle')
      .eq('subscription_id', invoice.subscription)
      .single();

    if (userData) {
      const creditAllocation = getCreditAllocation(userData.plan);
      
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userData.id,
          credits: creditAllocation,
          last_reset: new Date().toISOString(),
          next_reset: getNextResetDate(userData.billing_cycle)
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Failed to reset credits:', error);
      }
    }
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Processing failed payment:', invoice.id);

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('subscription_id', invoice.subscription);

  if (error) {
    console.error('Failed to update payment failure:', error);
  }
}

function getCreditAllocation(plan) {
  const creditMap = {
    'starter': 200,
    'creator': 500,
    'scale': 1500
  };
  return creditMap[plan?.toLowerCase()] || 0;
}

function getNextResetDate(billingCycle) {
  const now = new Date();
  if (billingCycle === 'yearly') {
    return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();
  } else {
    return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
  }
}
