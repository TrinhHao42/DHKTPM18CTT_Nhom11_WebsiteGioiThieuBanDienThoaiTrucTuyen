@echo off
REM Start development environment without Docker

echo Starting PostgreSQL...
REM You need to start PostgreSQL manually or use local installation

echo Starting Analytics Backend...
start "Analytics Backend" cmd /k "cd analytics-backend && npm run dev"

echo Waiting 5 seconds for backend to start...
timeout /t 5

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "npm run dev"

echo Development environment started!
echo Frontend: http://localhost:3000
echo Analytics Backend: http://localhost:3002
echo.
echo Press any key to exit...
pause > nul