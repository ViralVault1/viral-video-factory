# Viral Video Factory - Deployment Guide

## Overview
This guide covers deploying the Viral Video Factory platform to Vercel with full Manus API integration.

## Prerequisites
- Node.js 18+ installed
- Vercel account
- Supabase project set up
- Stripe account (for payments)
- Manus API access

## Environment Variables

### Required Environment Variables
Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration  
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key

# Manus API Configuration
REACT_APP_MANUS_API_BASE=https://api.manus.im

# OpenAI Configuration (optional)
REACT_APP_OPENAI_API_KEY=sk-your_openai_key

# Application Configuration
REACT_APP_APP_NAME=Viral Video Factory
REACT_APP_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=production

# Feature Flags
REACT_APP_ENABLE_AI_AGENTS=true
REACT_APP_ENABLE_MANUS_API=true
REACT_APP_ENABLE_ANALYTICS=true
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### 3. Start Development Server
```bash
npm start
```

### 4. Build for Production
```bash
npm run build
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

### 4. Configure Environment Variables in Vercel
In your Vercel dashboard, add these environment variables:

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- `REACT_APP_MANUS_API_BASE`
- `REACT_APP_OPENAI_API_KEY`
- `REACT_APP_ENABLE_AI_AGENTS`
- `REACT_APP_ENABLE_MANUS_API`
- `REACT_APP_ENABLE_ANALYTICS`

## Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project URL and anon key

### 2. Run Database Migrations
```sql
-- Run the SQL from supabase/migrations/ in your Supabase SQL editor
```

### 3. Set Up Row Level Security (RLS)
Enable RLS on all tables and configure appropriate policies.

## Manus API Integration

### 1. API Access
Ensure you have access to Manus API Hub with the following endpoints:
- YouTube Search API
- YouTube Channel Details API
- TikTok Search API
- TikTok User Posts API

### 2. API Configuration
The platform uses these Manus APIs:
- `Youtube/search` - For content research
- `Youtube/get_channel_details` - For competitor analysis
- `Youtube/get_channel_videos` - For performance analysis
- `Tiktok/search_tiktok_video_general` - For trend analysis
- `Tiktok/get_user_popular_posts` - For influencer analysis

## Features Enabled

### AI Agents
- **Content Strategy Agent** - Trend analysis and content planning
- **Script Optimization Agent** - Viral script enhancement
- **Performance Analytics Agent** - Video performance insights
- **Brand Consistency Agent** - Brand alignment checking

### Core Features
- Video generation workflow
- AI-powered content optimization
- Performance analytics dashboard
- Brand consistency tools
- Social media integration
- License generation system

## Monitoring and Analytics

### Performance Monitoring
- Vercel Analytics automatically enabled
- Custom performance tracking in app
- Error boundary reporting

### User Analytics
- Supabase Analytics for user behavior
- Custom event tracking for AI agent usage
- Performance metrics for video generation

## Security Considerations

### API Security
- All API keys stored as environment variables
- Client-side API calls use public keys only
- Sensitive operations handled server-side

### Data Protection
- User data encrypted in Supabase
- GDPR compliance features
- Secure authentication flow

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check all environment variables are set
   - Ensure Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`

2. **API Connection Issues**
   - Verify Manus API access
   - Check CORS configuration
   - Validate API endpoints

3. **Database Connection**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure migrations are applied

### Support
For deployment issues, check:
1. Vercel deployment logs
2. Browser console for client errors
3. Supabase logs for database issues
4. Manus API documentation for integration help

## Performance Optimization

### Build Optimization
- Code splitting enabled
- Tree shaking for unused code
- Optimized bundle sizes

### Runtime Performance
- Lazy loading for AI agents
- Caching for API responses
- Optimized re-renders

### SEO Optimization
- Meta tags configured
- Open Graph tags
- Structured data markup

## Scaling Considerations

### Traffic Scaling
- Vercel automatically scales
- CDN distribution included
- Edge function support

### Database Scaling
- Supabase auto-scaling
- Connection pooling
- Read replicas for analytics

### API Rate Limiting
- Manus API rate limits respected
- Client-side request queuing
- Graceful degradation

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update AI models periodically

### Backup Strategy
- Supabase automatic backups
- Code repository backups
- Environment variable documentation

## Success Metrics

### Key Performance Indicators
- User engagement rates
- Video generation success rate
- AI agent usage statistics
- Platform performance metrics

### Business Metrics
- User acquisition cost
- Lifetime value
- Conversion rates
- Feature adoption rates

