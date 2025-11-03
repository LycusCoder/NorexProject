#!/bin/bash
# NourProject - Complete Reset
# WARNING: This will delete all data!

echo ""
echo "⚠️  WARNING: This will delete all containers and data!"
echo ""
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Reset cancelled."
    exit 0
fi

echo ""
echo "🗑️ Removing containers..."
docker compose down -v

echo "🗑️ Removing data..."
rm -rf data/mysql

echo "🗑️ Removing images..."
docker rmi nour-web 2>/dev/null

echo ""
echo "✅ Reset complete!"
echo ""
echo "To start fresh: bash scripts/start.sh"
echo ""