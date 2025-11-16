# Deployment Guide for Lunaris

## Current Deployment

- **Frontend**: https://cosmic-babka-a9c6fd.netlify.app/ (Netlify)
- **Backend**: https://lunaris-production-92be.up.railway.app (Railway)
- **Status**: ✅ Deployed and Running

## 🚨 Important: Environment Variable Configuration

### Netlify Environment Variables
Ensure `NEXT_PUBLIC_API_URL` is set correctly:
```
NEXT_PUBLIC_API_URL=https://lunaris-production-92be.up.railway.app
```
**Note**: Must include `https://` and NO trailing slash

### Railway Environment Variables
Ensure these are set:
```
JWT_SECRET=<your-secure-secret>
DB_PATH=./data/sqlite.db
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://cosmic-babka-a9c6fd.netlify.app
```

**Note**: Use `./data/sqlite.db` (relative path) not `/data/sqlite.db` (absolute path)

### If Frontend Can't Connect to Backend
1. Go to Netlify Dashboard → Site settings → Environment variables
2. Verify `NEXT_PUBLIC_API_URL=https://lunaris-production-92be.up.railway.app`
3. Go to Deploys → Trigger deploy → Clear cache and deploy
4. Wait 2-3 minutes and test again

## Quick Deployment Checklist

- [x] Backend deployed to Railway ✅
- [x] Frontend deployed to Netlify ✅
- [x] Environment variables configured ✅
- [x] CORS updated with production URLs ✅
- [x] Database persistence configured ✅
- [ ] Test complete user flow in production

## Option 1: Render (Backend) + Vercel (Frontend)

### Step 1: Deploy Backend to Render

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up with GitHub for easy integration

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: lunaris-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your default branch)
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm run start:prod
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   ```
   JWT_SECRET=<generate-a-secure-random-string-here>
   DB_PATH=data/sqlite.db
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=<will-add-after-frontend-deployment>
   ```

   **Generate JWT_SECRET**: Use this command locally:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Add Persistent Disk for SQLite**
   - After service is created, go to "Disks" tab
   - Click "Add Disk"
   - Name: `lunaris-db`
   - Mount Path: `/opt/render/project/src/backend/data`
   - Size: 1 GB (free tier)
   - Click "Save"

6. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Copy your backend URL (e.g., `https://lunaris-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=<your-render-backend-url>
     ```
   - Example: `https://lunaris-backend.onrender.com`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your frontend URL (e.g., `https://lunaris.vercel.app`)

### Step 3: Update Backend CORS

1. **Go back to Render Dashboard**
   - Navigate to your backend service
   - Click "Environment"
   - Find `FRONTEND_URL` variable
   - Update value to your Vercel URL (e.g., `https://lunaris.vercel.app`)
   - Click "Save Changes"

2. **Redeploy Backend**
   - Render will automatically redeploy with new environment variable
   - Wait for deployment to complete

### Step 4: Test Production Deployment

1. Visit your Vercel URL
2. Click "Breathe" to register
3. Create a new account
4. Add an emotion entry
5. Verify it appears in the list
6. Logout and login again
7. Verify your entries persist

## Option 2: Railway (Backend) + Netlify (Frontend)

### Backend on Railway

1. **Sign up at Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway auto-detects Node.js
   - Click on the service
   - Go to "Settings"
   - Set Root Directory: `backend`

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add:
     ```
     JWT_SECRET=<secure-random-string>
     DB_PATH=/data/sqlite.db
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=<netlify-url-later>
     ```

5. **Add Volume for Database**
   - Go to "Settings" → "Volumes"
   - Click "New Volume"
   - Mount Path: `/data`
   - Size: 1GB

6. **Deploy**
   - Railway deploys automatically
   - Copy the generated URL from "Settings" → "Domains"

### Frontend on Netlify

1. **Sign up at Netlify**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Configure Build**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```

4. **Add Environment Variables**
   - Go to "Site settings" → "Environment variables"
   - Add:
     ```
     NEXT_PUBLIC_API_URL=<your-railway-backend-url>
     ```

5. **Deploy**
   - Click "Deploy site"
   - Copy your Netlify URL

6. **Update Railway Backend**
   - Go back to Railway
   - Update `FRONTEND_URL` with Netlify URL
   - Redeploy

## Troubleshooting

### Backend Issues

**Problem**: Database not persisting
- **Solution**: Ensure persistent disk/volume is mounted correctly
- Check mount path matches `DB_PATH` environment variable

**Problem**: CORS errors
- **Solution**: Verify `FRONTEND_URL` matches your frontend domain exactly
- Check backend logs for CORS-related errors

**Problem**: 500 errors on API calls
- **Solution**: Check backend logs in Render/Railway dashboard
- Verify all environment variables are set correctly
- Ensure JWT_SECRET is set

### Frontend Issues

**Problem**: Can't connect to backend
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check browser console for network errors
- Ensure backend is running and accessible

**Problem**: Build fails
- **Solution**: Check build logs in Vercel/Netlify
- Ensure all dependencies are in `package.json`
- Try building locally first: `npm run build`

**Problem**: Environment variables not working
- **Solution**: Ensure variables start with `NEXT_PUBLIC_`
- Redeploy after adding environment variables
- Clear cache and redeploy

## Post-Deployment

### Update README.md

Replace the "Live Demo" section with your actual URLs:

```markdown
**Live Demo**: 
- Frontend: https://your-app.vercel.app
- Backend API: https://your-backend.onrender.com
```

### Monitor Your Application

**Render/Railway**:
- Check logs regularly for errors
- Monitor database size
- Set up alerts for downtime

**Vercel/Netlify**:
- Check Analytics for traffic
- Monitor build times
- Review error logs

### Free Tier Limitations

**Render Free Tier**:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Railway Free Tier**:
- $5 credit per month
- No sleep/spin-down
- Better for always-on services

**Vercel Free Tier**:
- Unlimited deployments
- 100GB bandwidth/month
- Excellent for frontend

**Netlify Free Tier**:
- 100GB bandwidth/month
- 300 build minutes/month
- Good for frontend

## Security Checklist

- [ ] JWT_SECRET is a strong, random string (64+ characters)
- [ ] Environment variables are not committed to Git
- [ ] CORS is restricted to your frontend domain only
- [ ] HTTPS is enabled (automatic on Render/Vercel/Railway/Netlify)
- [ ] Database backups are configured (manual for free tier)
- [ ] Rate limiting is enabled on auth endpoints

## Backup Strategy

### Manual Backup (Free Tier)

1. **Download SQLite Database**
   - SSH into Render/Railway (if available)
   - Or use a backup endpoint in your API
   - Download the `sqlite.db` file

2. **Automated Backup** (Recommended for production)
   - Set up a cron job to backup database
   - Store backups in AWS S3 or similar
   - Keep at least 7 days of backups

## Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com

---

Good luck with your deployment! 🚀
