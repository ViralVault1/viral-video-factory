# Vercel Deployment Guide - Step by Step

**Let's get your Viral Video Factory live on Vercel in the next 30 minutes.**

## Prerequisites Checklist

Before we start, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (free tier is fine to start)
- [ ] Supabase project set up
- [ ] Google AI Studio API key
- [ ] OpenAI API key (for TTS)

## Step 1: Prepare Your Code for Deployment

### 1.1 Create Production Build Configuration

First, let's make sure your `package.json` has the correct build scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### 1.2 Update Vite Configuration

Create/update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000
  }
})
```

## Step 2: Set Up GitHub Repository

### 2.1 Initialize Git Repository
```bash
cd /path/to/your/project
git init
git add .
git commit -m "Initial commit - Viral Video Factory with AI Agents"
```

### 2.2 Create GitHub Repository
1. Go to GitHub.com
2. Click "New Repository"
3. Name it: `viral-video-factory`
4. Make it **Private** (recommended for now)
5. Don't initialize with README (you already have code)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/viral-video-factory.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `viral-video-factory` repository

### 3.2 Configure Build Settings
Vercel should auto-detect React/Vite. Verify these settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.3 Set Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables.

Add these variables:

**Required Variables:**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_ai_studio_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

**Optional Variables:**
```
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Get your live URL: `https://your-project-name.vercel.app`

## Step 4: Set Up Supabase Database

### 4.1 Run Database Migration
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/0001_complete_schema_fixed.sql`
4. Click "Run" to execute the schema

### 4.2 Configure Row Level Security (RLS)
The migration should have set up RLS policies. Verify in:
- Supabase Dashboard → Authentication → Policies

### 4.3 Set Up Storage Buckets
1. Go to Storage in Supabase dashboard
2. Create these buckets:
   - `videos` (public)
   - `images` (public)
   - `audio` (public)

## Step 5: Test Your Deployment

### 5.1 Basic Functionality Test
1. Visit your Vercel URL
2. Test user registration/login
3. Try generating an image
4. Test video generation workflow

### 5.2 AI Agents Test
1. Navigate to AI Agents Hub
2. Test each agent with sample content
3. Verify results are returned correctly

### 5.3 Payment Test (if Stripe configured)
1. Test subscription flow
2. Use Stripe test cards
3. Verify credit system works

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6.2 SSL Certificate
Vercel automatically provides SSL certificates for all domains.

## Troubleshooting Common Issues

### Build Failures
**Error: "Module not found"**
- Check all import paths are correct
- Ensure all dependencies are in `package.json`

**Error: "Environment variable not defined"**
- Verify all required env vars are set in Vercel
- Check variable names match exactly (case-sensitive)

### Runtime Errors
**Error: "Supabase connection failed"**
- Verify Supabase URL and anon key
- Check if database schema is properly set up

**Error: "API key invalid"**
- Verify Google AI Studio API key is correct
- Check if API key has proper permissions

### Performance Issues
**Slow loading times**
- Enable Vercel Analytics
- Check bundle size in build output
- Consider code splitting for large components

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] User authentication works
- [ ] Video generation works
- [ ] AI Agents respond correctly
- [ ] Payment flow works (if configured)
- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] Custom domain configured (if applicable)

## Monitoring & Maintenance

### 5.1 Set Up Monitoring
- Enable Vercel Analytics
- Set up Supabase monitoring
- Monitor API usage and costs

### 5.2 Regular Updates
- Keep dependencies updated
- Monitor for security updates
- Regular database backups

## Next Steps After Deployment

1. **Test thoroughly** - Spend time using every feature
2. **Create content** - Use your platform to create marketing materials
3. **Gather feedback** - Share with trusted users for initial feedback
4. **Monitor performance** - Watch for any issues or bottlenecks
5. **Plan launch** - Prepare for your Product Hunt launch

## Need Help?

If you encounter any issues during deployment:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are correctly set
3. Test locally first to isolate deployment-specific issues
4. Check Supabase logs for database-related issues

**Your platform is ready for the world. Let's get it live!**

