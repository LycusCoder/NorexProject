#!/bin/bash

################################################################################
# NorexProject - Verification & Health Check Script
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

# Setup logging
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/verify.log"

# Create logs directory if not exists
mkdir -p "$LOG_DIR"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Clear old log and start new session
echo "═══════════════════════════════════════════════════════════════" > "$LOG_FILE"
log_message "🔍 VERIFY SCRIPT - Session started"
log_message "═══════════════════════════════════════════════════════════"

echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "          🔍 NorexProject Verification & Health Check          "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "  ${GREEN}✓${NC} $1"
    log_message "  ✓ PASS: $1"
    ((PASS++))
}

check_fail() {
    echo -e "  ${RED}✗${NC} $1"
    log_message "  ✗ FAIL: $1"
    ((FAIL++))
}

check_warn() {
    echo -e "  ${YELLOW}⚠${NC} $1"
    log_message "  ⚠ WARN: $1"
    ((WARN++))
}

echo -e "${BOLD}1. System Requirements${NC}"
echo "───────────────────────"

# Docker
if command -v docker &> /dev/null; then
    check_pass "Docker installed ($(docker --version | cut -d' ' -f3 | tr -d ','))"
else
    check_fail "Docker not installed"
fi

# Docker running
if docker info &> /dev/null 2>&1; then
    check_pass "Docker daemon running"
else
    check_fail "Docker daemon not running"
fi

# Node.js (for Tauri GUI)
if command -v node &> /dev/null; then
    check_pass "Node.js installed ($(node --version))"
else
    check_warn "Node.js not installed (needed for GUI development)"
fi

# Yarn
if command -v yarn &> /dev/null; then
    check_pass "Yarn installed ($(yarn --version))"
else
    check_warn "Yarn not installed (needed for GUI)"
fi

# Rust (for Tauri)
if command -v rustc &> /dev/null; then
    check_pass "Rust installed ($(rustc --version | cut -d' ' -f2))"
else
    check_warn "Rust not installed (needed for GUI build)"
fi

echo ""
echo -e "${BOLD}2. Project Structure${NC}"
echo "───────────────────────"

# Check directories
for dir in "gui" "scripts" "www" "docs" "config"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        check_pass "Directory: $dir/"
    else
        check_fail "Directory missing: $dir/"
    fi
done

echo ""
echo -e "${BOLD}3. Core Files${NC}"
echo "───────────────────────"

# Check critical files
if [ -f "$PROJECT_ROOT/docker-compose.yml" ]; then
    check_pass "docker-compose.yml"
else
    check_fail "docker-compose.yml missing"
fi

if [ -f "$PROJECT_ROOT/Dockerfile" ]; then
    check_pass "Dockerfile"
else
    check_fail "Dockerfile missing"
fi

if [ -f "$PROJECT_ROOT/norex.sh" ]; then
    if [ -x "$PROJECT_ROOT/norex.sh" ]; then
        check_pass "norex.sh (executable)"
    else
        check_warn "norex.sh (not executable)"
    fi
else
    check_fail "norex.sh missing"
fi

if [ -f "$PROJECT_ROOT/gui/src/App.tsx" ]; then
    check_pass "gui/src/App.tsx (Tauri GUI)"
else
    check_fail "gui/src/App.tsx missing"
fi

if [ -f "$PROJECT_ROOT/gui/src-tauri/Cargo.toml" ]; then
    check_pass "gui/src-tauri/Cargo.toml (Tauri backend)"
else
    check_warn "gui/src-tauri/Cargo.toml missing"
fi

if [ -f "$PROJECT_ROOT/scripts/python.sh" ]; then
    if [ -x "$PROJECT_ROOT/scripts/python.sh" ]; then
        check_pass "scripts/python.sh (executable)"
    else
        check_warn "scripts/python.sh (not executable)"
    fi
else
    check_fail "scripts/python.sh missing"
fi

echo ""
echo -e "${BOLD}4. Docker Images${NC}"
echo "───────────────────────"

if docker info &> /dev/null 2>&1; then
    # Check if images exist
    if docker images --format "{{.Repository}}" | grep -q "^norexproject-web$"; then
        check_pass "Custom PHP image (norexproject-web)"
    else
        check_warn "Custom PHP image not built yet (run 'bash norex.sh start')"
    fi
    
    if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^mysql:8.0$"; then
        check_pass "MySQL 8.0 image"
    else
        check_warn "MySQL 8.0 image not downloaded yet"
    fi
    
    if docker images --format "{{.Repository}}" | grep -q "^phpmyadmin/phpmyadmin$"; then
        check_pass "phpMyAdmin image"
    else
        check_warn "phpMyAdmin image not downloaded yet"
    fi
else
    check_fail "Cannot check Docker images (daemon not running)"
fi

echo ""
echo -e "${BOLD}5. Docker Containers${NC}"
echo "───────────────────────"

if docker info &> /dev/null 2>&1; then
    # Check if containers exist
    if docker ps -a --format "{{.Names}}" | grep -q "norex_apache"; then
        if docker ps --format "{{.Names}}" | grep -q "norex_apache"; then
            check_pass "Apache container (running)"
        else
            check_warn "Apache container (stopped)"
        fi
    else
        check_warn "Apache container not created yet"
    fi
    
    if docker ps -a --format "{{.Names}}" | grep -q "norex_mysql"; then
        if docker ps --format "{{.Names}}" | grep -q "norex_mysql"; then
            check_pass "MySQL container (running)"
        else
            check_warn "MySQL container (stopped)"
        fi
    else
        check_warn "MySQL container not created yet"
    fi
    
    if docker ps -a --format "{{.Names}}" | grep -q "norex_pma"; then
        if docker ps --format "{{.Names}}" | grep -q "norex_pma"; then
            check_pass "phpMyAdmin container (running)"
        else
            check_warn "phpMyAdmin container (stopped)"
        fi
    else
        check_warn "phpMyAdmin container not created yet"
    fi
else
    check_fail "Cannot check Docker services (daemon not running)"
fi

echo ""
echo -e "${BOLD}6. Network Connectivity${NC}"
echo "───────────────────────"

# Check if services are accessible
if docker ps --format "{{.Names}}" | grep -q "norex_apache"; then
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        check_pass "Web server accessible (http://localhost:8080)"
    else
        check_fail "Web server not accessible"
    fi
else
    check_warn "Web server not running"
fi

if docker ps --format "{{.Names}}" | grep -q "norex_pma"; then
    if curl -s http://localhost:8081 > /dev/null 2>&1; then
        check_pass "phpMyAdmin accessible (http://localhost:8081)"
    else
        check_fail "phpMyAdmin not accessible"
    fi
else
    check_warn "phpMyAdmin not running"
fi

echo ""
echo -e "${BOLD}7. Documentation${NC}"
echo "───────────────────────"

for doc in "README.md" "docs/README.md" "docs/guides/PHASE_3_COMPLETE.md" "docs/guides/PHASE_3_QUICK_START.md"; do
    if [ -f "$PROJECT_ROOT/$doc" ]; then
        check_pass "$doc"
    else
        check_warn "$doc missing"
    fi
done

echo ""
echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "                    Verification Summary                       "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

log_message "═══════════════════════════════════════════════════════════"
log_message "Verification Summary: PASS=$PASS, WARN=$WARN, FAIL=$FAIL"

echo -e "${GREEN}Passed:${NC}  $PASS checks"
echo -e "${YELLOW}Warnings:${NC} $WARN checks"
echo -e "${RED}Failed:${NC}  $FAIL checks"
echo ""

if [ $FAIL -eq 0 ]; then
    if [ $WARN -eq 0 ]; then
        log_message "✅ All checks passed! NorexProject is ready to use."
        echo -e "${GREEN}✅ All checks passed! NorexProject is ready to use.${NC}"
    else
        log_message "⚠️ Some warnings detected, but system is functional."
        echo -e "${YELLOW}⚠️  Some warnings detected, but system is functional.${NC}"
    fi
    echo ""
    echo "📄 View logs: Check /app/logs/verify.log"
    echo ""
    exit 0
else
    log_message "❌ Some checks failed. Please fix the issues above."
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "📄 View logs: Check /app/logs/verify.log"
    echo ""
    exit 1
fi
