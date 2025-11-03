#!/bin/bash
# NourProject - Stop Script

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🛑 NourProject - Stopping Services"
echo "═══════════════════════════════════════════════════════════"
echo ""

docker compose stop

echo ""
echo "✅ All services stopped."
echo ""
echo "To start again: bash scripts/start.sh"
echo "To remove containers: docker compose down"
echo ""