$env:RAILWAY_TOKEN = "9a779a5f-2f33-42f6-9136-02b7a5c8a286"
Set-Location "C:\Users\elamuruganm\Desktop\Desktop\Zap\zap-web"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Creating Fresh Railway Project" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Step 1: Creating new project..." -ForegroundColor Green
railway init
Write-Host "`nStep 2: Adding PostgreSQL..." -ForegroundColor Green
railway add -d postgres
Write-Host "`nStep 3: Adding Redis..." -ForegroundColor Green
railway add -d redis
Write-Host "`nStep 4: Adding Backend service..." -ForegroundColor Green
railway add -r autobotela-sys/zap-trading
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All services created!" -ForegroundColor Green
Write-Host "Opening Railway dashboard for configuration..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Start-Process "https://railway.app"
