#!/bin/bash

echo "🚀 Setting up Blockscribe Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual API keys and configuration."
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
    echo "   For local development, install MongoDB: https://docs.mongodb.com/manual/installation/"
fi

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your API keys"
echo "2. Start MongoDB (if using local instance)"
echo "3. Run: npm run dev"
echo "4. Seed templates: npm run seed"
