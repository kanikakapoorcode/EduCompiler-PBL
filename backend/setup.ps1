# One-time backend setup — creates venv and installs dependencies
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Creating virtual environment..." -ForegroundColor Cyan
python -m venv venv

Write-Host "Installing dependencies..." -ForegroundColor Cyan
.\venv\Scripts\pip install -r requirements.txt

Write-Host "Done. Run the server with:" -ForegroundColor Green
Write-Host "  .\venv\Scripts\python.exe main.py" -ForegroundColor Yellow
