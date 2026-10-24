@echo off
cd /d "%~dp0"
set VITE_SPA_PAGE=index.html
set VITE_PORT=5174
npx vite --host=0.0.0.0
pause