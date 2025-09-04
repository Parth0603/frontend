@echo off
echo Installing frontend dependencies...
call npm install

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Starting development servers...
echo Frontend will run on http://localhost:5173
echo Backend will run on http://localhost:5000
echo Using in-memory storage (no database required)

start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start cmd /k "npm run dev"

echo Both servers are starting...
pause