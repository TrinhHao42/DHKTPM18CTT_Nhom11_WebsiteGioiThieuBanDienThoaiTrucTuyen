@echo off
REM Production build script for Windows

echo Building production application...

REM Build Analytics Backend
echo 1. Building Analytics Backend...
cd analytics-backend
npx prisma generate
npm run build
cd ..

REM Build Next.js Frontend
echo 2. Building Next.js Frontend...
npm run build

REM Create production start script
echo @echo off > start-prod.bat
echo REM Start production environment >> start-prod.bat
echo. >> start-prod.bat
echo echo Starting production environment... >> start-prod.bat
echo. >> start-prod.bat
echo echo Starting Analytics Backend... >> start-prod.bat
echo start "Analytics Backend" cmd /k "cd analytics-backend && npm run start" >> start-prod.bat
echo. >> start-prod.bat
echo echo Waiting 5 seconds for backend to start... >> start-prod.bat
echo timeout /t 5 >> start-prod.bat
echo. >> start-prod.bat
echo echo Starting Next.js Frontend... >> start-prod.bat
echo start "Next.js Frontend" cmd /k "npm start" >> start-prod.bat
echo. >> start-prod.bat
echo echo Production environment started! >> start-prod.bat
echo echo Frontend: http://localhost:3000 >> start-prod.bat
echo echo Analytics Backend: http://localhost:3002 >> start-prod.bat
echo. >> start-prod.bat
echo echo Press any key to exit... >> start-prod.bat
echo pause ^> nul >> start-prod.bat

echo.
echo Build completed!
echo Run 'start-prod.bat' to start production environment
pause