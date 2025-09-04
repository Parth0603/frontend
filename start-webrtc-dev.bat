@echo off
echo Starting Syntra Teaching Zone with WebRTC...
echo.

echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Starting both servers...
start "Backend Server" cmd /k "npm run dev"
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers started successfully!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
echo You can now access the application.
echo Press any key to close this window...
pause > nul