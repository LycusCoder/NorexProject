#!/bin/bash
# NourProject - Logs Viewer
# Usage: bash scripts/logs.sh [service]

SERVICE="$1"

if [ -z "$SERVICE" ]; then
    echo ""
    echo "📜 NourProject Logs"
    echo "─────────────────────────"
    echo "Usage: bash scripts/logs.sh [service]"
    echo ""
    echo "Services:"
    echo "  • web   - Apache/PHP logs"
    echo "  • db    - MySQL logs"
    echo "  • pma   - phpMyAdmin logs"
    echo "  • all   - All services"
    echo ""
    exit 0
fi

if [ "$SERVICE" = "all" ]; then
    docker compose logs -f
else
    docker compose logs -f "$SERVICE"
fi