#!/bin/bash
################################################################################
# NOREX V3.6 - Setup Verification & Auto-Download
# Checks and downloads missing binaries automatically
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
CONFIG_FILE="$PROJECT_ROOT/config/downloads.yaml"
LOG_FILE="$PROJECT_ROOT/logs/verify_setup.log"

mkdir -p "$PROJECT_ROOT/logs"

# Logging function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

echo "" > "$LOG_FILE"
log_msg "═══════════════════════════════════════════════════════════════"
log_msg "🔍 VERIFY SETUP - Auto-download binaries"
log_msg "═══════════════════════════════════════════════════════════════"

echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "       🔍 NOREX V3.6 - Setup Verification & Download           "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    log_msg "❌ Config file missing"
    exit 1
fi

echo -e "${BLUE}📋 Checking binary requirements...${NC}"
echo ""

# Binary definitions (manual for now, later parse from YAML)
declare -A BINARIES=(
    ["apache"]="bin/apache/httpd-2.4.62"
    ["mysql"]="bin/mysql/mysql-8.4.3-linux-glibc2.28-x86_64"
    ["php"]="bin/php/php-8.3.26"
    ["phpmyadmin"]="bin/phpmyadmin/phpMyAdmin-5.2.1-all-languages"
)

declare -A DOWNLOAD_URLS=(
    ["apache"]="https://archive.apache.org/dist/httpd/httpd-2.4.62.tar.gz"
    ["mysql"]="https://dev.mysql.com/get/Downloads/MySQL-8.4/mysql-8.4.3-linux-glibc2.28-x86_64.tar.xz"
    ["php"]="https://www.php.net/distributions/php-8.3.26.tar.gz"
    ["phpmyadmin"]="https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.tar.gz"
)

NEED_DOWNLOAD=false

# Check each binary
for binary in apache mysql php phpmyadmin; do
    binary_path="${BINARIES[$binary]}"
    full_path="$PROJECT_ROOT/$binary_path"
    
    if [ -d "$full_path" ]; then
        echo -e "  ${GREEN}✓${NC} $binary: Found at $binary_path"
        log_msg "✓ $binary: Found"
    else
        echo -e "  ${YELLOW}⚠${NC} $binary: Not found, will download"
        log_msg "⚠ $binary: Missing"
        NEED_DOWNLOAD=true
    fi
done

echo ""

# Download missing binaries
if [ "$NEED_DOWNLOAD" = true ]; then
    echo -e "${YELLOW}📥 Downloading missing binaries...${NC}"
    echo -e "${YELLOW}   (This may take a while on first run)${NC}"
    echo ""
    log_msg "📥 Starting downloads..."
    
    for binary in apache mysql php phpmyadmin; do
        binary_path="${BINARIES[$binary]}"
        full_path="$PROJECT_ROOT/$binary_path"
        
        if [ ! -d "$full_path" ]; then
            url="${DOWNLOAD_URLS[$binary]}"
            archive_name=$(basename "$url")
            download_path="$PROJECT_ROOT/bin/.downloads/$archive_name"
            extract_to="$PROJECT_ROOT/bin/$binary/"
            
            echo -e "${CYAN}───────────────────────────────────────────────────────────────${NC}"
            echo -e "${CYAN}  📦 Processing: $binary${NC}"
            echo -e "${CYAN}───────────────────────────────────────────────────────────────${NC}"
            
            # Create download directory
            mkdir -p "$PROJECT_ROOT/bin/.downloads"
            mkdir -p "$extract_to"
            
            # Download
            log_msg "📥 Downloading $binary..."
            if bash "$PROJECT_ROOT/scripts/utils/download_binary.sh" \
                "$binary" \
                "$url" \
                "$download_path"; then
                
                log_msg "✓ Download completed: $binary"
                
                # Extract
                log_msg "📦 Extracting $binary..."
                if bash "$PROJECT_ROOT/scripts/utils/extract_binary.sh" \
                    "$binary" \
                    "$download_path" \
                    "$extract_to"; then
                    
                    log_msg "✓ Extraction completed: $binary"
                    echo -e "${GREEN}✅ $binary ready!${NC}"
                    echo ""
                    
                    # Clean up archive (optional)
                    # rm -f "$download_path"
                else
                    log_msg "❌ Extraction failed: $binary"
                    echo -e "${RED}❌ Failed to extract $binary${NC}"
                    exit 1
                fi
            else
                log_msg "❌ Download failed: $binary"
                echo -e "${RED}❌ Failed to download $binary${NC}"
                echo -e "${YELLOW}💡 Please check:${NC}"
                echo -e "   1. Internet connection"
                echo -e "   2. Download URLs in config/downloads.yaml"
                exit 1
            fi
        fi
    done
    
    echo ""
    echo -e "${GREEN}✅ All binaries downloaded and extracted!${NC}"
    log_msg "✅ All binaries ready"
else
    echo -e "${GREEN}✅ All binaries already present!${NC}"
    log_msg "✅ All binaries present"
fi

echo ""
echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════"
echo "                    ✅ Setup Verification Complete              "
echo "═══════════════════════════════════════════════════════════════"
echo -e "${NC}"
echo ""
echo -e "${GREEN}🚀 Ready to start services!${NC}"
echo -e "   Run: ${CYAN}bash scripts/start_services.sh${NC}"
echo ""
echo -e "📄 View logs: ${CYAN}$LOG_FILE${NC}"
echo ""

log_msg "═══════════════════════════════════════════════════════════════"
log_msg "✅ Setup verification complete"
log_msg "═══════════════════════════════════════════════════════════════"

exit 0
