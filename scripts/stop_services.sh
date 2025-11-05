#!/bin/bash
################################################################################
# NOREX V3.6 - Stop Services Orchestrator
# Gracefully stops all running services
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
LOG_FILE="$PROJECT_ROOT/logs/stop_services.log"

mkdir -p "$PROJECT_ROOT/logs"

# Logging function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Clear log
echo "═══════════════════════════════════════════════════════════" > "$LOG_FILE"
log_msg "🛑 STOP SERVICES - Session started"
log_msg "═══════════════════════════════════════════════════════════"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🛑 NOREX V3.6 - Stopping Services${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}🔻 Stopping services in reverse order...${NC}"
echo -e "${YELLOW}   (phpMyAdmin → Apache → MySQL)${NC}"
echo ""
log_msg "🔻 Stopping services..."

# Stop services in reverse dependency order

# 1. Stop phpMyAdmin
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  [1/3] Stopping phpMyAdmin...${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
log_msg "Stopping phpMyAdmin..."

if bash "$PROJECT_ROOT/scripts/services/service_phpmyadmin.sh" stop 2>/dev/null; then
    echo -e "${GREEN}✅ phpMyAdmin stopped${NC}"
    log_msg "✅ phpMyAdmin stopped"
else
    echo -e "${YELLOW}⚠️  phpMyAdmin was not running${NC}"
    log_msg "⚠️  phpMyAdmin not running"
fi

echo ""

# 2. Stop Apache
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  [2/3] Stopping Apache...${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
log_msg "Stopping Apache..."

if bash "$PROJECT_ROOT/scripts/services/service_apache.sh" stop 2>/dev/null; then
    echo -e "${GREEN}✅ Apache stopped${NC}"
    log_msg "✅ Apache stopped"
else
    echo -e "${YELLOW}⚠️  Apache was not running${NC}"
    log_msg "⚠️  Apache not running"
fi

echo ""

# 3. Stop MySQL
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  [3/3] Stopping MySQL...${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
log_msg "Stopping MySQL..."

if bash "$PROJECT_ROOT/scripts/services/service_mysql.sh" stop 2>/dev/null; then
    echo -e "${GREEN}✅ MySQL stopped${NC}"
    log_msg "✅ MySQL stopped"
else
    echo -e "${YELLOW}⚠️  MySQL was not running${NC}"
    log_msg "⚠️  MySQL not running"
fi

echo ""

log_msg "═══════════════════════════════════════════════════════════"
log_msg "✅ All services stopped"
log_msg "═══════════════════════════════════════════════════════════"

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ All Services Stopped${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}🚀 To start again:${NC}"
echo -e "   ${YELLOW}bash scripts/start_services.sh${NC}"
echo ""
echo -e "${CYAN}📄 Logs:${NC}"
echo -e "   ${YELLOW}$LOG_FILE${NC}"
echo ""

exit 0
