# 🚀 Quick Start - Deploy to Railway in 10 Minutes

## Option 1: One-Click Deploy (Fastest)

### Deploy Backend

1. **Create GitHub Repository**
   ```bash
   cd C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo at github.com/new first
   git remote add origin https://github.com/YOUR_USERNAME/zap-trading.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select `zap-trading`
   - Click "Deploy"

3. **Add Services**
   - Click "New Service" → "Database" → "PostgreSQL"
   - Click "New Service" → "Database" → "Redis"

4. **Set Environment Variables**
   - Go to backend service → Variables
   - Add: `JWT_SECRET` = generate random string
   - Add: `DEBUG` = `False`
   - Add: `ALLOWED_ORIGINS` = `https://zap-trading.up.railway.app`

5. **Copy Backend URL**
   - Backend settings → Domains
   - Copy URL like: `https://zap-backend.up.railway.app`

### Deploy Frontend

**Using Vercel (Recommended - Free):**

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   - `VITE_API_URL` = your Railway backend URL
5. Click "Deploy"

**Done!** Your app is live on Vercel.

---

## Option 2: Local Development (Docker)

```bash
cd zap-web
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## First Time Setup

1. **Register Account**
   - Open web app
   - Click "Register"
   - Enter email & password

2. **Get Zerodha API Credentials**
   - Go to https://kite.zerodha.com/developer
   - Login
   - Create API key
   - Copy API Key & API Secret

3. **Add Trading Account**
   - Go to Dashboard
   - Click "Add Account"
   - Enter:
     - Nickname: "My Account"
     - API Key: (paste from Zerodha)
     - API Secret: (paste from Zerodha)

4. **Login to Zerodha**
   - Click "Login" button next to account
   - Authorize in popup
   - Copy `request_token` from URL

---

## Troubleshooting

**CORS Error:**
- Check `ALLOWED_ORIGINS` includes your frontend URL

**Database Error:**
- Restart services: `docker-compose restart`

**Can't Login:**
- Clear browser cache
- Check JWT_SECRET is set

---

## Next Steps

- Add your custom domain
- Set up SSL (automatic on Railway/Vercel)
- Monitor usage in Railway dashboard
- Check logs for errors

---

**Estimated Cost:** $15-25/month on Railway (or free with Vercel frontend)
