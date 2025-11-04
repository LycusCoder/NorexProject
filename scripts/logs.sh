#!/bin/bash
# NorexProject - Logs Viewer
# Usage: bash scripts/logs.sh [service]

# Setup logging
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/docker_logs.log"

# Create logs directory if not exists
mkdir -p "$LOG_DIR"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

SERVICE="$1"

if [ -z "$SERVICE" ]; then
    echo ""
    echo "📜 NorexProject Logs"
    echo "─────────────────────────"
    echo "Usage: bash scripts/logs.sh [service]"
    echo ""
    echo "Services:"
    echo "  • web   - Apache/PHP logs"
    echo "  • db    - MySQL logs"
    echo "  • pma   - phpMyAdmin logs"
    echo "  • all   - All services"
    echo ""
    echo "📄 GUI Logs: Check /app/logs/ directory"
    echo ""
    exit 0
fi

log_message "📜 Viewing Docker logs for service: $SERVICE"

if [ "$SERVICE" = "all" ]; then
    log_message "Viewing all services logs"
    docker compose logs -f
else
    log_message "Viewing logs for: $SERVICE"
    docker compose logs -f "$SERVICE"
fi