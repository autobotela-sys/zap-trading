# Railway Automatic Setup Script
# This script will help deploy your app to Railway

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Zap Trading - Railway Auto Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "STEP 1: Open Railway Dashboard" -ForegroundColor Yellow
Write-Host "Creating new project...`n" -ForegroundColor Green

Start-Process "https://railway.app/new"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FOLLOW THESE EXACT STEPS:" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor White

Write-Host "1. Click 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "2. Select: autobotela-sys/zap-trading" -ForegroundColor White
Write-Host "3. CRITICAL: Find 'Root Directory' field" -ForegroundColor Yellow
Write-Host "   (Click 'Advanced' if you don't see it)" -ForegroundColor Yellow
Write-Host "4. Type exactly: backend" -ForegroundColor Green
Write-Host "5. Click 'Deploy Now'`n" -ForegroundColor White

Write-Host "Wait for initial build to start...`n" -ForegroundColor Yellow

Start-Sleep -Seconds 10

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Add Databases" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor White

Write-Host "After build starts, click 'New Service':" -ForegroundColor White
Write-Host "  - Select 'Database' → 'PostgreSQL'" -ForegroundColor Green
Write-Host "  - Select 'Database' → 'Redis'`n" -ForegroundColor White

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Configure Backend" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor White

Write-Host "Click on your 'backend' service → 'Variables' tab:" -ForegroundColor White
Write-Host "  Add these variables:" -ForegroundColor Green
Write-Host "  1. JWT_SECRET = ZapSecret2024ProductionKey" -ForegroundColor White
Write-Host "  2. DEBUG = False" -ForegroundColor White
Write-Host "  3. ALLOWED_ORIGINS = https://zap-trading.vercel.app" -ForegroundColor White
Write-Host "`n  Then connect databases:" -ForegroundColor Yellow
Write-Host "  4. DATABASE_URL = (copy from PostgreSQL service)" -ForegroundColor White
Write-Host "  5. REDIS_URL = (copy from Redis service)`n" -ForegroundColor White

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Get Backend URL" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor White

Write-Host "After successful deployment:" -ForegroundColor White
Write-Host "  1. Click backend service" -ForegroundColor White
Write-Host "  2. Go to 'Settings' → 'Domains'" -ForegroundColor White
Write-Host "  3. Copy your backend URL`n" -ForegroundColor Green

Write-Host "Then come back here and paste the URL!" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$backendUrl = Read-Host "Enter your Railway backend URL (or press Enter to skip)"

if ($backendUrl) {
    Write-Host "`nUpdating frontend with new backend URL..." -ForegroundColor Green

    $frontendEnv = "C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web\frontend\.env"
    Set-Content -Path $frontendEnv -Value "VITE_API_URL=$backendUrl"

    Write-Host "Frontend updated! Testing backend health..." -ForegroundColor Green

    Start-Sleep -Seconds 5

    try {
        $response = Invoke-WebRequest -Uri "$backendUrl/health" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Backend is healthy and running!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠ Backend may still be starting. Wait 1-2 minutes and test again." -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor White

Write-Host "Your app should be live at:" -ForegroundColor White
Write-Host "  Frontend: https://zap-trading.vercel.app" -ForegroundColor Cyan
if ($backendUrl) {
    Write-Host "  Backend: $backendUrl" -ForegroundColor Cyan
    Write-Host "  API Docs: $backendUrl/docs" -ForegroundColor Cyan
}
Write-Host "`n" -ForegroundColor White
