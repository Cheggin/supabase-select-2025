# BetterMail Deployment Guide

This guide will help you deploy the BetterMail application with the backend on Render and frontend on Vercel.

## Prerequisites

- [ ] GitHub repository with your code
- [ ] Supabase account with database set up
- [ ] Anthropic API key (Claude)
- [ ] Resend account with API key and domain configured
- [ ] Render account
- [ ] Vercel account

## Backend Deployment (Render)

### 1. Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `supabase-select-2025`

### 2. Configure Build Settings

- **Name**: `bettermail-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `backend` (or `main`)
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn agent:app --host 0.0.0.0 --port $PORT`

### 3. Environment Variables

Add these environment variables in Render dashboard (use your actual values):

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=your-inbound-email@domain.com
FORWARD_TO_EMAIL=your-destination-email@domain.com
PYTHON_VERSION=3.12.0
```

### 4. Deploy

- Click "Create Web Service"
- Render will automatically deploy your backend
- Note your backend URL: `https://bettermail-backend.onrender.com` (or similar)

### 5. Configure Resend Webhook

1. Go to [Resend Dashboard](https://resend.com/webhooks)
2. Add new webhook endpoint: `https://YOUR-RENDER-URL.onrender.com/webhook/inbound-email`
3. Subscribe to event: `email.received`
4. Save webhook

## Frontend Deployment (Vercel)

### 1. Create New Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select `supabase-select-2025`

### 2. Configure Build Settings

- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### 3. Environment Variables

Add these in Vercel project settings:

```
VITE_SUPABASE_URL=https://cojneixwhbbgywrrwnvn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvam5laXh3aGJiZ3l3cnJ3bnZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2MDU4MjMsImV4cCI6MjA3NTE4MTgyM30.SAAoIe56ffuFObKJ6eoxyQtE1E7atJ1_RQNqUnM5cfI
VITE_BACKEND_URL=https://YOUR-RENDER-URL.onrender.com
```

⚠️ **Important**: Replace `YOUR-RENDER-URL` with your actual Render backend URL

### 4. Deploy

- Click "Deploy"
- Vercel will build and deploy your frontend
- Your app will be live at: `https://your-project.vercel.app`

## Post-Deployment Steps

### 1. Update Frontend API URL

The frontend needs to point to your production backend. Update this file:

**frontend/src/services/llmStyleGenerator.ts**

Change line 34 from:
```typescript
this.apiUrl = 'http://localhost:8000/create-style';
```

To:
```typescript
this.apiUrl = process.env.VITE_BACKEND_URL
  ? `${process.env.VITE_BACKEND_URL}/create-style`
  : 'http://localhost:8000/create-style';
```

### 2. Enable CORS on Backend

Update `backend/agent.py` to allow your Vercel frontend:

Add after line 17:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://your-project.vercel.app",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Test the Deployment

1. **Test Backend Health**: Visit `https://YOUR-RENDER-URL.onrender.com/health`
2. **Test Frontend**: Visit your Vercel URL
3. **Test Style Generation**: Create a style in the UI
4. **Test Email Processing**: Send an email to your Resend inbound address

### 4. Database Schema

Make sure your Supabase database has the correct schema. Run this SQL in Supabase SQL Editor:

```sql
-- Check if table exists, if not create it
CREATE TABLE IF NOT EXISTS email_styles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_prompt TEXT,
  styling_json JSONB NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster active style queries
CREATE INDEX IF NOT EXISTS idx_email_styles_active ON email_styles(active) WHERE active = TRUE;
```

## Troubleshooting

### Backend Issues

- **Build fails**: Check Python version is 3.12 in Render settings
- **API errors**: Verify all environment variables are set correctly
- **Webhook not working**: Ensure Resend webhook URL is correct

### Frontend Issues

- **API calls fail**: Check CORS settings and backend URL
- **Build fails**: Ensure `VITE_` prefix on all environment variables
- **Styles not loading**: Check Supabase connection and database schema

### Email Processing Issues

- **Emails not being styled**: Check Resend webhook is configured correctly
- **Styled emails not sent**: Verify `FORWARD_TO_EMAIL` and `RESEND_FROM_EMAIL` are correct

## Cost Estimates

- **Render**: Free tier available (with spin-down after inactivity)
- **Vercel**: Free tier includes hobby projects
- **Supabase**: Free tier includes 500MB database
- **Resend**: Free tier includes 100 emails/day
- **Anthropic API**: Pay per use (~$3 per million input tokens)

## Monitoring

- **Render Logs**: View in Render dashboard under "Logs"
- **Vercel Logs**: View in Vercel dashboard under "Deployments" → "Functions"
- **Supabase**: Monitor queries in Supabase dashboard

## Security Notes

⚠️ **Important Security Steps:**

1. Never commit `.env` files to git (already in `.gitignore`)
2. Rotate API keys if accidentally exposed
3. Use Supabase Row Level Security (RLS) for production
4. Consider rate limiting on backend endpoints
5. Use environment variables for all secrets

## Quick Checklist

Backend (Render):
- [ ] Repository connected
- [ ] Build command configured
- [ ] Environment variables set
- [ ] Service deployed
- [ ] Health check passes

Frontend (Vercel):
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] Environment variables set (with backend URL)
- [ ] Project deployed
- [ ] Can access UI

Integration:
- [ ] CORS enabled on backend
- [ ] Frontend API URL updated
- [ ] Resend webhook configured
- [ ] Database schema applied
- [ ] Test email processing works

---

**Your app is now live! 🎉**

Frontend: `https://your-project.vercel.app`
Backend: `https://your-backend.onrender.com`