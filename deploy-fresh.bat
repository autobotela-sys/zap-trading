@echo off
set RAILWAY_TOKEN=9a779a5f-2f33-42f6-9136-02b7a5c8a286
cd /d "C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web"

echo.
echo ========================================
echo Creating Fresh Railway Project
echo ========================================
echo.

echo Step 1: Creating new project...
railway init
echo.

echo Step 2: Adding PostgreSQL...
railway add --service postgres
echo.

echo Step 3: Adding Redis...
railway add --service redis
echo.

echo Step 4: Adding Backend from GitHub...
railway add --service github
echo.

echo Step 5: Opening Railway dashboard for configuration...
start https://railway.app
echo.

echo ========================================
echo Next Steps:
echo ========================================
echo 1. In Railway dashboard, click on the backend service
echo 2. Go to Settings tab
echo 3. Set Root Directory to: backend
echo 4. Add environment variables:
echo    - JWT_SECRET = ZapSecret2024ProductionKey
echo    - DEBUG = False
echo    - ALLOWED_ORIGINS = https://zap-trading.vercel.app
echo 5. Deploy all services
echo ========================================
pause
