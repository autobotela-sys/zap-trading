@echo off
echo =================================================================
echo    ZAP TRADING - RAILWAY DEPLOYMENT SCRIPT
echo =================================================================
echo.
echo This script will help you deploy the app to Railway
echo.
echo Project: https://github.com/autobotela-sys/zap-trading
echo.
echo =================================================================
echo.
echo STEP 1: Open Railway Dashboard
echo.
echo 1. Go to https://railway.app/
echo 2. Click "Login with GitHub"
echo 3. Authorize Railway to access your GitHub
echo.
pause
echo.
echo =================================================================
echo.
echo STEP 2: Create New Project
echo.
echo 1. Click "New Project" button
echo 2. Click "Deploy from GitHub repo"
echo 3. Search for: autobotela-sys/zap-trading
echo 4. Click "Import"
echo.
pause
echo.
echo =================================================================
echo.
echo STEP 3: Configure Services
echo.
echo Railway will detect the backend and frontend folders.
echo.
echo For each service, configure:
echo.
echo BACKEND:
echo   - Root Directory: backend
echo   - Build: Nixpacks (auto)
echo   - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
echo.
echo FRONTEND:
echo   - Root Directory: frontend
echo   - Build: Nixpacks (auto)
echo   - Start Command: (leave empty)
echo.
pause
echo.
echo =================================================================
echo.
echo STEP 4: Add Databases
echo.
echo 1. Click "New Service"
echo 2. Select "PostgreSQL"
echo 3. Click "Add PostgreSQL"
echo.
echo 4. Click "New Service" again
echo 5. Select "Redis"
echo 6. Click "Add Redis"
echo.
pause
echo.
echo =================================================================
echo.
echo STEP 5: Configure Environment Variables
echo.
echo BACKEND Variables:
echo   - DATABASE_URL: (auto-linked from PostgreSQL)
echo   - REDIS_URL: (auto-linked from Redis)
echo   - JWT_SECRET: generate a secure secret
echo   - ALLOWED_ORIGINS: your frontend URL
echo.
echo FRONTEND Variables:
echo   - VITE_API_URL: your backend URL
echo.
pause
echo.
echo =================================================================
echo.
echo STEP 6: Deploy
echo.
echo Click "Deploy" on each service.
echo Wait for all services to show "Healthy".
echo.
echo =================================================================
echo.
echo DEPLOYMENT COMPLETE!
echo.
echo Your app will be live at:
echo https://zap-trading.up.railway.app
echo.
echo =================================================================
echo.
echo Press any key to open Railway Dashboard...
pause > nul
start https://railway.app/
echo.
echo Thank you!
echo.
