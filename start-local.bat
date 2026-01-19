@echo off
echo ========================================
echo Zap Trading - Local Docker Setup
echo ========================================
echo.

echo Step 1: Waiting for Docker to start...
timeout /t 30 /nobreak >nul

echo.
echo Step 2: Checking Docker status...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop manually and wait for it to be ready.
    pause
    exit /b 1
)

echo Docker is running!
echo.

echo Step 3: Stopping any existing containers...
docker-compose down

echo.
echo Step 4: Building and starting all services...
echo This may take a few minutes on first run...
echo.
docker-compose up --build -d

echo.
echo ========================================
echo Services Starting...
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo Testing backend health...
curl -s http://localhost:8000/health
echo.

echo.
echo ========================================
echo App is Ready!
echo ========================================
echo.
echo Open your browser and go to:
echo http://localhost:3000
echo.
echo To stop all services, run:
echo docker-compose down
echo.
echo To view logs, run:
echo docker-compose logs -f
echo ========================================
pause
