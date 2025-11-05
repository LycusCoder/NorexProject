#!/bin/bash
################################################################################
# NOREX V3.6 - Services Status Checker
# Displays current status of all services
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  📊 NOREX V3.6 - Services Status${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

RUNNING_COUNT=0
STOPPED_COUNT=0

# Check MySQL
echo -e "${BOLD}MySQL Server:${NC}"
if bash "$PROJECT_ROOT/scripts/services/service_mysql.sh" status 2>/dev/null; then
    ((RUNNING_COUNT++))
else
    ((STOPPED_COUNT++))
fi
echo ""

# Check Apache
echo -e "${BOLD}Apache HTTP Server:${NC}"
if bash "$PROJECT_ROOT/scripts/services/service_apache.sh" status 2>/dev/null; then
    ((RUNNING_COUNT++))
else
    ((STOPPED_COUNT++))
fi
echo ""

# Check phpMyAdmin
echo -e "${BOLD}phpMyAdmin:${NC}"
if bash "$PROJECT_ROOT/scripts/services/service_phpmyadmin.sh" status 2>/dev/null; then
    ((RUNNING_COUNT++))
else
    ((STOPPED_COUNT++))
fi
echo ""

# Summary
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${BOLD}Summary:${NC}"
echo -e "  ${GREEN}✔${NC} Running: $RUNNING_COUNT"
echo -e "  ${RED}✖${NC} Stopped: $STOPPED_COUNT"
echo ""

if [ $RUNNING_COUNT -eq 3 ]; then
    echo -e "${GREEN}✅ All services are running!${NC}"
    echo ""
    echo -e "${CYAN}🌐 Access:${NC}"
    echo -e "   ${GREEN}http://localhost:8080${NC}"
    echo -e "   ${GREEN}http://localhost:8080/phpmyadmin${NC}"
elif [ $RUNNING_COUNT -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No services are running${NC}"
    echo ""
    echo -e "${CYAN}🚀 Start services:${NC}"
    echo -e "   ${YELLOW}bash scripts/start_services.sh${NC}"
else
    echo -e "${YELLOW}⚠️  Some services are not running${NC}"
    echo ""
    echo -e "${CYAN}🔄 Restart all:${NC}"
    echo -e "   ${YELLOW}bash scripts/stop_services.sh && bash scripts/start_services.sh${NC}"
fi

echo ""
echo -e "${CYAN}📄 View logs:${NC}"
echo -e "   ${YELLOW}tail -f $PROJECT_ROOT/logs/service_*.log${NC}"
echo ""

exit 0
