#!/bin/bash
# NourProject - Start Script (Better than Laragon!)

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🚀 NourProject - Starting Services"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "🔧 Building Docker images (first time may take a while)..."
docker compose build --no-cache

echo ""
echo "🚀 Starting containers..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check container status
echo ""
echo "📦 Container Status:"
docker compose ps

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ NourProject Services Started!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🌐 Access Points:"
echo "  • Main Site:     http://localhost:8080"
echo "  • Database Test: http://localhost:8080/db_test.php"
echo "  • phpMyAdmin:    http://localhost:8081"
echo ""
echo "🔑 phpMyAdmin Login:"
echo "  • Username: root"
echo "  • Password: 041201"
echo ""
echo "📊 Check status: bash scripts/status.sh"
echo "🛑 Stop services: bash scripts/stop.sh"
echo ""