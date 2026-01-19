# 🚀 Zap Trading - Local Web Application

## Quick Start (3 Minutes)

### Option 1: Automatic Startup (Recommended)

Double-click this file:
```
start-local.bat
```

This will:
- Start Docker Desktop (if not running)
- Build all services
- Start PostgreSQL, Redis, Backend, and Frontend
- Open your browser automatically

### Option 2: Manual Startup

```bash
cd C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web
docker-compose up --build -d
```

---

## 🌐 Access Your Application

Once running, open your browser:

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Database:** localhost:5432
- **Redis:** localhost:6379

---

## 🛠️ What's Running

The Docker setup includes:

1. **PostgreSQL Database**
   - User: `zap_user`
   - Password: `zap_password`
   - Database: `zap_db`
   - Port: 5432

2. **Redis Cache**
   - Port: 6379

3. **Backend API** (FastAPI)
   - Port: 8000
   - Auto-reload enabled for development
   - JWT_SECRET: local-dev-secret-key-change-in-production

4. **Frontend** (React + Vite)
   - Port: 3000
   - Hot module replacement enabled

---

## 📝 First Time Setup

### 1. Register Account
1. Open http://localhost:3000
2. Click "Register"
3. Enter email and password
4. Click "Register"

### 2. Add Zerodha Account
1. Login to your account
2. Go to Dashboard
3. Click "Add Account"
4. Enter:
   - Nickname: "My Account"
   - API Key: (from https://kite.zerodha.com/developer)
   - API Secret: (from Zerodha)

### 3. Login to Zerodha
1. Click "Login" button next to your account
2. Authorize in the popup window
3. Copy `request_token` from URL
4. Paste it in the app

### 4. Start Trading!
- Go to Trading page
- Select index, expiry, strike
- Enter lots
- Place orders across multiple accounts

---

## 🔧 Useful Commands

### View Logs
```bash
docker-compose logs -f
```
Or double-click: `view-logs.bat`

### Stop All Services
```bash
docker-compose down
```
Or double-click: `stop-local.bat`

### Restart Backend Only
```bash
docker-compose restart backend
```

### Rebuild Everything
```bash
docker-compose up --build -d
```

### Access Database Directly
```bash
docker exec -it zap-postgres psql -U zap_user -d zap_db
```

### Clear Everything (Fresh Start)
```bash
docker-compose down -v
docker-compose up --build -d
```

---

## 🐛 Troubleshooting

### Docker Won't Start
1. Open Docker Desktop manually
2. Wait for the whale icon in system tray to stop animating
3. Run `start-local.bat` again

### Port Already in Use
If you see "port is already allocated":
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :8000
```
Stop the process using that port, or change ports in `docker-compose.yml`

### Backend Connection Refused
Wait 1-2 minutes for services to fully start. Check logs:
```bash
docker-compose logs backend
```

### Frontend Shows Errors
Open browser console (F12) to see specific errors. Common issues:
- Backend not ready yet (wait 1-2 min)
- CORS errors (check ALLOWED_ORIGINS in docker-compose.yml)

### Database Errors
Check PostgreSQL is running:
```bash
docker-compose ps
```
Restart database:
```bash
docker-compose restart postgres
```

---

## 📊 Development Features

### Backend Auto-Reload
- Change any Python file in `backend/`
- Backend automatically restarts
- Changes reflect immediately

### Frontend Hot Reload
- Change any React/component file
- Browser updates automatically
- State is preserved

### Database Persistence
- Data saved in Docker volumes
- Survives container restarts
- Clear with `docker-compose down -v`

---

## 🎯 Next Steps

Once everything works locally:

1. Test all features thoroughly
2. Add your Zerodha accounts
3. Place some test orders
4. Verify real-time updates work
5. Then we deploy to Railway.cloud!

---

## 📚 File Structure

```
zap-web/
├── backend/               # FastAPI backend
│   ├── main.py           # API endpoints
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── auth.py           # JWT authentication
│   ├── database.py       # Database connection
│   ├── config.py         # Configuration
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── store/       # State management
│   │   └── main.tsx     # App entry point
│   ├── package.json     # Node dependencies
│   └── Dockerfile       # Frontend container
│
├── docker-compose.yml    # Multi-container setup
├── start-local.bat      # Quick start script
├── stop-local.bat       # Stop services
└── view-logs.bat        # View logs
```

---

## 🆘 Need Help?

If something doesn't work:
1. Check Docker is running: `docker ps`
2. Check service logs: `docker-compose logs`
3. Try stopping and restarting: `docker-compose down && docker-compose up -d`
4. Check ports aren't in use
5. Make sure no VPN is blocking connections

---

## ✅ Success Checklist

- [ ] Docker Desktop is running
- [ ] All 4 containers show as "Up" (`docker-compose ps`)
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:8000/health
- [ ] Can register new account
- [ ] Can login
- [ ] Can add Zerodha account
- [ ] Can place orders

---

**Ready to deploy to cloud?** Once local testing is complete, let me know and we'll move to Railway!
