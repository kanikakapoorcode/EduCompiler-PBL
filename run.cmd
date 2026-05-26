@echo off
echo ========================================
echo   Starting EduCompiler
echo ========================================
echo.

echo [1/2] Starting Backend (port 8000)...
start "EduCompiler Backend" cmd /k "cd /d "e:\compiler changes pbl\backend" && "e:\compiler changes pbl\backend\venv\Scripts\python.exe" main.py"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (port 3000)...
start "EduCompiler Frontend" cmd /k "cd /d "e:\compiler changes pbl\frontend" && npm run dev"

echo.
echo ========================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Both servers are starting in separate windows.
echo Press any key to exit this launcher...
pause > nul
