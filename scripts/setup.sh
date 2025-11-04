#!/bin/bash

################################################################################
# NorexProject - Smart Setup Script with OS Detection & Auto-Install
# Automatically detects OS and installs missing dependencies
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "       🔧 NorexProject Smart Setup with Auto-Install          "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

# Ask for confirmation
ask_confirmation() {
    local prompt="$1"
    while true; do
        read -p "$(echo -e ${YELLOW}$prompt${NC}) [y/n]: " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer y (yes) or n (no).";;
        esac
    done
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$ID
            OS_VERSION=$VERSION_ID
        elif [ -f /etc/lsb-release ]; then
            . /etc/lsb-release
            OS=$DISTRIB_ID
            OS_VERSION=$DISTRIB_RELEASE
        else
            OS="unknown"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        OS_VERSION=$(sw_vers -productVersion)
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
    else
        OS="unknown"
    fi
}

# ============================================================================
# OS DETECTION
# ============================================================================

echo -e "${BLUE}🔍 Detecting Operating System...${NC}"
detect_os

case $OS in
    ubuntu|debian)
        echo -e "${GREEN}✓ Detected: Ubuntu/Debian Linux${NC}"
        PACKAGE_MANAGER="apt"
        ;;
    fedora|rhel|centos)
        echo -e "${GREEN}✓ Detected: Fedora/RHEL/CentOS Linux${NC}"
        PACKAGE_MANAGER="dnf"
        ;;
    arch|manjaro)
        echo -e "${GREEN}✓ Detected: Arch Linux${NC}"
        PACKAGE_MANAGER="pacman"
        ;;
    macos)
        echo -e "${GREEN}✓ Detected: macOS ${OS_VERSION}${NC}"
        PACKAGE_MANAGER="brew"
        ;;
    *)
        echo -e "${YELLOW}⚠ Unknown OS. Manual installation may be required.${NC}"
        PACKAGE_MANAGER="unknown"
        ;;
esac
echo ""

# ============================================================================
# DEPENDENCY CHECKING & AUTO-INSTALL
# ============================================================================

MISSING_DEPS=()
INSTALL_COMMANDS=()

echo -e "${BLUE}📋 Checking system requirements...${NC}"
echo ""

# ----------------------------------------------------------------------------
# 1. CHECK DOCKER
# ----------------------------------------------------------------------------
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
    docker --version
    
    # Check if Docker is running
    echo -n "Checking Docker daemon... "
    if docker info &> /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC}"
    else
        echo -e "${YELLOW}⚠ Not running${NC}"
        echo -e "${YELLOW}Please start Docker daemon/Desktop${NC}"
        if [[ "$OS" == "macos" ]]; then
            echo -e "${BLUE}  Run: open -a Docker${NC}"
        elif [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
            echo -e "${BLUE}  Run: sudo systemctl start docker${NC}"
        fi
    fi
else
    echo -e "${RED}✗ Not installed${NC}"
    MISSING_DEPS+=("docker")
    
    case $PACKAGE_MANAGER in
        apt)
            INSTALL_COMMANDS+=("Docker: curl -fsSL https://get.docker.com | sh && sudo usermod -aG docker \$USER")
            ;;
        dnf)
            INSTALL_COMMANDS+=("Docker: sudo dnf install -y docker && sudo systemctl start docker && sudo usermod -aG docker \$USER")
            ;;
        pacman)
            INSTALL_COMMANDS+=("Docker: sudo pacman -S docker && sudo systemctl start docker && sudo usermod -aG docker \$USER")
            ;;
        brew)
            INSTALL_COMMANDS+=("Docker: brew install --cask docker")
            ;;
    esac
fi
echo ""

# ----------------------------------------------------------------------------
# 2. CHECK NODE.JS
# ----------------------------------------------------------------------------
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Installed${NC} ${NODE_VERSION}"
else
    echo -e "${RED}✗ Not installed${NC}"
    MISSING_DEPS+=("nodejs")
    
    case $PACKAGE_MANAGER in
        apt)
            INSTALL_COMMANDS+=("Node.js: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs")
            ;;
        dnf)
            INSTALL_COMMANDS+=("Node.js: sudo dnf install -y nodejs")
            ;;
        pacman)
            INSTALL_COMMANDS+=("Node.js: sudo pacman -S nodejs npm")
            ;;
        brew)
            INSTALL_COMMANDS+=("Node.js: brew install node")
            ;;
    esac
fi
echo ""

# ----------------------------------------------------------------------------
# 3. CHECK YARN
# ----------------------------------------------------------------------------
echo -n "Checking Yarn... "
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    echo -e "${GREEN}✓ Installed${NC} v${YARN_VERSION}"
else
    echo -e "${RED}✗ Not installed${NC}"
    MISSING_DEPS+=("yarn")
    
    case $PACKAGE_MANAGER in
        apt|dnf|pacman)
            INSTALL_COMMANDS+=("Yarn: npm install -g yarn")
            ;;
        brew)
            INSTALL_COMMANDS+=("Yarn: brew install yarn")
            ;;
    esac
fi
echo ""

# ----------------------------------------------------------------------------
# 4. CHECK RUST & CARGO
# ----------------------------------------------------------------------------
echo -n "Checking Rust/Cargo... "
if command -v rustc &> /dev/null && command -v cargo &> /dev/null; then
    RUST_VERSION=$(rustc --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ Installed${NC} ${RUST_VERSION}"
else
    echo -e "${RED}✗ Not installed${NC}"
    MISSING_DEPS+=("rust")
    INSTALL_COMMANDS+=("Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y")
fi
echo ""

# ----------------------------------------------------------------------------
# 5. CHECK TAURI DEPENDENCIES (Linux only)
# ----------------------------------------------------------------------------
if [[ "$OS" == "ubuntu" ]] || [[ "$OS" == "debian" ]]; then
    echo "Checking Tauri dependencies (Linux)..."
    
    TAURI_DEPS_MISSING=()
    
    # Check WebKit2GTK
    if ! pkg-config --exists webkit2gtk-4.1 2>/dev/null && ! pkg-config --exists webkit2gtk-4.0 2>/dev/null; then
        TAURI_DEPS_MISSING+=("libwebkit2gtk-4.1-dev")
    fi
    
    # Check build-essential
    if ! command -v gcc &> /dev/null; then
        TAURI_DEPS_MISSING+=("build-essential")
    fi
    
    # Check other dependencies
    for dep in "libssl-dev" "libgtk-3-dev" "libayatana-appindicator3-dev" "librsvg2-dev"; do
        if ! dpkg -l | grep -q "^ii  $dep"; then
            TAURI_DEPS_MISSING+=("$dep")
        fi
    done
    
    if [ ${#TAURI_DEPS_MISSING[@]} -gt 0 ]; then
        echo -e "${YELLOW}⚠ Missing Tauri dependencies: ${TAURI_DEPS_MISSING[*]}${NC}"
        MISSING_DEPS+=("tauri-deps")
        INSTALL_COMMANDS+=("Tauri deps: sudo apt-get update && sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev libgtk-3-dev")
    else
        echo -e "${GREEN}✓ All Tauri dependencies installed${NC}"
    fi
    echo ""
fi

# ============================================================================
# AUTO-INSTALL MISSING DEPENDENCIES
# ============================================================================

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}⚠️  Missing Dependencies Detected${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${RED}Missing: ${MISSING_DEPS[*]}${NC}"
    echo ""
    echo -e "${BLUE}Installation commands available:${NC}"
    for cmd in "${INSTALL_COMMANDS[@]}"; do
        echo -e "  ${GREEN}•${NC} $cmd"
    done
    echo ""
    
    if ask_confirmation "Would you like to install missing dependencies automatically?"; then
        echo ""
        echo -e "${GREEN}🚀 Starting automatic installation...${NC}"
        echo ""
        
        # Install Docker
        if [[ " ${MISSING_DEPS[@]} " =~ " docker " ]]; then
            echo -e "${BLUE}📦 Installing Docker...${NC}"
            case $PACKAGE_MANAGER in
                apt)
                    curl -fsSL https://get.docker.com | sh
                    sudo usermod -aG docker $USER
                    echo -e "${GREEN}✓ Docker installed${NC}"
                    echo -e "${YELLOW}⚠️  Please logout and login again for Docker group to take effect${NC}"
                    ;;
                dnf)
                    sudo dnf install -y docker
                    sudo systemctl start docker
                    sudo systemctl enable docker
                    sudo usermod -aG docker $USER
                    echo -e "${GREEN}✓ Docker installed${NC}"
                    ;;
                pacman)
                    sudo pacman -S --noconfirm docker
                    sudo systemctl start docker
                    sudo systemctl enable docker
                    sudo usermod -aG docker $USER
                    echo -e "${GREEN}✓ Docker installed${NC}"
                    ;;
                brew)
                    brew install --cask docker
                    echo -e "${GREEN}✓ Docker installed${NC}"
                    echo -e "${YELLOW}⚠️  Please start Docker Desktop manually${NC}"
                    ;;
            esac
            echo ""
        fi
        
        # Install Node.js
        if [[ " ${MISSING_DEPS[@]} " =~ " nodejs " ]]; then
            echo -e "${BLUE}📦 Installing Node.js...${NC}"
            case $PACKAGE_MANAGER in
                apt)
                    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    ;;
                dnf)
                    sudo dnf install -y nodejs
                    ;;
                pacman)
                    sudo pacman -S --noconfirm nodejs npm
                    ;;
                brew)
                    brew install node
                    ;;
            esac
            echo -e "${GREEN}✓ Node.js installed${NC}"
            echo ""
        fi
        
        # Install Yarn
        if [[ " ${MISSING_DEPS[@]} " =~ " yarn " ]]; then
            echo -e "${BLUE}📦 Installing Yarn...${NC}"
            if command -v npm &> /dev/null; then
                sudo npm install -g yarn
                echo -e "${GREEN}✓ Yarn installed${NC}"
            else
                echo -e "${RED}✗ npm not found, cannot install Yarn${NC}"
            fi
            echo ""
        fi
        
        # Install Rust
        if [[ " ${MISSING_DEPS[@]} " =~ " rust " ]]; then
            echo -e "${BLUE}📦 Installing Rust...${NC}"
            curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
            source "$HOME/.cargo/env"
            echo -e "${GREEN}✓ Rust installed${NC}"
            echo ""
        fi
        
        # Install Tauri dependencies
        if [[ " ${MISSING_DEPS[@]} " =~ " tauri-deps " ]]; then
            echo -e "${BLUE}📦 Installing Tauri dependencies...${NC}"
            case $PACKAGE_MANAGER in
                apt)
                    sudo apt-get update
                    sudo apt-get install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev libgtk-3-dev
                    ;;
            esac
            echo -e "${GREEN}✓ Tauri dependencies installed${NC}"
            echo ""
        fi
        
        echo -e "${GREEN}✅ All dependencies installed successfully!${NC}"
        echo ""
        
    else
        echo -e "${YELLOW}⚠️  Skipping automatic installation${NC}"
        echo -e "${YELLOW}Please install missing dependencies manually${NC}"
        echo ""
    fi
fi

echo ""

echo -e "${BLUE}🐳 Checking Docker images...${NC}"
echo ""

# Only check Docker images if Docker is available
if command -v docker &> /dev/null && docker info &> /dev/null 2>&1; then
    # Check if images need to be built
    if ! docker image inspect norexproject-web &> /dev/null 2>&1; then
        echo -e "${YELLOW}Docker images not found${NC}"
        if ask_confirmation "Build Docker images now? (Required for first-time setup)"; then
            echo ""
            echo -e "${BLUE}Building Docker images...${NC}"
            echo -e "${YELLOW}This may take a few minutes on first build...${NC}"
            cd "$PROJECT_ROOT"
            docker compose build
            echo -e "${GREEN}✓ Docker images built successfully${NC}"
        else
            echo -e "${YELLOW}⚠️  Skipped. Run 'bash norex.sh start' later to build${NC}"
        fi
    else
        echo -e "${GREEN}✓ Docker images already available${NC}"
        
        # Show available images
        echo -e "${BLUE}Available images:${NC}"
        docker images --format "  • {{.Repository}}:{{.Tag}}" | grep -E "(norexproject|mysql|phpmyadmin)" || true
    fi
else
    echo -e "${YELLOW}⚠️  Docker not available, skipping image check${NC}"
fi
echo ""

echo -e "${BLUE}📁 Creating required directories...${NC}"
echo ""

mkdir -p "$PROJECT_ROOT/data/mysql"
mkdir -p "$PROJECT_ROOT/www"

if [ ! -f "$PROJECT_ROOT/www/index.php" ]; then
    cat > "$PROJECT_ROOT/www/index.php" << 'EOF'
<?php
    echo "<h1>NorexProject Stack ON!</h1>";
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
chmod +x "$PROJECT_ROOT/norex.sh" 2>/dev/null || true
chmod +x "$PROJECT_ROOT/scripts/"*.sh 2>/dev/null || true
chmod +x "$PROJECT_ROOT/gui/run.sh" 2>/dev/null || true
chmod +x "$PROJECT_ROOT/gui/build.sh" 2>/dev/null || true
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

echo -e "${GREEN}"
echo "═══════════════════════════════════════════════════════════════"
echo "              ✅ NorexProject Setup Complete!                 "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Show summary
echo -e "${BOLD}📊 Setup Summary:${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} Operating System: $OS"
echo -e "  ${GREEN}✓${NC} Package Manager: $PACKAGE_MANAGER"

if command -v docker &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Docker: $(docker --version | cut -d' ' -f3 | tr -d ',')"
else
    echo -e "  ${RED}✗${NC} Docker: Not installed"
fi

if command -v node &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Node.js: $(node --version)"
else
    echo -e "  ${YELLOW}⚠${NC} Node.js: Not installed (needed for GUI)"
fi

if command -v yarn &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Yarn: v$(yarn --version)"
else
    echo -e "  ${YELLOW}⚠${NC} Yarn: Not installed (needed for GUI)"
fi

if command -v rustc &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Rust: $(rustc --version | cut -d' ' -f2)"
else
    echo -e "  ${YELLOW}⚠${NC} Rust: Not installed (needed for GUI)"
fi

echo ""
echo -e "${BOLD}🚀 Next Steps:${NC}"
echo ""
echo -e "${CYAN}1. Start Docker services:${NC}"
echo -e "   ${BOLD}bash norex.sh start${NC}"
echo ""
echo -e "${CYAN}2. Launch Desktop GUI (recommended):${NC}"
echo -e "   ${BOLD}bash norex.sh gui${NC}"
echo ""
echo -e "${CYAN}3. Or open in browser:${NC}"
echo -e "   ${BOLD}bash norex.sh web${NC}    # Main site (http://localhost:8080)"
echo -e "   ${BOLD}bash norex.sh db${NC}     # phpMyAdmin (http://localhost:8081)"
echo ""
echo -e "${CYAN}4. Check status anytime:${NC}"
echo -e "   ${BOLD}bash norex.sh status${NC}  # Service status"
echo -e "   ${BOLD}bash norex.sh verify${NC}  # Full health check"
echo ""
echo -e "${CYAN}5. For all commands:${NC}"
echo -e "   ${BOLD}bash norex.sh help${NC}"
echo ""

# Show warnings if any dependencies missing
if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Note: Some dependencies are still missing${NC}"
    echo -e "${YELLOW}   GUI features may not work until all dependencies are installed${NC}"
    echo ""
fi

echo -e "${GREEN}✨ Happy Coding with NorexProject! ✨${NC}"
echo ""