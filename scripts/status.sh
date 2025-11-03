#!/bin/bash
# NourProject - Status Check Script

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  📊 NourProject - System Status"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "📦 Container Status:"
docker compose ps

echo ""
echo "🔌 Network Status:"
docker network ls | grep nour

echo ""
echo "💾 Storage Usage:"
du -sh data/mysql 2>/dev/null || echo "  No data yet"

echo ""
echo "🌐 Service Health:"
echo -n "  • Apache (8080): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null
if [ $? -eq 0 ]; then
    echo " ✅ Running"
else
    echo " ❌ Not responding"
fi

echo -n "  • phpMyAdmin (8081): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null
if [ $? -eq 0 ]; then
    echo " ✅ Running"
else
    echo " ❌ Not responding"
fi

echo -n "  • MySQL (3306): "
docker exec nour_mysql mysqladmin ping -h localhost -u root -p041201 2>/dev/null > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""