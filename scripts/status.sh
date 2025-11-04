#!/bin/bash
# NorexProject - Status Check Script

# Setup logging
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/status.log"

# Create logs directory if not exists
mkdir -p "$LOG_DIR"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Clear old log and start new session
echo "═══════════════════════════════════════════════════════════" > "$LOG_FILE"
log_message "📊 STATUS CHECK - Session started"
log_message "═══════════════════════════════════════════════════════════"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  📊 NorexProject - System Status"
echo "═══════════════════════════════════════════════════════════"
echo ""

log_message "📦 Container Status:"
echo "📦 Container Status:"
docker compose ps 2>&1 | tee -a "$LOG_FILE"

echo ""
log_message "🔌 Network Status:"
echo "🔌 Network Status:"
docker network ls | grep norex 2>&1 | tee -a "$LOG_FILE"

echo ""
log_message "💾 Storage Usage:"
echo "💾 Storage Usage:"
du -sh data/mysql 2>&1 | tee -a "$LOG_FILE" || echo "  No data yet"

echo ""
log_message "🌐 Service Health Check started"
echo "🌐 Service Health:"
echo -n "  • Apache (8080): "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null)
if [ $? -eq 0 ]; then
    echo " ✅ Running (HTTP $HTTP_CODE)"
    log_message "  ✅ Apache (8080): Running (HTTP $HTTP_CODE)"
else
    echo " ❌ Not responding"
    log_message "  ❌ Apache (8080): Not responding"
fi

echo -n "  • phpMyAdmin (8081): "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081 2>/dev/null)
if [ $? -eq 0 ]; then
    echo " ✅ Running (HTTP $HTTP_CODE)"
    log_message "  ✅ phpMyAdmin (8081): Running (HTTP $HTTP_CODE)"
else
    echo " ❌ Not responding"
    log_message "  ❌ phpMyAdmin (8081): Not responding"
fi

echo -n "  • MySQL (3306): "
docker exec norex_mysql mysqladmin ping -h localhost -u root -p041201 2>/dev/null > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Running"
    log_message "  ✅ MySQL (3306): Running"
else
    echo "❌ Not responding"
    log_message "  ❌ MySQL (3306): Not responding"
fi

log_message "═══════════════════════════════════════════════════════════"
log_message "Status check completed"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📄 View logs: Check /app/logs/status.log"
echo ""