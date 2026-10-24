@echo off
cd /d "%~dp0"
set VITE_SPA_PAGE=merchant.html
set VITE_PORT=5000
npx vite --host=0.0.0.0
pause