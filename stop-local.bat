@echo off
echo ========================================
echo Stopping Zap Trading Services
echo ========================================
echo.

cd /d "C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web"

docker-compose down

echo.
echo All services stopped!
echo.
echo To start again, run: start-local.bat
echo.
pause
