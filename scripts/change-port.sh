#!/bin/bash
# NorexProject - Change Web Server Port
# Usage: bash scripts/change-port.sh [port]

PORT="$1"

if [ -z "$PORT" ]; then
    echo "Usage: bash scripts/change-port.sh [port]"
    echo "Example: bash scripts/change-port.sh 80"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🔧 NorexProject - Changing Web Server Port"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Backup docker-compose.yml
cp docker-compose.yml docker-compose.yml.backup
echo "✅ Backup created: docker-compose.yml.backup"

# Update port in docker-compose.yml
sed -i "s/\"[0-9]*:80\"  # web server/\"$PORT:80\"  # web server/" docker-compose.yml
echo "✅ Port updated to: $PORT"

# Warning for port 80
if [ "$PORT" = "80" ]; then
    echo ""
    echo "⚠️  PORT 80 REQUIRES ROOT PRIVILEGES"
    echo "    Make sure Docker has sudo access or add user to docker group:"
    echo "    sudo usermod -aG docker \$USER"
    echo ""
fi

echo ""
echo "🔄 Restarting services..."
docker compose down
docker compose up -d

echo ""
echo "⏳ Waiting for services..."
sleep 5

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Port changed successfully!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🌐 New address: http://localhost:$PORT"
echo ""
