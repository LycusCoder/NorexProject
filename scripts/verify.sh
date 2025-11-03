#!/bin/bash

################################################################################
# NourProject - Verification & Health Check Script
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

echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "          🔍 NourProject Verification & Health Check          "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "  ${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "  ${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "  ${YELLOW}⚠${NC} $1"
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

# Python
if command -v python3 &> /dev/null; then
    check_pass "Python 3 installed ($(python3 --version | cut -d' ' -f2))"
else
    check_warn "Python 3 not installed (needed for GUI)"
fi

# PySide6
if python3 -c "import PySide6" 2>/dev/null; then
    check_pass "PySide6 installed (GUI ready)"
else
    check_warn "PySide6 not installed (GUI unavailable)"
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

if [ -f "$PROJECT_ROOT/nour.sh" ]; then
    if [ -x "$PROJECT_ROOT/nour.sh" ]; then
        check_pass "nour.sh (executable)"
    else
        check_warn "nour.sh (not executable)"
    fi
else
    check_fail "nour.sh missing"
fi

if [ -f "$PROJECT_ROOT/gui/main.py" ]; then
    check_pass "gui/main.py"
else
    check_fail "gui/main.py missing"
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
echo -e "${BOLD}4. Docker Services${NC}"
echo "───────────────────────"

if docker info &> /dev/null 2>&1; then
    # Check if containers exist
    if docker ps -a --format "{{.Names}}" | grep -q "nour_apache"; then
        if docker ps --format "{{.Names}}" | grep -q "nour_apache"; then
            check_pass "Apache container (running)"
        else
            check_warn "Apache container (stopped)"
        fi
    else
        check_warn "Apache container not created yet"
    fi
    
    if docker ps -a --format "{{.Names}}" | grep -q "nour_mysql"; then
        if docker ps --format "{{.Names}}" | grep -q "nour_mysql"; then
            check_pass "MySQL container (running)"
        else
            check_warn "MySQL container (stopped)"
        fi
    else
        check_warn "MySQL container not created yet"
    fi
    
    if docker ps -a --format "{{.Names}}" | grep -q "nour_pma"; then
        if docker ps --format "{{.Names}}" | grep -q "nour_pma"; then
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
echo -e "${BOLD}5. Network Connectivity${NC}"
echo "───────────────────────"

# Check if services are accessible
if docker ps --format "{{.Names}}" | grep -q "nour_apache"; then
    if curl -s http://localhost:8080 > /dev/null 2>&1; then
        check_pass "Web server accessible (http://localhost:8080)"
    else
        check_fail "Web server not accessible"
    fi
else
    check_warn "Web server not running"
fi

if docker ps --format "{{.Names}}" | grep -q "nour_pma"; then
    if curl -s http://localhost:8081 > /dev/null 2>&1; then
        check_pass "phpMyAdmin accessible (http://localhost:8081)"
    else
        check_fail "phpMyAdmin not accessible"
    fi
else
    check_warn "phpMyAdmin not running"
fi

echo ""
echo -e "${BOLD}6. Documentation${NC}"
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

echo -e "${GREEN}Passed:${NC}  $PASS checks"
echo -e "${YELLOW}Warnings:${NC} $WARN checks"
echo -e "${RED}Failed:${NC}  $FAIL checks"
echo ""

if [ $FAIL -eq 0 ]; then
    if [ $WARN -eq 0 ]; then
        echo -e "${GREEN}✅ All checks passed! NourProject is ready to use.${NC}"
    else
        echo -e "${YELLOW}⚠️  Some warnings detected, but system is functional.${NC}"
    fi
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please fix the issues above.${NC}"
    exit 1
fi
