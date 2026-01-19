@echo off
echo ========================================
echo Viewing Docker Logs (Ctrl+C to exit)
echo ========================================
echo.

cd /d "C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web"

docker-compose logs -f

pause
