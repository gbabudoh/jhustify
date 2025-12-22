# Environment Variables Setup Guide

## Quick Setup

1. **Copy the template file:**
   ```bash
   cp .env.local.template .env.local
   ```

2. **Edit `.env.local` with your values:**

### Required Variables

#### MONGODB_URI
- **Local MongoDB:** `mongodb://localhost:27017/jhustify`
- **MongoDB Atlas:** `mongodb+srv://username:password@cluster.mongodb.net/jhustify?retryWrites=true&w=majority`
- **Other:** Your MongoDB connection string

#### JWT_SECRET
Generate a strong random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or use an online generator: https://generate-secret.vercel.app/32

**Example:** `SALEnmKLhfnj8pYHEx4cDgO7zoJ2IDc110Bm+FLILD4=`

### Optional Variables

#### NEXT_PUBLIC_API_URL
- Leave empty for relative URLs (recommended for development)
- Set to your API domain for production: `https://api.yourdomain.com`

## Example .env.local File

```env
# Database
MONGODB_URI=mongodb://localhost:27017/jhustify

# JWT Secret (use the generated secret from above)
JWT_SECRET=SALEnmKLhfnj8pYHEx4cDgO7zoJ2IDc110Bm+FLILD4=

# API URL (leave empty for development)
NEXT_PUBLIC_API_URL=
```

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/jhustify`

### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `<password>` with your database password
5. Use the full connection string in `MONGODB_URI`

## Security Notes

⚠️ **Never commit `.env.local` to version control!**
- It's already in `.gitignore`
- Contains sensitive credentials
- Each developer should have their own `.env.local`

## Verification

After setting up `.env.local`, restart your development server:
```bash
npm run dev
```

The app should connect to your database and use the JWT secret for authentication.

