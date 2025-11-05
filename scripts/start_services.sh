#!/bin/bash
################################################################################
# NOREX V3.6 - Start Services Orchestrator
# Manages binary-based service startup with dependency order
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
LOG_FILE="$PROJECT_ROOT/logs/start_services.log"

mkdir -p "$PROJECT_ROOT/logs"

# Logging function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Clear log
echo "═══════════════════════════════════════════════════════════" > "$LOG_FILE"
log_msg "🚀 START SERVICES - Session started"
log_msg "═══════════════════════════════════════════════════════════"

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  🚀 NOREX V3.6 - Starting Services${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Verify binaries first
echo -e "${BLUE}🔍 Verifying binaries...${NC}"
log_msg "🔍 Verifying binaries..."

if ! bash "$PROJECT_ROOT/scripts/verify_setup.sh"; then
    echo -e "${RED}❌ Binary verification failed${NC}"
    log_msg "❌ Binary verification failed"
    exit 1
fi

echo ""
echo -e "${BLUE}🎯 Starting services in dependency order...${NC}"
echo -e "${BLUE}   (MySQL → Apache → phpMyAdmin)${NC}"
echo ""
log_msg "🎯 Starting services..."

# Service startup delay
STARTUP_DELAY=2

# Track failures
FAILED_SERVICES=()

# 1. Start MySQL (Priority 1 - No dependencies)
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  [1/3] Starting MySQL Server...${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
log_msg "Starting MySQL..."

if bash "$PROJECT_ROOT/scripts/services/service_mysql.sh" start; then
    echo -e "${GREEN}✅ MySQL started successfully${NC}"
    log_msg "✅ MySQL started"
    sleep $STARTUP_DELAY
else
    echo -e "${RED}❌ MySQL failed to start${NC}"
    log_msg "❌ MySQL failed"
    FAILED_SERVICES+=("MySQL")
fi

echo ""

# 2. Start Apache (Priority 2 - Depends on MySQL)
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  [2/3] Starting Apache HTTP Server...${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
log_msg "Starting Apache..."

if bash "$PROJECT_ROOT/scripts/services/service_apache.sh" start; then
    echo -e "${GREEN}✅ Apache started successfully${NC}"
    log_msg "✅ Apache started"
    sleep $STARTUP_DELAY
else
    echo -e "${RED}❌ Apache failed to start${NC}"
    log_msg "❌ Apache failed"
    FAILED_SERVICES+=("Apache")
fi

echo ""

# 3. Start phpMyAdmin (Priority 3 - Depends on Apache & MySQL)
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}  [3/3] Starting phpMyAdmin...${NC}"
echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
log_msg "Starting phpMyAdmin..."

if bash "$PROJECT_ROOT/scripts/services/service_phpmyadmin.sh" start; then
    echo -e "${GREEN}✅ phpMyAdmin started successfully${NC}"
    log_msg "✅ phpMyAdmin started"
else
    echo -e "${RED}❌ phpMyAdmin failed to start${NC}"
    log_msg "❌ phpMyAdmin failed"
    FAILED_SERVICES+=("phpMyAdmin")
fi

echo ""

# Check for failures
if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Some services failed to start:${NC}"
    for service in "${FAILED_SERVICES[@]}"; do
        echo -e "   ${RED}✗${NC} $service"
    done
    echo ""
    echo -e "${YELLOW}💡 Check logs:${NC}"
    echo -e "   ${CYAN}tail -f $PROJECT_ROOT/logs/service_*.log${NC}"
    echo ""
    log_msg "⚠️ Services started with errors"
    exit 1
fi

# Success output
log_msg "═══════════════════════════════════════════════════════════"
log_msg "✅ All services started successfully"
log_msg "═══════════════════════════════════════════════════════════"

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ Norex Services Running!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}🌍 Access Points:${NC}"
echo -e "   ${GREEN}http://localhost:8080${NC}          - Main site"
echo -e "   ${GREEN}http://localhost:8080/phpmyadmin${NC} - phpMyAdmin"
echo ""
echo -e "${CYAN}🔑 Credentials:${NC}"
echo -e "   MySQL user: ${GREEN}root${NC}"
echo -e "   Password:   ${GREEN}041201${NC}"
echo ""
echo -e "${CYAN}📊 Management:${NC}"
echo -e "   Stop:   ${YELLOW}bash scripts/stop_services.sh${NC}"
echo -e "   Status: ${YELLOW}bash scripts/status_services.sh${NC}"
echo ""
echo -e "${CYAN}📄 Logs:${NC}"
echo -e "   ${YELLOW}tail -f $PROJECT_ROOT/logs/service_*.log${NC}"
echo ""

exit 0
