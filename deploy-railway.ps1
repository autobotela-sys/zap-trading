# Railway Deployment Script
$token = "9a779a5f-2f33-42f6-9136-02b7a5c8a286"
$projectId = "1deb4d27-f8fc-4104-93c5-b1e6a8f890e5"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Creating PostgreSQL service..." -ForegroundColor Green
$postgresQuery = @"
mutation {
  serviceCreate(input: {
    projectId: "$projectId"
    source: {
      projectName: "PostgreSQL"
      organization: "railway"
    }
  }) {
    id
    name
  }
}
"@

$postgresResponse = Invoke-RestMethod -Uri "https://backpack.railway.app/graphql/v2" -Method Post -Body ( @{ query = $postgresQuery } | ConvertTo-Json ) -Headers $headers
Write-Host "PostgreSQL Service ID: $($postgresResponse.data.serviceCreate.id)"

Start-Sleep -Seconds 2

Write-Host "`nCreating Redis service..." -ForegroundColor Green
$redisQuery = @"
mutation {
  serviceCreate(input: {
    projectId: "$projectId"
    source: {
      projectName: "Redis"
      organization: "railway"
    }
  }) {
    id
    name
  }
}
"@

$redisResponse = Invoke-RestMethod -Uri "https://backpack.railway.app/graphql/v2" -Method Post -Body ( @{ query = $redisQuery } | ConvertTo-Json ) -Headers $headers
Write-Host "Redis Service ID: $($redisResponse.data.serviceCreate.id)"

Start-Sleep -Seconds 2

Write-Host "`nCreating Backend service..." -ForegroundColor Green
$backendQuery = @"
mutation {
  serviceCreate(input: {
    projectId: "$projectId"
    source: {
      repo: "autobotela-sys/zap-trading"
      branch: "main"
      rootDirectory: "backend"
    }
  }) {
    id
    name
  }
}
"@

$backendResponse = Invoke-RestMethod -Uri "https://backpack.railway.app/graphql/v2" -Method Post -Body ( @{ query = $backendQuery } | ConvertTo-Json ) -Headers $headers
$backendServiceId = $backendResponse.data.serviceCreate.id
Write-Host "Backend Service ID: $backendServiceId"

Start-Sleep -Seconds 2

Write-Host "`nAdding environment variables to backend..." -ForegroundColor Green
$varsQuery = @"
mutation {
  serviceVariableCreate(
    serviceId: "$backendServiceId"
    key: "JWT_SECRET"
    value: "ZapSecret2024ProductionKey"
  ) {
    id
  }
}
"@

Invoke-RestMethod -Uri "https://backpack.railway.app/graphql/v2" -Method Post -Body ( @{ query = $varsQuery } | ConvertTo-Json ) -Headers $headers
Write-Host "Added JWT_SECRET"

$debugQuery = @"
mutation {
  serviceVariableCreate(
    serviceId: "$backendServiceId"
    key: "DEBUG"
    value: "False"
  ) {
    id
  }
}
"@

Invoke-RestMethod -Uri "https://backpack.railway.app/graphql/v2" -Method Post -Body ( @{ query = $debugQuery } | ConvertTo-Json ) -Headers $headers
Write-Host "Added DEBUG"

$originsQuery = @"
mutation {
  serviceVariableCreate(
    serviceId: "$backendServiceId"
    key: "ALLOWED_ORIGINS"
    value: "https://zap-trading.vercel.app"
  ) {
    id
  }
}
"@

Invoke-RestMethod -Uri "https://backpack.railway.app/graphql/v2" -Method Post -Body ( @{ query = $originsQuery } | ConvertTo-Json ) -Headers $headers
Write-Host "Added ALLOWED_ORIGINS"

Write-Host "`n✅ All services created successfully!" -ForegroundColor Green
Write-Host "Please visit: https://railway.app/project/$projectId" -ForegroundColor Cyan
