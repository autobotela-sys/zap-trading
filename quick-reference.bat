@echo off
echo ═══════════════════════════════════════════════════
echo   ZAP TRADING - QUICK REFERENCE
echo ═══════════════════════════════════════════════════
echo.
echo 🌐 APPLICATION URLS:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
echo 🛠️ COMMON COMMANDS:
echo.
echo    1. View all containers:
echo       docker-compose ps
echo.
echo    2. View logs:
echo       docker-compose logs -f
echo.
echo    3. Stop all services:
echo       docker-compose down
echo.
echo    4. Start all services:
echo       docker-compose up -d
echo.
echo    5. Restart backend:
echo       docker-compose restart backend
echo.
echo    6. View backend logs only:
echo       docker-compose logs -f backend
echo.
echo    7. Rebuild everything:
echo       docker-compose up --build -d
echo.
echo ═══════════════════════════════════════════════════
pause
