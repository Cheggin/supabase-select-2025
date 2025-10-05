# Quick Deployment Checklist ✅

## Before You Deploy

- [ ] Push all code changes to GitHub
- [ ] Database schema is applied in Supabase (run `supabase-schema.sql`)

## Backend Deployment (Render)

### Setup Steps:
1. [ ] Go to [Render Dashboard](https://dashboard.render.com/)
2. [ ] Click "New +" → "Web Service"
3. [ ] Connect GitHub repo: `supabase-select-2025`
4. [ ] Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn agent:app --host 0.0.0.0 --port $PORT`

### Environment Variables:
Copy these to Render (use your actual values):
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=your-inbound-email@domain.com
FORWARD_TO_EMAIL=your-destination-email@domain.com
PYTHON_VERSION=3.12.0
```

5. [ ] Click "Create Web Service"
6. [ ] **Copy your backend URL** (e.g., `https://bettermail-backend.onrender.com`)
7. [ ] Test: Visit `https://YOUR-BACKEND-URL/health`

### Configure Resend Webhook:
8. [ ] Go to [Resend Webhooks](https://resend.com/webhooks)
9. [ ] Add webhook: `https://YOUR-BACKEND-URL/webhook/inbound-email`
10. [ ] Subscribe to: `email.received`

## Frontend Deployment (Vercel)

### Setup Steps:
1. [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. [ ] Click "Add New" → "Project"
3. [ ] Import repo: `supabase-select-2025`
4. [ ] Configure:
   - **Root Directory**: `frontend`
   - Framework: Vite (auto-detected)

### Environment Variables:
Add these in Vercel settings:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_BACKEND_URL=https://YOUR-RENDER-BACKEND-URL
```

⚠️ **IMPORTANT**: Replace `YOUR-RENDER-BACKEND-URL` with actual Render URL from step 6 above!

5. [ ] Click "Deploy"
6. [ ] Wait for build to complete
7. [ ] **Copy your frontend URL** (e.g., `https://your-project.vercel.app`)

## Final Testing

- [ ] Visit your Vercel frontend URL
- [ ] Try generating a style (should call backend API)
- [ ] Check style is saved in Supabase
- [ ] Activate a style
- [ ] Send test email to your Resend inbound address
- [ ] Verify styled email arrives at `FORWARD_TO_EMAIL`

## Troubleshooting

### Backend won't start:
- Check Render logs for errors
- Verify all env vars are set
- Ensure Python version is 3.12

### Frontend can't connect to backend:
- Check CORS error in browser console
- Verify `VITE_BACKEND_URL` is correct
- Check backend `/health` endpoint works

### Emails not processing:
- Check Resend webhook is configured
- View Render logs for webhook errors
- Verify `FORWARD_TO_EMAIL` is set

## What's Fixed for Production:

✅ **No more hardcoded localhost!**
- Frontend uses `VITE_BACKEND_URL` environment variable
- Falls back to localhost for local dev

✅ **CORS configured**
- Backend accepts requests from Vercel domains
- Localhost allowed for development

✅ **Environment variables**
- All secrets stored in platform env vars
- No hardcoded API keys

---

**You're all set!** 🚀

Once deployed:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`