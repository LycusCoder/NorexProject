#!/bin/bash
# NorexProject - Stop Script

# Setup logging
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/stop.log"

# Create logs directory if not exists
mkdir -p "$LOG_DIR"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Clear old log and start new session
echo "═══════════════════════════════════════════════════════════" > "$LOG_FILE"
log_message "🛑 STOP SCRIPT - Session started"
log_message "═══════════════════════════════════════════════════════════"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🛑 NorexProject - Stopping Services"
echo "═══════════════════════════════════════════════════════════"
echo ""

log_message "🛑 Stopping all containers..."
docker compose stop 2>&1 | tee -a "$LOG_FILE"

log_message "✅ All services stopped successfully"

echo ""
echo "✅ All services stopped."
echo ""
echo "To start again: bash scripts/start.sh"
echo "To remove containers: docker compose down"
echo ""
echo "📄 View logs: Check /app/logs/stop.log"
echo ""