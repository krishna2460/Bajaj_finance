@echo off
REM Graph Hierarchy Explorer - Installation Script (Windows)
REM This script sets up the entire project locally

setlocal enabledelayedexpansion

echo 🚀 Graph Hierarchy Explorer - Setup Script
echo ==========================================

REM Check prerequisites
echo.
echo 📋 Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo    Download from: https://nodejs.org/
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✓ Node.js %NODE_VERSION%
echo ✓ npm %NPM_VERSION%

REM Backend setup
echo.
echo 🔧 Setting up backend...
cd backend

if not exist .env (
    echo    Creating .env from template...
    copy .env.example .env
    echo    ⚠️  Remember to update .env with your MongoDB URI
)

echo    Installing dependencies...
call npm install

echo ✓ Backend setup complete

REM Frontend setup
echo.
echo ⚛️  Setting up frontend...
cd ..\frontend

echo    Installing dependencies...
call npm install

echo ✓ Frontend setup complete

REM Summary
echo.
echo ==========================================
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo    1. Start MongoDB:
echo       - Windows: Run MongoDB service
echo       - Or: mongod
echo.
echo    2. Start backend (Terminal 1):
echo       cd backend
echo       npm run dev
echo.
echo    3. Start frontend (Terminal 2):
echo       cd frontend
echo       npm run dev
echo.
echo    4. Open browser:
echo       http://localhost:3000
echo.
echo 📚 Documentation:
echo    - Quick Start: QUICKSTART.md
echo    - Setup Guide: docs\SETUP.md
echo    - API Docs: docs\API.md
echo.
echo ==========================================

endlocal
