#!/bin/bash

echo "🚀 Deploying CGO600 Flash Platform to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Please create one based on env.example"
    echo "   Make sure to set your Firebase credentials before deploying."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running API tests..."
node scripts/test-api.js

# Check if tests passed
if [ $? -ne 0 ]; then
    echo "❌ API tests failed. Please fix the issues before deploying."
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "📋 Next steps:"
echo "   1. Set up Firebase Firestore database"
echo "   2. Add environment variables in Vercel dashboard"
echo "   3. Replace firmware files in private_firmware/"
echo "   4. Generate activation codes using: npm run generate-codes" 