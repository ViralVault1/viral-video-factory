# Supabase Setup Guide for Viral Video Factory

## 🎯 Overview
This guide will help you set up Supabase as the backend database for your Viral Video Factory platform, enabling user authentication, data persistence, and the credits system.

## 📋 Prerequisites
- Supabase account (free tier available)
- Your Viral Video Factory project files
- Basic understanding of SQL (optional)

## 🚀 Step 1: Create Supabase Project

### 1.1 Sign Up & Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Click "New Project"
4. Fill in project details:
   - **Name**: `viral-video-factory`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier
5. Click "Create new project"
6. Wait 2-3 minutes for project initialization

### 1.2 Get Project Credentials
1. Go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API Key** (anon/public key)
   - **Service Role Key** (keep this secret!)

## 🗄️ Step 2: Set Up Database Schema

### 2.1 Run Database Migration
1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the complete schema from `supabase/migrations/0001_complete_schema_fixed.sql`
4. Click "Run" to execute the migration
5. Verify tables are created in **Table Editor**

### 2.2 Verify Tables Created
You should see these tables:
- `profiles` - User profiles and credits
- `videos` - Generated videos
- `images` - Generated images  
- `articles` - Auto writer articles
- `licenses` - License keys
- `social_posts` - Social media posts
- `ai_personas` - AI influencer personas

## 🔐 Step 3: Configure Authentication

### 3.1 Enable Auth Providers
1. Go to **Authentication** → **Providers**
2. Enable desired providers:
   - **Email** (enabled by default)
   - **Google** (optional - requires OAuth setup)
   - **GitHub** (optional - requires OAuth setup)

### 3.2 Configure Email Settings
1. Go to **Authentication** → **Settings**
2. Configure email templates:
   - **Site URL**: `https://your-domain.vercel.app`
   - **Redirect URLs**: Add your Vercel domain
3. Customize email templates if needed

### 3.3 Set Up Row Level Security (RLS)
1. Go to **Authentication** → **Policies**
2. Enable RLS on all tables
3. Create policies for user data access:

```sql
-- Example policy for profiles table
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
```

## 💳 Step 4: Configure Credits System

### 4.1 Set Default Credits
1. Go to **Table Editor** → **profiles**
2. Set default credits value (e.g., 20)
3. Create trigger for new user registration:

```sql
-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (new.id, new.email, 20);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 4.2 Create Credit Management Functions
```sql
-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(user_id UUID, amount INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  SELECT credits INTO current_credits FROM profiles WHERE id = user_id;
  
  IF current_credits >= amount THEN
    UPDATE profiles SET credits = credits - amount WHERE id = user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔧 Step 5: Environment Variables

### 5.1 Create Environment File
Create `.env.local` in your project root:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (for admin functions)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Other API Keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
REACT_APP_MANUS_API_KEY=your-manus-api-key
```

### 5.2 Update Supabase Client
The app already includes Supabase client configuration in:
- `src/lib/supabaseClient.ts`
- `src/contexts/AuthContext.tsx`

## 🧪 Step 6: Test Database Connection

### 6.1 Test Authentication
1. Start your development server: `npm start`
2. Try signing up with a new account
3. Check if user appears in **Authentication** → **Users**
4. Verify profile created in **Table Editor** → **profiles**

### 6.2 Test Data Operations
1. Try generating content (images, videos, articles)
2. Check if data appears in respective tables
3. Verify credits are deducted properly

## 🔒 Step 7: Security Configuration

### 7.1 Configure CORS
1. Go to **Settings** → **API**
2. Add your domains to CORS origins:
   - `http://localhost:3000` (development)
   - `https://your-domain.vercel.app` (production)

### 7.2 Set Up API Rate Limiting
1. Configure rate limits in **Settings** → **API**
2. Set appropriate limits for your use case

## 📊 Step 8: Monitoring & Analytics

### 8.1 Enable Logging
1. Go to **Logs** to monitor database activity
2. Set up alerts for errors or unusual activity

### 8.2 Database Performance
1. Monitor query performance in **Reports**
2. Add indexes for frequently queried columns

## 🚨 Troubleshooting

### Common Issues:
1. **Connection Failed**: Check URL and API keys
2. **Auth Errors**: Verify redirect URLs and site URL
3. **RLS Errors**: Check row level security policies
4. **Migration Errors**: Verify SQL syntax and permissions

### Debug Steps:
1. Check browser console for errors
2. Review Supabase logs
3. Test API calls in Supabase dashboard
4. Verify environment variables are loaded

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Authentication configured
- [ ] RLS policies set up
- [ ] Credits system working
- [ ] Environment variables configured
- [ ] Local testing successful
- [ ] Security settings configured

## 🎯 Next Steps

After completing Supabase setup:
1. Deploy to Vercel (see VERCEL_DEPLOYMENT_GUIDE.md)
2. Configure production environment variables
3. Test full functionality in production
4. Set up monitoring and backups

Your Viral Video Factory will now have full database functionality with user authentication, data persistence, and a working credits system!

