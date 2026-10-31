# ECHO SENSE Startup Script
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  ECHO SENSE - AI-Powered Early Hearing Difficulty Screening System" -ForegroundColor White
Write-Host "  Tagline: Listen Beyond the Silence." -ForegroundColor Yellow
Write-Host "===================================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$toolsDir = Join-Path $scriptDir "..\tools"
$pythonExe = Join-Path $toolsDir "python\python.exe"
$nodeDir = Join-Path $toolsDir "node"
$nodeExe = Join-Path $nodeDir "node.exe"
$npmCmd = Join-Path $nodeDir "npm.cmd"

# Set PATH to include portable Node
$env:PATH = "$nodeDir;$env:PATH"

Write-Host "`n[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
$backendProc = Start-Process -FilePath $pythonExe -ArgumentList "-u run.py" -WorkingDirectory (Join-Path $scriptDir "backend") -PassThru

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting React Vite Frontend on http://localhost:3000..." -ForegroundColor Green
$frontendProc = Start-Process -FilePath $npmCmd -ArgumentList "run preview -- --port 3000 --host" -WorkingDirectory (Join-Path $scriptDir "frontend") -PassThru

Write-Host "`n===================================================================" -ForegroundColor Cyan
Write-Host "  ECHO SENSE is running!" -ForegroundColor Green
Write-Host "  Frontend Website: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API:      http://127.0.0.1:8000" -ForegroundColor White
Write-Host "  API Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Cyan
