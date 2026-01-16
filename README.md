# Zap Trading - Web Application

Multi-account Zerodha trading platform with web-based interface.

## Features

- 🌐 **Web-based interface** - Access from any device
- 👥 **Multi-account management** - Trade across multiple Zerodha accounts
- 📊 **Real-time P&L tracking** - Live position updates
- 🚀 **Fast trading** - Quick order placement
- 🔐 **Secure** - JWT authentication, encrypted credentials
- 📱 **Responsive** - Works on desktop, tablet, mobile

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Production database
- **Redis** - Caching and sessions
- **JWT** - Secure authentication

### Frontend
- **React** + **TypeScript** - Type-safe UI
- **Vite** - Fast build tool
- **Ant Design** - Professional UI components
- **Axios** - HTTP client
- **Zustand** - State management

## Quick Start (Railway Deployment)

### Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub account

### Step 1: Push to GitHub

```bash
cd zap-web
git init
git add .
git commit -m "Initial commit"
# Create a new repository on GitHub first
git remote add origin https://github.com/YOUR_USERNAME/zap-trading.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `zap-trading` repository
4. Railway will auto-detect the backend
5. Add these environment variables:

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | Generate a random string (use: openssl rand -base64 32) |
| `DEBUG` | `False` |
| `ALLOWED_ORIGINS` | Your frontend URL (e.g., https://zap-trading.up.railway.app) |

6. **Add PostgreSQL**:
   - Click **"New Service"** → **"Database"** → **"Add PostgreSQL"**
   - Railway will auto-set `DATABASE_URL`

7. **Add Redis**:
   - Click **"New Service"** → **"Database"** → **"Add Redis"**
   - Railway will auto-set `REDIS_URL`

8. Click **"Deploy"**

### Step 3: Deploy Frontend on Railway (or Vercel)

**Option A: Railway (Simple)**

1. In the same Railway project
2. Click **"New Service"** → **"Deploy from GitHub repo"**
3. Select the same repository
4. Set **Root Directory** to `frontend`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL (e.g., https://zap-backend.up.railway.app)
6. Click **"Deploy"**

**Option B: Vercel (Better Performance)**

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Set **Root Directory** to `frontend`
5. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL
6. Click **"Deploy"**

### Step 4: Configure Custom Domain (Optional)

**For Railway:**
1. Go to your service settings
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed

**For Vercel:**
1. Go to project settings
2. Click **"Domains"**
3. Add your custom domain

## Environment Variables

### Backend
```bash
# Auto-set by Railway
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Set these manually
JWT_SECRET=your-random-secret-key
DEBUG=False
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend
```bash
VITE_API_URL=https://your-backend-domain.com
```

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your settings
uvicorn main:app --reload
```

Backend runs on: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Usage

### 1. Register
- Open the web app
- Click "Register"
- Enter email and password

### 2. Add Zerodha Account
- Go to Dashboard
- Click "Add Account"
- Enter account details:
  - Nickname (e.g., "My Main Account")
  - API Key (from [kite.zerodha.com/developer](https://kite.zerodha.com/developer))
  - API Secret

### 3. Login to Zerodha
- Select your account
- Click "Login"
- Authorize in the popup
- Copy `request_token` from URL
- (Automated in production)

### 4. Place Order
- Go to Trading page
- Select accounts
- Choose Index, Expiry, Strike, Type
- Enter Lots (auto-calculates quantity)
- Click "Place Order"

### 5. Monitor Positions
- Go to Positions page
- View real-time P&L
- Refresh to update

## API Documentation

Once deployed, visit:
- `https://your-backend.railway.app/docs`
- Interactive Swagger UI with all endpoints

## Cost Estimate (Railway)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Backend | ❌ | ~$5-10/month |
| PostgreSQL | $0 credit | ~$5/month |
| Redis | $0 credit | ~$5/month |
| Frontend (Railway) | ❌ | ~$5/month |
| Frontend (Vercel) | ✅ | $0 |
| **Total** | - | **$15-25/month** |

## Security Notes

- All credentials encrypted with Fernet
- JWT tokens expire after 24 hours
- HTTPS enforced
- Database connections via SSL
- Secrets stored in Railway environment variables

## Troubleshooting

### "Could not validate credentials"
- Clear browser cache
- Login again

### "Account not logged in"
- Click "Login" button next to account
- Complete OAuth flow

### Orders not placing
- Check account has access token
- Verify market hours (9:15 AM - 3:30 PM IST)
- Check sufficient margin

## Roadmap

- [ ] WebSocket real-time updates
- [ ] More order types (BO, CO, OCO)
- [ ] Charts and analytics
- [ ] Order history
- [ ] Automated strategies
- [ ] Mobile app (React Native)

## Support

For issues:
1. Check Railway logs
2. Verify environment variables
3. Check API docs: `/docs`
4. GitHub Issues

## License

For personal use. Trade at your own risk.

---

**Built with ❤️ for Indian traders**
