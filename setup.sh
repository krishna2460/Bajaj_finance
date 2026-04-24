#!/bin/bash

# Graph Hierarchy Explorer - Installation Script
# This script sets up the entire project locally

set -e

echo "🚀 Graph Hierarchy Explorer - Setup Script"
echo "=========================================="

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not in PATH"
    echo "   This is OK if MongoDB is running as a service"
fi

echo "✓ Node.js $(node --version)"
echo "✓ npm $(npm --version)"

# Backend setup
echo ""
echo "🔧 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "   Creating .env from template..."
    cp .env.example .env
    echo "   ⚠️  Remember to update .env with your MongoDB URI"
fi

echo "   Installing dependencies..."
npm install

echo "✓ Backend setup complete"

# Frontend setup
echo ""
echo "⚛️  Setting up frontend..."
cd ../frontend

echo "   Installing dependencies..."
npm install

echo "✓ Frontend setup complete"

# Summary
echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Start MongoDB:"
echo "      - Windows: Run MongoDB service"
echo "      - macOS: brew services start mongodb-community"
echo "      - Linux: sudo systemctl start mongodb"
echo ""
echo "   2. Start backend (Terminal 1):"
echo "      cd backend"
echo "      npm run dev"
echo ""
echo "   3. Start frontend (Terminal 2):"
echo "      cd frontend"
echo "      npm run dev"
echo ""
echo "   4. Open browser:"
echo "      http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICKSTART.md"
echo "   - Setup Guide: docs/SETUP.md"
echo "   - API Docs: docs/API.md"
echo ""
echo "=========================================="
