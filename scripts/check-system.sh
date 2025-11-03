#!/bin/bash
# NourProject - First Time Setup Checker
# Run this to verify your system is ready

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🔍 NourProject - System Requirements Check"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d ' ' -f3 | cut -d ',' -f1)
    echo "✅ Installed (v$DOCKER_VERSION)"
else
    echo "❌ NOT FOUND"
    echo "   Install: https://docs.docker.com/get-docker/"
    MISSING=true
fi

# Check Docker Compose
echo -n "Checking Docker Compose... "
if command -v docker compose &> /dev/null; then
    echo "✅ Installed"
else
    echo "❌ NOT FOUND"
    echo "   Usually comes with Docker Desktop"
    MISSING=true
fi

# Check if Docker is running
echo -n "Checking Docker daemon... "
if docker info &> /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not running"
    echo "   Please start Docker Desktop or Docker daemon"
    MISSING=true
fi

# Check ports
echo ""
echo "📡 Checking required ports:"
for port in 8080 8081 3306; do
    echo -n "  Port $port... "
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "⚠️  In use (may cause conflict)"
    else
        echo "✅ Available"
    fi
done

echo ""
if [ "$MISSING" = true ]; then
    echo "❌ Please install missing requirements first!"
    echo ""
    echo "Quick Install (Ubuntu/Debian):"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sudo sh get-docker.sh"
    echo "  sudo usermod -aG docker \$USER"
    echo "  # Then logout and login again"
    exit 1
else
    echo "✅ All requirements met!"
    echo ""
    echo "Next step: bash scripts/start.sh"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
