# Deployment Guide: Viral Video Factory

This guide will help you deploy the Viral Video Factory application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
3. **Google AI Studio API Key**: Get your key from [aistudio.google.com](https://aistudio.google.com)

## Step 1: Prepare Your Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the database migration script from `supabase/migrations/0000_initial_schema.sql`
4. Deploy the Supabase Edge Functions from the `supabase/functions/` directory

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the Vite framework

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

### Required Variables:
- `API_KEY`: Your Gemini API key from Google AI Studio
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Optional Variables (for additional features):
- `PEXELS_API_KEY`: For stock video search
- `STRIPE_PUBLISHABLE_KEY`: For payment processing
- `LUMA_API_KEY`: For Luma Dream Machine video generation
- `TWITTER_CLIENT_ID`: For X (Twitter) OAuth integration

## Step 4: Redeploy

After setting environment variables, trigger a new deployment:
- Go to **Deployments** tab in Vercel dashboard
- Click "Redeploy" on the latest deployment

## Step 5: Test Your Deployment

1. Visit your deployed URL
2. Test the core functionality:
   - User registration/login
   - Video generation workflow
   - Payment processing (if Stripe is configured)

## Troubleshooting

### Common Issues:

1. **"Gemini API Key not configured"**
   - Ensure `API_KEY` is set in Vercel environment variables
   - Redeploy after adding the variable

2. **"Supabase Configuration Required"**
   - Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correctly set
   - Check that your Supabase project is active

3. **Database errors**
   - Ensure you've run the database migration script
   - Check that Supabase Edge Functions are deployed

4. **Build failures**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly listed in package.json

## Security Notes

- Never commit API keys to your repository
- Use Vercel's environment variables for all sensitive configuration
- Regularly rotate your API keys
- Monitor your API usage to prevent unexpected charges

## Support

For deployment issues:
1. Check Vercel's deployment logs
2. Review Supabase project logs
3. Ensure all required environment variables are set

