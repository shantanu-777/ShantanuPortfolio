# Deployment Guide

This guide will help you deploy your portfolio frontend and Strapi CMS, and explain how content updates work.

## Overview

Your portfolio consists of two parts:
1. **Frontend** (React + Vite) - The portfolio website
2. **Strapi CMS** - Content management system for updating portfolio content

## Prerequisites

- GitHub account (for version control)
- Accounts on deployment platforms:
  - **Frontend**: Vercel (recommended) or Netlify
  - **Strapi**: Railway, Render, or Heroku

---

## Part 1: Deploy Strapi CMS

### Option A: Deploy to Railway (Recommended - Easiest)

1. **Prepare your Strapi project:**
   - Go to `portfolio-cms` folder
   - Create a `.env` file (see `.env.example` in `portfolio-cms` folder)

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect it's a Node.js project
   - Set the root directory to `portfolio-cms`
   - Add environment variables in Railway dashboard:
     ```
     NODE_ENV=production
     HOST=0.0.0.0
     PORT=1337
     APP_KEYS=your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4
     API_TOKEN_SALT=your-api-token-salt
     ADMIN_JWT_SECRET=your-admin-jwt-secret
     TRANSFER_TOKEN_SALT=your-transfer-token-salt
     JWT_SECRET=your-jwt-secret
     ```
   - Generate random strings for the keys (you can use: `openssl rand -base64 32`)
   - Railway will automatically deploy and give you a URL like: `https://your-strapi.up.railway.app`

3. **Configure Database:**
   - Railway offers PostgreSQL addon
   - Add PostgreSQL service to your project
   - Update your Strapi database config to use PostgreSQL (see `portfolio-cms/config/database.ts`)
   - Or use SQLite for simpler setup (data will reset on redeploy)

4. **Access Strapi Admin:**
   - Go to `https://your-strapi.up.railway.app/admin`
   - Create your admin account
   - Your Strapi is now live! 🎉

### Option B: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `portfolio-cms`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - Add environment variables (same as Railway)
5. Deploy!

---

## Part 2: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

1. **Prepare your project:**
   - Make sure your code is pushed to GitHub
   - Create `.env.production` file in root directory:
     ```
     VITE_STRAPI_URL=https://your-strapi.up.railway.app
     VITE_STRAPI_API_TOKEN=your-api-token-if-needed
     ```
   - **Don't commit `.env.production`** - we'll add it in Vercel

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `.` (root)
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   - Add Environment Variables:
     - `VITE_STRAPI_URL` = `https://your-strapi.up.railway.app`
     - `VITE_STRAPI_API_TOKEN` = (optional, if you need API token)
   - Click "Deploy"
   - Your portfolio is now live! 🚀

3. **Custom Domain (Optional):**
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain

### Option B: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Build settings:
   - **Base directory**: `.`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Add environment variables in Site settings → Environment variables
6. Deploy!

---

## Part 3: How Content Updates Work

### Automatic Content Updates

Your portfolio **automatically fetches content from Strapi** when users visit your site. This means:

✅ **No redeployment needed** - When you update content in Strapi, it immediately reflects on your website

### How It Works:

1. **User visits your portfolio** → Frontend makes API calls to Strapi
2. **You update content in Strapi** → Changes are saved in Strapi database
3. **Next time user visits/refreshes** → Frontend fetches latest content from Strapi

### Updating Content:

1. Go to your Strapi admin panel: `https://your-strapi.up.railway.app/admin`
2. Log in with your admin credentials
3. Navigate to any content type (Hero, Projects, Experiences, etc.)
4. Make your changes
5. Click "Save" or "Publish"
6. **That's it!** Changes are live immediately

### Important Notes:

- **Images**: Make sure Strapi's upload provider is configured correctly for production
- **CORS**: Ensure Strapi allows requests from your frontend domain
- **API Access**: Your Strapi API should be publicly accessible (read-only for content)

---

## Part 4: Configure CORS in Strapi

To allow your frontend to fetch data from Strapi, you need to configure CORS:

1. In `portfolio-cms/config/middlewares.ts`, add your frontend URL:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

2. Create or update `portfolio-cms/config/middlewares.ts`:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'http://localhost:3000',
        'https://your-portfolio.vercel.app', // Your frontend URL
        'https://your-custom-domain.com', // Your custom domain if any
      ],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## Part 5: Environment Variables Summary

### Frontend (.env.production)
```
VITE_STRAPI_URL=https://your-strapi.up.railway.app
VITE_STRAPI_API_TOKEN=optional-api-token
```

### Strapi (.env in portfolio-cms)
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-secret
TRANSFER_TOKEN_SALT=your-salt
JWT_SECRET=your-secret
DATABASE_CLIENT=sqlite
# OR for PostgreSQL:
# DATABASE_CLIENT=postgres
# DATABASE_HOST=your-db-host
# DATABASE_PORT=5432
# DATABASE_NAME=your-db-name
# DATABASE_USERNAME=your-username
# DATABASE_PASSWORD=your-password
```

---

## Troubleshooting

### Frontend can't fetch data from Strapi
- Check CORS configuration in Strapi
- Verify `VITE_STRAPI_URL` is correct
- Check Strapi is running and accessible

### Images not loading
- Check Strapi upload provider configuration
- Verify image URLs are absolute (include domain)
- Check CORS allows image requests

### Strapi admin not accessible
- Verify environment variables are set correctly
- Check database connection
- Review deployment logs

---

## Quick Start Checklist

- [ ] Deploy Strapi to Railway/Render
- [ ] Configure Strapi environment variables
- [ ] Set up database (PostgreSQL or SQLite)
- [ ] Access Strapi admin and create account
- [ ] Configure CORS in Strapi
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Set frontend environment variables
- [ ] Test portfolio is fetching data from Strapi
- [ ] Update content in Strapi and verify it appears on site
- [ ] (Optional) Set up custom domain

---

## Need Help?

- Strapi Docs: https://docs.strapi.io
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app

