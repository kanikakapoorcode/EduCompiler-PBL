# Start EduCompiler frontend + backend
Write-Host "Starting EduCompiler..." -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPython = Join-Path $root "backend\venv\Scripts\python.exe"

if (-not (Test-Path $backendPython)) {
    Write-Host "Backend venv not found. Running setup..." -ForegroundColor Yellow
    & (Join-Path $root "backend\setup.ps1")
}

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$root\backend'; .\venv\Scripts\python.exe main.py"
)
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$root\frontend'; npm run dev"
)

Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
