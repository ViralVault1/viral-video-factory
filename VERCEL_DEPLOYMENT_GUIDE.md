# Vercel Deployment Guide for Viral Video Factory

## 🎯 Overview
This guide will help you deploy your Viral Video Factory platform to Vercel for production hosting with custom domain, environment variables, and full functionality.

## 📋 Prerequisites
- Vercel account (free tier available)
- GitHub account with your project repository
- Supabase project set up (see SUPABASE_SETUP_GUIDE.md)
- Your project built and tested locally

## 🚀 Step 1: Prepare Your Repository

### 1.1 Push to GitHub
1. Create a new repository on GitHub:
   - Name: `viral-video-factory`
   - Visibility: Private (recommended)
2. Push your project to GitHub:

```bash
cd viral-video-factory-cra
git init
git add .
git commit -m "Initial commit - Viral Video Factory"
git branch -M main
git remote add origin https://github.com/yourusername/viral-video-factory.git
git push -u origin main
```

### 1.2 Verify Build Configuration
Ensure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "start": "react-scripts start"
  }
}
```

### 1.3 Check Vercel Configuration
Your project already includes `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your `viral-video-factory` repository
5. Configure project settings:
   - **Project Name**: `viral-video-factory`
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 2.2 Configure Environment Variables
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add all required variables:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key

# Manus API Configuration
REACT_APP_MANUS_API_KEY=your-manus-api-key

# OpenAI Configuration (if using)
REACT_APP_OPENAI_API_KEY=your-openai-key

# App Configuration
REACT_APP_APP_URL=https://your-domain.vercel.app
```

### 2.3 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Get your deployment URL (e.g., `https://viral-video-factory-xxx.vercel.app`)

## 🔧 Step 3: Configure Custom Domain

### 3.1 Add Custom Domain
1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `viralvideofactory.com`)
3. Configure DNS records with your domain provider:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 3.2 SSL Certificate
- Vercel automatically provisions SSL certificates
- Wait 24-48 hours for DNS propagation
- Verify HTTPS is working

## 🔐 Step 4: Update Supabase Configuration

### 4.1 Update Site URL
1. Go to Supabase **Authentication** → **Settings**
2. Update **Site URL** to your Vercel domain:
   - `https://your-domain.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/**`

### 4.2 Update CORS Settings
1. Go to Supabase **Settings** → **API**
2. Add your Vercel domain to CORS origins:
   - `https://your-domain.vercel.app`

## 🧪 Step 5: Test Production Deployment

### 5.1 Functionality Testing
Test all major features:
- [ ] User registration/login
- [ ] Dashboard navigation
- [ ] Video generation workflow
- [ ] Image generation
- [ ] Auto Writer functionality
- [ ] Social Media Suite
- [ ] AI Influencer Studio
- [ ] Pricing page
- [ ] Credits system
- [ ] License redemption

### 5.2 Performance Testing
1. Check page load speeds
2. Test on mobile devices
3. Verify responsive design
4. Test with slow internet connections

## 📊 Step 6: Set Up Analytics & Monitoring

### 6.1 Vercel Analytics
1. Go to **Analytics** in Vercel dashboard
2. Enable Web Analytics
3. Add analytics script to your app (optional)

### 6.2 Error Monitoring
1. Set up error tracking (Sentry, LogRocket, etc.)
2. Configure alerts for critical errors
3. Monitor performance metrics

### 6.3 Uptime Monitoring
1. Set up uptime monitoring (UptimeRobot, Pingdom)
2. Configure alerts for downtime
3. Monitor API response times

## 🔄 Step 7: Set Up Continuous Deployment

### 7.1 Automatic Deployments
Vercel automatically deploys when you push to main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys
```

### 7.2 Preview Deployments
- Every pull request gets a preview deployment
- Test changes before merging to main
- Share preview links with team/clients

### 7.3 Rollback Strategy
1. Keep track of working deployments
2. Use Vercel's rollback feature if needed
3. Test rollbacks in preview environment first

## 🛡️ Step 8: Security & Performance

### 8.1 Security Headers
Add security headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 8.2 Performance Optimization
1. Enable Vercel's Edge Network
2. Configure caching headers
3. Optimize images and assets
4. Use Vercel's Image Optimization

## 💰 Step 9: Configure Payments (Stripe)

### 9.1 Stripe Setup
1. Create Stripe account
2. Get API keys (test and live)
3. Configure webhooks:
   - Endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`

### 9.2 Test Payment Flow
1. Test with Stripe test cards
2. Verify credit allocation
3. Test subscription management

## 📈 Step 10: SEO & Marketing Setup

### 10.1 SEO Configuration
1. Add meta tags and Open Graph data
2. Configure sitemap.xml
3. Set up Google Analytics
4. Submit to Google Search Console

### 10.2 Social Media Integration
1. Configure social sharing
2. Add social media meta tags
3. Set up social login (optional)

## 🚨 Troubleshooting

### Common Deployment Issues:

1. **Build Failures**:
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Test build locally: `npm run build`

2. **Environment Variable Issues**:
   - Verify all variables are set in Vercel
   - Check variable names (must start with REACT_APP_)
   - Redeploy after adding variables

3. **Routing Issues**:
   - Verify vercel.json configuration
   - Check React Router setup
   - Test all routes manually

4. **API Connection Issues**:
   - Verify Supabase URL and keys
   - Check CORS configuration
   - Test API calls in browser console

### Debug Steps:
1. Check Vercel function logs
2. Use browser developer tools
3. Test API endpoints directly
4. Verify environment variables are loaded

## ✅ Production Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Environment variables set
- [ ] Supabase URLs updated
- [ ] All features tested in production
- [ ] Analytics and monitoring set up
- [ ] Payment system tested
- [ ] SEO configuration complete
- [ ] Error monitoring active
- [ ] Backup strategy in place

## 🎯 Post-Deployment Tasks

1. **Marketing Launch**:
   - Announce on social media
   - Submit to product directories
   - Create launch content

2. **User Feedback**:
   - Set up feedback collection
   - Monitor user behavior
   - Iterate based on feedback

3. **Scaling Preparation**:
   - Monitor resource usage
   - Plan for traffic spikes
   - Consider CDN optimization

## 🔄 Maintenance & Updates

### Regular Tasks:
- Monitor error rates and performance
- Update dependencies monthly
- Review and optimize database queries
- Backup critical data
- Test disaster recovery procedures

### Scaling Considerations:
- Monitor Vercel usage limits
- Consider upgrading Supabase plan
- Implement caching strategies
- Optimize for mobile performance

Your Viral Video Factory is now live and ready for users! 🚀

## 📞 Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **React Documentation**: [reactjs.org/docs](https://reactjs.org/docs)

Remember to keep your API keys secure and never commit them to your repository!

