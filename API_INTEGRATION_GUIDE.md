# API Integration Guide for Viral Video Factory

## 🎯 Overview
This guide covers integrating all external APIs and services needed for full platform functionality.

## 🔑 Required API Keys & Services

### 1. Supabase (Database & Authentication)
- **Purpose**: User management, data storage, authentication
- **Cost**: Free tier available, paid plans from $25/month
- **Setup**: See SUPABASE_SETUP_GUIDE.md

### 2. Stripe (Payment Processing)
- **Purpose**: Subscription management, payment processing
- **Cost**: 2.9% + 30¢ per transaction
- **Required Keys**:
  - Publishable Key (pk_test_... / pk_live_...)
  - Secret Key (sk_test_... / sk_live_...)
  - Webhook Secret

### 3. Manus API (AI Capabilities)
- **Purpose**: Enhanced AI features, content generation
- **Cost**: Variable based on usage
- **Required Keys**:
  - API Key
  - Base URL

### 4. OpenAI (Optional - AI Features)
- **Purpose**: GPT-4 integration, content generation
- **Cost**: Pay-per-use, varies by model
- **Required Keys**:
  - API Key (sk-...)

### 5. Additional Services (Optional)
- **Google Analytics**: Website analytics
- **Sentry**: Error monitoring
- **SendGrid/Mailgun**: Email services
- **Cloudinary**: Image/video processing

## 🔧 Environment Variables Configuration

### Development (.env.local)
```env
# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Test Keys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890...
STRIPE_SECRET_KEY=sk_test_51234567890...
STRIPE_WEBHOOK_SECRET=whsec_1234567890...

# Manus API
REACT_APP_MANUS_API_KEY=manus_api_key_here
REACT_APP_MANUS_API_BASE=https://api.manus.im

# OpenAI (Optional)
REACT_APP_OPENAI_API_KEY=sk-1234567890...

# App Configuration
REACT_APP_APP_URL=http://localhost:3000
REACT_APP_ENVIRONMENT=development
```

### Production (Vercel Environment Variables)
```env
# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Live Keys)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51234567890...
STRIPE_SECRET_KEY=sk_live_51234567890...
STRIPE_WEBHOOK_SECRET=whsec_1234567890...

# Manus API
REACT_APP_MANUS_API_KEY=manus_live_api_key_here
REACT_APP_MANUS_API_BASE=https://api.manus.im

# OpenAI (Optional)
REACT_APP_OPENAI_API_KEY=sk-1234567890...

# App Configuration
REACT_APP_APP_URL=https://your-domain.com
REACT_APP_ENVIRONMENT=production

# Analytics (Optional)
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_SENTRY_DSN=https://...@sentry.io/...
```

## 🔌 API Integration Details

### 1. Supabase Integration

#### Authentication Setup
```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### User Management
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
const { error } = await supabase.auth.signOut()
```

#### Data Operations
```typescript
// Insert data
const { data, error } = await supabase
  .from('videos')
  .insert([
    { title: 'My Video', user_id: userId, credits_used: 10 }
  ])

// Query data
const { data, error } = await supabase
  .from('profiles')
  .select('credits')
  .eq('id', userId)
  .single()
```

### 2. Stripe Integration

#### Payment Setup
```typescript
// src/services/stripeService.ts
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!)

export const createCheckoutSession = async (priceId: string) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId }),
  })
  
  const session = await response.json()
  const stripe = await stripePromise
  
  return stripe?.redirectToCheckout({ sessionId: session.id })
}
```

#### Webhook Handling (Vercel Function)
```typescript
// api/stripe/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature']!
    
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      
      switch (event.type) {
        case 'checkout.session.completed':
          // Handle successful payment
          await handleSuccessfulPayment(event.data.object)
          break
        case 'invoice.payment_succeeded':
          // Handle subscription renewal
          await handleSubscriptionRenewal(event.data.object)
          break
      }
      
      res.json({ received: true })
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
    }
  }
}
```

### 3. Manus API Integration

#### Service Setup
```typescript
// src/services/manusApiService.ts
class ManusApiService {
  private baseURL = process.env.REACT_APP_MANUS_API_BASE!
  private apiKey = process.env.REACT_APP_MANUS_API_KEY!

  async generateContent(prompt: string, type: 'video' | 'image' | 'text') {
    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, type }),
    })
    
    return response.json()
  }

  async getTrendingTopics(platform: string) {
    const response = await fetch(`${this.baseURL}/trends/${platform}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })
    
    return response.json()
  }
}

export const manusApi = new ManusApiService()
```

### 4. OpenAI Integration (Optional)

#### Service Setup
```typescript
// src/services/openaiService.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true // Only for client-side usage
})

export const generateScript = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a viral content creator. Generate engaging video scripts."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "gpt-4",
    max_tokens: 500,
  })
  
  return completion.choices[0].message.content
}
```

## 🔒 Security Best Practices

### 1. API Key Management
- **Never commit API keys to repository**
- **Use environment variables for all keys**
- **Rotate keys regularly**
- **Use different keys for development and production**
- **Implement key rotation strategy**

### 2. Rate Limiting
```typescript
// Implement rate limiting for API calls
const rateLimiter = {
  calls: 0,
  resetTime: Date.now() + 60000, // 1 minute
  
  async checkLimit() {
    if (Date.now() > this.resetTime) {
      this.calls = 0
      this.resetTime = Date.now() + 60000
    }
    
    if (this.calls >= 100) { // 100 calls per minute
      throw new Error('Rate limit exceeded')
    }
    
    this.calls++
  }
}
```

### 3. Error Handling
```typescript
// Robust error handling for API calls
export const apiCall = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    
    // Log to error monitoring service
    if (process.env.REACT_APP_SENTRY_DSN) {
      // Sentry.captureException(error)
    }
    
    throw error
  }
}
```

## 🧪 Testing API Integrations

### 1. Unit Tests
```typescript
// src/services/__tests__/manusApiService.test.ts
import { manusApi } from '../manusApiService'

describe('ManusApiService', () => {
  test('should generate content', async () => {
    const result = await manusApi.generateContent('test prompt', 'text')
    expect(result).toBeDefined()
    expect(result.content).toBeTruthy()
  })
})
```

### 2. Integration Tests
```typescript
// Test full workflow
describe('Video Generation Workflow', () => {
  test('should complete full video generation', async () => {
    // 1. Generate script
    const script = await generateScript('productivity tips')
    
    // 2. Generate video
    const video = await generateVideo(script)
    
    // 3. Save to database
    const saved = await saveVideo(video)
    
    // 4. Deduct credits
    const creditsDeducted = await deductCredits(userId, 10)
    
    expect(creditsDeducted).toBe(true)
  })
})
```

### 3. API Monitoring
```typescript
// Monitor API health
export const healthCheck = async () => {
  const services = [
    { name: 'Supabase', url: process.env.REACT_APP_SUPABASE_URL },
    { name: 'Manus API', url: process.env.REACT_APP_MANUS_API_BASE },
  ]
  
  const results = await Promise.allSettled(
    services.map(async (service) => {
      const response = await fetch(`${service.url}/health`)
      return { name: service.name, status: response.ok }
    })
  )
  
  return results
}
```

## 📊 Usage Monitoring & Analytics

### 1. API Usage Tracking
```typescript
// Track API usage for billing and optimization
export const trackApiUsage = async (service: string, endpoint: string, cost: number) => {
  await supabase
    .from('api_usage')
    .insert([
      {
        user_id: userId,
        service,
        endpoint,
        cost,
        timestamp: new Date().toISOString()
      }
    ])
}
```

### 2. Performance Monitoring
```typescript
// Monitor API response times
export const monitorApiPerformance = async (apiCall: () => Promise<any>) => {
  const startTime = Date.now()
  
  try {
    const result = await apiCall()
    const duration = Date.now() - startTime
    
    // Log performance metrics
    console.log(`API call completed in ${duration}ms`)
    
    return result
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`API call failed after ${duration}ms:`, error)
    throw error
  }
}
```

## 🔄 Backup & Fallback Strategies

### 1. Service Fallbacks
```typescript
// Implement fallback for critical services
export const generateContentWithFallback = async (prompt: string) => {
  try {
    // Try primary service (Manus API)
    return await manusApi.generateContent(prompt, 'text')
  } catch (error) {
    console.warn('Primary service failed, trying fallback')
    
    try {
      // Fallback to OpenAI
      return await generateScript(prompt)
    } catch (fallbackError) {
      console.error('All services failed')
      throw new Error('Content generation temporarily unavailable')
    }
  }
}
```

### 2. Caching Strategy
```typescript
// Cache API responses to reduce costs and improve performance
const cache = new Map()

export const cachedApiCall = async (key: string, apiCall: () => Promise<any>, ttl = 300000) => {
  const cached = cache.get(key)
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  
  const data = await apiCall()
  cache.set(key, { data, timestamp: Date.now() })
  
  return data
}
```

## 📋 Troubleshooting Common Issues

### 1. Authentication Errors
- **Check API keys are correct and not expired**
- **Verify environment variables are loaded**
- **Check API key permissions and scopes**

### 2. CORS Issues
- **Add your domain to API service CORS settings**
- **Check if API supports browser-based requests**
- **Consider using server-side proxy for sensitive APIs**

### 3. Rate Limiting
- **Implement exponential backoff**
- **Cache responses when possible**
- **Monitor usage and upgrade plans as needed**

### 4. Network Issues
- **Implement retry logic with exponential backoff**
- **Add timeout handling**
- **Provide user feedback for slow operations**

## ✅ Integration Checklist

- [ ] All required API keys obtained
- [ ] Environment variables configured
- [ ] Services integrated and tested
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up
- [ ] Fallback strategies implemented
- [ ] Security measures in place
- [ ] Documentation updated
- [ ] Team trained on API usage

Your Viral Video Factory now has comprehensive API integration for full functionality! 🚀

