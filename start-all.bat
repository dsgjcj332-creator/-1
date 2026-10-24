@echo off
cd /d "%~dp0"

echo Starting Operations (Port 3000)...
start cmd /k "set VITE_SPA_PAGE=operations.html && tsx server.ts"

timeout /t 3 >nul

echo Starting Landing Page (Port 1000)...
start cmd /k "set VITE_SPA_PAGE=landing.html&&set VITE_PORT=1000&&vite --host=0.0.0.0"

timeout /t 3 >nul

echo Starting Merchant Portal (Port 5000)...
start cmd /k "set VITE_SPA_PAGE=merchant.html&&set VITE_PORT=5000&&vite --host=0.0.0.0"

timeout /t 3 >nul

echo Starting Customer App (Port 5174)...
start cmd /k "set VITE_SPA_PAGE=index.html&&set VITE_PORT=5174&&vite --host=0.0.0.0"

echo All servers started!
pause