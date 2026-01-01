# Quick Deployment Guide

## 🚀 Fast Track Deployment

### Step 1: Deploy Strapi (5 minutes)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Set **Root Directory** to: `portfolio-cms`
5. Add these environment variables:
   ```
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=1337
   APP_KEYS=key1,key2,key3,key4
   API_TOKEN_SALT=salt1
   ADMIN_JWT_SECRET=secret1
   TRANSFER_TOKEN_SALT=salt2
   JWT_SECRET=secret2
   ```
   *(Generate random strings for keys - use: `openssl rand -base64 32`)*
6. Wait for deployment
7. Copy your Strapi URL (e.g., `https://your-app.up.railway.app`)

### Step 2: Configure Strapi CORS

Update `portfolio-cms/config/middlewares.ts` - the CORS origin should include your frontend URL. After deploying frontend, update this file and redeploy Strapi.

### Step 3: Deploy Frontend (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project"
3. Import your GitHub repo
4. Settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variable:
   ```
   VITE_STRAPI_URL=https://your-app.up.railway.app
   ```
   (Use the Strapi URL from Step 1)
6. Deploy!

### Step 4: Access Strapi Admin

1. Go to `https://your-strapi-url.up.railway.app/admin`
2. Create admin account
3. Start adding content!

## ✅ How Content Updates Work

**Your portfolio automatically fetches content from Strapi!**

- ✅ Update content in Strapi → Changes appear on website immediately
- ✅ No code changes needed
- ✅ No redeployment needed
- ✅ Just refresh the page to see updates

### To Update Content:

1. Go to Strapi admin: `https://your-strapi-url/admin`
2. Edit any content (Projects, Hero, Experiences, etc.)
3. Click "Save" or "Publish"
4. Done! Changes are live.

## 🔧 Important Notes

1. **After deploying frontend**, update Strapi CORS to include your frontend URL
2. **Database**: Railway offers PostgreSQL - add it as a service for persistent data
3. **Images**: Make sure Strapi uploads are working correctly

## 📚 Full Guide

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)




