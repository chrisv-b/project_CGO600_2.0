@echo off
echo 🚀 Deploying CGO600 Flash Platform to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI is not installed. Please install it first:
    echo    npm install -g vercel
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo ⚠️  Warning: .env file not found. Please create one based on env.example
    echo    Make sure to set your Firebase credentials before deploying.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run tests
echo 🧪 Running API tests...
call node scripts/test-api.js

REM Check if tests passed
if %errorlevel% neq 0 (
    echo ❌ API tests failed. Please fix the issues before deploying.
    exit /b 1
)

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
call vercel --prod

echo ✅ Deployment completed!
echo 📋 Next steps:
echo    1. Set up Firebase Firestore database
echo    2. Add environment variables in Vercel dashboard
echo    3. Replace firmware files in private_firmware/
echo    4. Generate activation codes using: npm run generate-codes 