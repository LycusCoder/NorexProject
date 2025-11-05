#!/bin/bash
################################################################################
# NOREX V3.6 - Binary Extraction Utility
# Extracts downloaded archives (tar.gz, zip)
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Parameters
BINARY_NAME="$1"
ARCHIVE_PATH="$2"
EXTRACT_TO="$3"

if [ -z "$BINARY_NAME" ] || [ -z "$ARCHIVE_PATH" ] || [ -z "$EXTRACT_TO" ]; then
    echo -e "${RED}Usage: $0 <binary_name> <archive_path> <extract_to_dir>${NC}"
    exit 1
fi

# Logging
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"
LOG_FILE="$PROJECT_ROOT/logs/extract.log"
mkdir -p "$PROJECT_ROOT/logs"

log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  📦 Extracting: $BINARY_NAME${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo ""

log_msg "📦 Starting extraction: $BINARY_NAME"
log_msg "   Archive: $ARCHIVE_PATH"
log_msg "   Extract to: $EXTRACT_TO"

# Check if archive exists
if [ ! -f "$ARCHIVE_PATH" ]; then
    echo -e "${RED}❌ Archive not found: $ARCHIVE_PATH${NC}"
    log_msg "❌ Archive not found"
    exit 1
fi

# Create extraction directory
mkdir -p "$EXTRACT_TO"

# Detect archive type and extract
if [[ "$ARCHIVE_PATH" == *.tar.gz ]] || [[ "$ARCHIVE_PATH" == *.tgz ]]; then
    echo -e "${BLUE}📦 Extracting tar.gz archive...${NC}"
    log_msg "📦 Extracting tar.gz"
    
    if tar -xzf "$ARCHIVE_PATH" -C "$EXTRACT_TO" --strip-components=0 2>&1 | tee -a "$LOG_FILE"; then
        echo -e "${GREEN}✅ Extraction completed${NC}"
        log_msg "✅ Extraction successful"
    else
        echo -e "${RED}❌ Extraction failed${NC}"
        log_msg "❌ Extraction failed"
        exit 1
    fi

elif [[ "$ARCHIVE_PATH" == *.tar.xz ]] || [[ "$ARCHIVE_PATH" == *.txz ]]; then
    echo -e "${BLUE}📦 Extracting tar.xz archive...${NC}"
    log_msg "📦 Extracting tar.xz"
    
    if tar -xJf "$ARCHIVE_PATH" -C "$EXTRACT_TO" --strip-components=0 2>&1 | tee -a "$LOG_FILE"; then
        echo -e "${GREEN}✅ Extraction completed${NC}"
        log_msg "✅ Extraction successful"
    else
        echo -e "${RED}❌ Extraction failed${NC}"
        log_msg "❌ Extraction failed"
        exit 1
    fi
    
elif [[ "$ARCHIVE_PATH" == *.zip ]]; then
    echo -e "${BLUE}📦 Extracting zip archive...${NC}"
    log_msg "📦 Extracting zip"
    
    if unzip -q "$ARCHIVE_PATH" -d "$EXTRACT_TO" 2>&1 | tee -a "$LOG_FILE"; then
        echo -e "${GREEN}✅ Extraction completed${NC}"
        log_msg "✅ Extraction successful"
    else
        echo -e "${RED}❌ Extraction failed${NC}"
        log_msg "❌ Extraction failed"
        exit 1
    fi
    
else
    echo -e "${RED}❌ Unsupported archive format: $ARCHIVE_PATH${NC}"
    echo -e "${YELLOW}💡 Supported formats: .tar.gz, .tar.xz, .zip${NC}"
    log_msg "❌ Unsupported format"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ $BINARY_NAME extracted to: $EXTRACT_TO${NC}"
log_msg "✅ Extraction complete: $EXTRACT_TO"
exit 0
