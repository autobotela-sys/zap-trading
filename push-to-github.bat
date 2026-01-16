@echo off
echo ========================================
echo Pushing to GitHub
echo ========================================
echo.
echo Please enter your GitHub Personal Access Token
echo (Create one at: https://github.com/settings/tokens)
echo.
set /p GITHUB_TOKEN="GitHub Token: "

cd /d "C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web"

echo.
echo Setting up remote with token...
git remote set-url origin https://%GITHUB_TOKEN%@github.com/autobotela-sys/zap-trading.git

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo Done!
echo ========================================
pause
