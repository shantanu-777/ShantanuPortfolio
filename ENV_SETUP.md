# Environment Variables Setup

## Frontend Environment Variables

Create a `.env.local` file in the root directory (or set in your deployment platform):

```env
# Strapi API URL
# Development: http://localhost:1337
# Production: https://your-strapi.up.railway.app
VITE_STRAPI_URL=http://localhost:1337

# Optional: API Token if your Strapi requires authentication
# VITE_STRAPI_API_TOKEN=your-api-token-here
```

## Strapi Environment Variables

Create a `.env` file in the `portfolio-cms` directory (or set in your deployment platform):

```env
# App Environment
NODE_ENV=production

# Server Configuration
HOST=0.0.0.0
PORT=1337

# App Keys (generate random strings)
# Use: openssl rand -base64 32 (run 4 times for APP_KEYS)
APP_KEYS=your-app-key-1,your-app-key-2,your-app-key-3,your-app-key-4
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Database Configuration
# Option 1: SQLite (simple, but data resets on redeploy)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Option 2: PostgreSQL (recommended for production)
# DATABASE_CLIENT=postgres
# DATABASE_HOST=your-db-host
# DATABASE_PORT=5432
# DATABASE_NAME=your-db-name
# DATABASE_USERNAME=your-username
# DATABASE_PASSWORD=your-password
# DATABASE_SSL=true

# Frontend URL (for CORS - update after deploying frontend)
FRONTEND_URL=http://localhost:3000
```

## Generating Random Keys

You can generate secure random keys using:

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

Run this command 4 times to get 4 keys for `APP_KEYS`, and once each for the other secrets.

## Quick Key Generator Script

You can also use this Node.js one-liner:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run it multiple times to generate all your keys.

