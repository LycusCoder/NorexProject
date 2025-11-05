#!/bin/bash
################################################################################
# NOREX V3.6 - Binary Download Utility
# Downloads binaries from URLs specified in downloads.yaml
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
DOWNLOAD_URL="$2"
OUTPUT_PATH="$3"

if [ -z "$BINARY_NAME" ] || [ -z "$DOWNLOAD_URL" ] || [ -z "$OUTPUT_PATH" ]; then
    echo -e "${RED}Usage: $0 <binary_name> <download_url> <output_path>${NC}"
    exit 1
fi

# Logging
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"
LOG_FILE="$PROJECT_ROOT/logs/download.log"
mkdir -p "$PROJECT_ROOT/logs"

log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo -e "${CYAN}  📥 Downloading: $BINARY_NAME${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════${NC}"
echo ""

log_msg "📥 Starting download: $BINARY_NAME"
log_msg "   URL: $DOWNLOAD_URL"
log_msg "   Output: $OUTPUT_PATH"

# Create output directory
mkdir -p "$(dirname "$OUTPUT_PATH")"

# Check if already exists (skip if configured)
if [ -f "$OUTPUT_PATH" ]; then
    echo -e "${YELLOW}⚠️  File already exists: $OUTPUT_PATH${NC}"
    echo -e "${YELLOW}   Skipping download...${NC}"
    log_msg "⚠️  File exists, skipping download"
    exit 0
fi

# Download with wget (with retry)
RETRY_COUNT=3
RETRY_DELAY=5

for attempt in $(seq 1 $RETRY_COUNT); do
    echo -e "${BLUE}🔄 Download attempt $attempt/$RETRY_COUNT...${NC}"
    log_msg "🔄 Download attempt $attempt"
    
    if wget -q --show-progress --timeout=300 -O "$OUTPUT_PATH" "$DOWNLOAD_URL" 2>&1 | tee -a "$LOG_FILE"; then
        echo ""
        echo -e "${GREEN}✅ Download completed: $BINARY_NAME${NC}"
        log_msg "✅ Download successful: $BINARY_NAME"
        exit 0
    else
        echo -e "${RED}❌ Download failed (attempt $attempt)${NC}"
        log_msg "❌ Download failed (attempt $attempt)"
        
        if [ $attempt -lt $RETRY_COUNT ]; then
            echo -e "${YELLOW}🔄 Retrying in $RETRY_DELAY seconds...${NC}"
            sleep $RETRY_DELAY
        fi
    fi
done

# All attempts failed
echo ""
echo -e "${RED}❌ Failed to download: $BINARY_NAME${NC}"
echo -e "${YELLOW}💡 Please check:${NC}"
echo -e "   1. Internet connection"
echo -e "   2. Download URL in config/downloads.yaml"
echo -e "   3. Firewall/proxy settings"
log_msg "❌ Download failed after $RETRY_COUNT attempts"
exit 1
