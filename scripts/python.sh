#!/bin/bash

###############################################################################
# NorexProject - Python CLI (Docker Isolated)
# Phase 3: Python 3.11+ via Docker without host installation
#
# Usage:
#   bash scripts/python.sh              # Interactive Python shell
#   bash scripts/python.sh -i           # Interactive mode (explicit)
#   bash scripts/python.sh 'code'       # Execute Python code
#   bash scripts/python.sh script.py    # Run Python script file
#   bash scripts/python.sh -c 'code'    # Execute code (explicit)
#
# Examples:
#   bash scripts/python.sh
#   bash scripts/python.sh 'print("Hello from Docker Python!")'
#   bash scripts/python.sh my_script.py
#   bash scripts/python.sh -c 'import sys; print(sys.version)'
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Python Docker image (official Python 3.11+)
PYTHON_IMAGE="python:3.11-slim"
CONTAINER_NAME="norex_python_cli"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"

# Setup logging
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/python.log"

# Create logs directory if not exists
mkdir -p "$LOG_DIR"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Clear old log and start new session
echo "═══════════════════════════════════════════════════════════" > "$LOG_FILE"
log_message "🐍 PYTHON CLI - Session started"
log_message "═══════════════════════════════════════════════════════════"

echo -e "${CYAN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🐍 NorexProject Python CLI (Docker)          ║${NC}"
echo -e "${CYAN}║     Python 3.11+ Isolated Environment            ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    log_message "❌ ERROR: Docker is not installed"
    echo -e "${RED}❌ Error: Docker is not installed!${NC}"
    echo -e "${YELLOW}Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    log_message "❌ ERROR: Docker is not running"
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    echo -e "${YELLOW}Please start Docker daemon first.${NC}"
    exit 1
fi

log_message "✅ Docker is ready"
echo -e "${GREEN}✅ Docker is ready${NC}"
echo ""

# Pull Python image if not exists
if ! docker image inspect "$PYTHON_IMAGE" &> /dev/null; then
    echo -e "${YELLOW}📦 Pulling Python image (first time only)...${NC}"
    docker pull "$PYTHON_IMAGE"
    echo ""
fi

# Cleanup any existing container
docker rm -f "$CONTAINER_NAME" &> /dev/null || true

# Determine mode
if [ $# -eq 0 ]; then
    # No arguments - Interactive shell
    log_message "🚀 Starting interactive Python shell"
    echo -e "${BLUE}🚀 Starting interactive Python shell...${NC}"
    echo -e "${CYAN}Project directory mounted at: /workspace${NC}"
    echo -e "${CYAN}Type 'exit()' or Ctrl+D to quit${NC}"
    echo ""
    
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -v "$PROJECT_ROOT:/workspace" \
        -w /workspace \
        "$PYTHON_IMAGE" \
        python3

elif [ "$1" = "-i" ]; then
    # Explicit interactive mode
    log_message "🚀 Starting interactive Python shell (explicit)"
    echo -e "${BLUE}🚀 Starting interactive Python shell...${NC}"
    echo -e "${CYAN}Project directory mounted at: /workspace${NC}"
    echo -e "${CYAN}Type 'exit()' or Ctrl+D to quit${NC}"
    echo ""
    
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -v "$PROJECT_ROOT:/workspace" \
        -w /workspace \
        "$PYTHON_IMAGE" \
        python3

elif [ "$1" = "-c" ]; then
    # Execute code (explicit)
    if [ -z "$2" ]; then
        log_message "❌ ERROR: No code provided after -c flag"
        echo -e "${RED}❌ Error: No code provided after -c flag${NC}"
        exit 1
    fi
    
    log_message "🚀 Executing Python code: $2"
    echo -e "${BLUE}🚀 Executing Python code...${NC}"
    echo ""
    
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -v "$PROJECT_ROOT:/workspace" \
        -w /workspace \
        "$PYTHON_IMAGE" \
        python3 -c "$2"

elif [ -f "$PROJECT_ROOT/$1" ]; then
    # Run script file
    log_message "🚀 Running Python script: $1"
    echo -e "${BLUE}🚀 Running Python script: $1${NC}"
    echo ""
    
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -v "$PROJECT_ROOT:/workspace" \
        -w /workspace \
        "$PYTHON_IMAGE" \
        python3 "$1"

else
    # Execute as code string
    log_message "🚀 Executing Python code: $1"
    echo -e "${BLUE}🚀 Executing Python code...${NC}"
    echo ""
    
    docker run -it --rm \
        --name "$CONTAINER_NAME" \
        -v "$PROJECT_ROOT:/workspace" \
        -w /workspace \
        "$PYTHON_IMAGE" \
        python3 -c "$1"
fi

log_message "✅ Python execution completed"
echo ""
echo -e "${GREEN}✅ Python execution completed!${NC}"
echo ""
echo "📄 View logs: Check /app/logs/python.log"
echo ""
