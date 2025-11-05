#!/bin/bash

# ========================================
# NorexProject v3.0 - Smart Run Script
# Electron Development Mode
# ========================================

echo "🚀 NorexProject v3.0 - Starting Electron App..."
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "📁 Working directory: $SCRIPT_DIR"
echo ""

# ========================================
# STEP 1: Check Node.js & Yarn
# ========================================
echo "🔍 Checking Node.js & Yarn..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js from https://nodejs.org/"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed!"
    echo "   Installing Yarn globally..."
    npm install -g yarn
fi

NODE_VERSION=$(node --version)
YARN_VERSION=$(yarn --version)

echo "✅ Node.js: $NODE_VERSION"
echo "✅ Yarn: $YARN_VERSION"
echo ""

# ========================================
# STEP 2: Check Dependencies
# ========================================
echo "🔍 Checking dependencies..."

NEEDS_INSTALL=false

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found!"
    NEEDS_INSTALL=true
fi

# Check if package.json has changed (compare with lock file timestamp)
if [ -f "package.json" ] && [ -f "yarn.lock" ]; then
    if [ "package.json" -nt "yarn.lock" ]; then
        echo "⚠️  package.json has been modified!"
        NEEDS_INSTALL=true
    fi
fi

# Check critical dependencies
CRITICAL_DEPS=("electron" "react" "react-dom" "vite")
for dep in "${CRITICAL_DEPS[@]}"; do
    if [ ! -d "node_modules/$dep" ]; then
        echo "⚠️  Missing critical dependency: $dep"
        NEEDS_INSTALL=true
        break
    fi
done

# ========================================
# STEP 3: Install Dependencies if Needed
# ========================================
if [ "$NEEDS_INSTALL" = true ]; then
    echo ""
    echo "📦 Installing dependencies with Yarn..."
    echo "⏳ This may take a few minutes. Please wait..."
    echo ""
    
    # Run yarn install and wait for completion
    yarn install
    
    INSTALL_EXIT_CODE=$?
    
    if [ $INSTALL_EXIT_CODE -ne 0 ]; then
        echo ""
        echo "❌ Yarn install failed with exit code $INSTALL_EXIT_CODE"
        echo "   Please fix the errors and try again."
        exit 1
    fi
    
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    
    # Wait 2 seconds to ensure everything is settled
    echo "⏳ Waiting for dependencies to settle..."
    sleep 2
else
    echo "✅ All dependencies are up to date!"
    echo ""
fi

# ========================================
# STEP 4: Check Electron Binary
# ========================================
echo "🔍 Verifying Electron binary..."

if [ ! -f "node_modules/.bin/electron" ]; then
    echo "❌ Electron binary not found!"
    echo "   Reinstalling Electron..."
    yarn add electron --dev
    sleep 2
fi

echo "✅ Electron is ready!"
echo ""

# ========================================
# STEP 5: Start Vite Dev Server
# ========================================
echo "🌐 Starting Vite dev server..."
echo ""

# Start Vite in background
yarn dev:vite > /tmp/norex-vite.log 2>&1 &
VITE_PID=$!

echo "✅ Vite dev server started (PID: $VITE_PID)"
echo "⏳ Waiting for Vite to be ready..."

# Wait for Vite to be ready (check if port 5173 is open)
MAX_WAIT=30
COUNTER=0
while ! nc -z localhost 5173 2>/dev/null && ! curl -s http://localhost:5173 > /dev/null 2>&1; do
    sleep 1
    COUNTER=$((COUNTER + 1))
    echo "   ... waiting ($COUNTER/$MAX_WAIT)"
    
    if [ $COUNTER -ge $MAX_WAIT ]; then
        echo "❌ Vite dev server failed to start within $MAX_WAIT seconds!"
        echo "   Check logs: tail -f /tmp/norex-vite.log"
        kill $VITE_PID 2>/dev/null
        exit 1
    fi
done

echo "✅ Vite dev server is ready!"
echo ""

# Give Vite extra 2 seconds to fully initialize
echo "⏳ Waiting for Vite to fully initialize..."
sleep 2

# ========================================
# STEP 6: Launch Electron
# ========================================
echo "🎯 Launching Electron application..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  NorexProject v3.0 is now running!"
echo "  Press Ctrl+C to stop the application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Launch Electron (this will block until app closes)
NODE_ENV=development yarn electron .

# ========================================
# STEP 7: Cleanup on Exit
# ========================================
echo ""
echo "🛑 Shutting down..."

# Kill Vite dev server
if ps -p $VITE_PID > /dev/null 2>&1; then
    echo "   Stopping Vite dev server (PID: $VITE_PID)..."
    kill $VITE_PID 2>/dev/null
    sleep 1
fi

echo "✅ Cleanup complete!"
echo "👋 Goodbye!"