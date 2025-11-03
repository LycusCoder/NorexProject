#!/bin/bash

################################################################################
# NourProject - First-time Setup Script
# Installs dependencies and prepares environment
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "            🔧 NourProject Setup - Phase 3                    "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

echo -e "${BLUE}📋 Checking requirements...${NC}"
echo ""

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    docker --version
else
    echo -e "${RED}✗${NC}"
    echo -e "${RED}Docker is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker first:${NC}"
    echo -e "  • Linux: https://docs.docker.com/engine/install/"
    echo -e "  • Mac: https://docs.docker.com/desktop/install/mac-install/"
    echo -e "  • Windows: https://docs.docker.com/desktop/install/windows-install/"
    exit 1
fi
echo ""

# Check Python
echo -n "Checking Python... "
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    python3 --version
else
    echo -e "${YELLOW}⚠${NC}"
    echo -e "${YELLOW}Python 3 not found (needed for GUI)${NC}"
fi
echo ""

# Check if Docker is running
echo -n "Checking Docker daemon... "
if docker info &> /dev/null; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo -e "${YELLOW}Please start Docker daemon first${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}📦 Installing GUI dependencies...${NC}"
echo ""

if command -v python3 &> /dev/null; then
    if command -v pip3 &> /dev/null; then
        echo "Installing PySide6 and psutil..."
        pip3 install PySide6 psutil --quiet || {
            echo -e "${YELLOW}⚠️  GUI dependencies installation failed${NC}"
            echo -e "${YELLOW}You can install manually: pip3 install PySide6 psutil${NC}"
        }
        echo -e "${GREEN}✓ GUI dependencies ready${NC}"
    else
        echo -e "${YELLOW}⚠️  pip3 not found, skipping GUI dependencies${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Python 3 not available, skipping GUI dependencies${NC}"
fi
echo ""

echo -e "${BLUE}🐳 Checking Docker images...${NC}"
echo ""

# Check if images need to be built
if ! docker image inspect nourproject-web &> /dev/null; then
    echo "Building Docker images (first time only)..."
    echo "This may take a few minutes..."
    cd "$PROJECT_ROOT"
    docker-compose build
    echo -e "${GREEN}✓ Docker images built${NC}"
else
    echo -e "${GREEN}✓ Docker images already available${NC}"
fi
echo ""

echo -e "${BLUE}📁 Creating required directories...${NC}"
echo ""

mkdir -p "$PROJECT_ROOT/data/mysql"
mkdir -p "$PROJECT_ROOT/www"

if [ ! -f "$PROJECT_ROOT/www/index.php" ]; then
    cat > "$PROJECT_ROOT/www/index.php" << 'EOF'
<?php
    echo "<h1>NourProject Stack ON!</h1>";
    echo "<h2>PHP Version: " . phpversion() . "</h2>";
    if (extension_loaded('mysqli')) {
        echo "<p style='color: green;'>✅ MySQLi Extension Active.</p>";
    } else {
        echo "<p style='color: red;'>❌ MySQLi Extension NOT Active.</p>";
    }
?>
EOF
    echo -e "${GREEN}✓ Created default index.php${NC}"
else
    echo -e "${GREEN}✓ www/index.php already exists${NC}"
fi
echo ""

echo -e "${BLUE}🔒 Setting permissions...${NC}"
chmod +x "$PROJECT_ROOT/nour.sh" 2>/dev/null || true
chmod +x "$PROJECT_ROOT/scripts/"*.sh 2>/dev/null || true
chmod +x "$PROJECT_ROOT/gui/run.sh" 2>/dev/null || true
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

echo -e "${GREEN}"
echo "═══════════════════════════════════════════════════════════════"
echo "                  ✅ Setup Complete!                          "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

echo -e "${BOLD}Next Steps:${NC}"
echo ""
echo -e "${CYAN}1. Start services:${NC}"
echo -e "   bash nour.sh start"
echo ""
echo -e "${CYAN}2. Launch GUI (recommended):${NC}"
echo -e "   bash nour.sh gui"
echo ""
echo -e "${CYAN}3. Or open in browser:${NC}"
echo -e "   bash nour.sh open"
echo ""
echo -e "${CYAN}4. For help:${NC}"
echo -e "   bash nour.sh help"
echo ""
echo -e "${GREEN}🚀 Ready to use NourProject!${NC}"
echo ""
