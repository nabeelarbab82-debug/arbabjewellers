@echo off
echo ======================================
echo   Arbab Jewellers - Complete Setup
echo ======================================
echo.

echo [1/3] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
echo Backend dependencies ready!
echo.

echo [2/3] Setting up Frontend...
cd ../frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
echo Frontend dependencies ready!
echo.

echo [3/3] Setup Complete!
echo.
echo ======================================
echo   Next Steps:
echo ======================================
echo 1. Configure backend .env file
echo 2. Run: npm run setup (in backend folder)
echo 3. Start backend: npm run dev
echo 4. Start frontend: npm run dev (in frontend folder)
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo ======================================
echo.
pause
