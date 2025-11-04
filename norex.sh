#!/bin/bash
# NorexProject - Main CLI Tool
# Usage: bash norex.sh [command]

set -e

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

COMMAND="${1:-help}"

# Banner
show_banner() {
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════╗"
    echo "║    NorexProject - Control Panel      ║"
    echo "║   Docker-based Development Stack      ║"
    echo "╚═══════════════════════════════════════╝"
    echo -e "${NC}"
}

# Help menu
show_help() {
    show_banner
    echo -e "${BLUE}Available Commands:${NC}"
    echo ""
    echo -e "  ${GREEN}setup${NC}         - Initial setup (first time only)"
    echo -e "  ${GREEN}gui${NC}           - Launch Tauri Desktop GUI"
    echo -e "  ${GREEN}start${NC}         - Start all services (Apache, MySQL, phpMyAdmin)"
    echo -e "  ${GREEN}stop${NC}          - Stop all services"
    echo -e "  ${GREEN}restart${NC}       - Restart all services"
    echo -e "  ${GREEN}status${NC}        - Check services status"
    echo -e "  ${GREEN}verify${NC}        - Verify system requirements & health check"
    echo -e "  ${GREEN}logs${NC}          - View service logs"
    echo -e "  ${GREEN}web${NC}           - Open web browser (localhost:8080)"
    echo -e "  ${GREEN}db${NC}            - Open phpMyAdmin (localhost:8081)"
    echo -e "  ${GREEN}backup${NC}        - Backup database"
    echo -e "  ${GREEN}reset${NC}         - Reset/clean all services"
    echo -e "  ${GREEN}python${NC}        - Access Python CLI"
    echo -e "  ${GREEN}check${NC}         - Check system requirements"
    echo -e "  ${GREEN}help${NC}          - Show this help menu"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  bash norex.sh setup      # First time setup"
    echo -e "  bash norex.sh verify     # Health check"
    echo -e "  bash norex.sh gui        # Launch GUI"
    echo -e "  bash norex.sh start      # Start services"
    echo -e "  bash norex.sh status     # Check status"
    echo ""
}

# Execute command
case "$COMMAND" in
    setup)
        echo -e "${BLUE}🔧 Running initial setup...${NC}"
        if [ -f "scripts/setup.sh" ]; then
            bash scripts/setup.sh
        else
            echo -e "${RED}❌ Error: scripts/setup.sh not found${NC}"
            exit 1
        fi
        ;;
    
    gui)
        echo -e "${BLUE}🚀 Launching Tauri Desktop GUI...${NC}"
        if [ -f "gui/run.sh" ]; then
            bash gui/run.sh
        else
            echo -e "${RED}❌ Error: gui/run.sh not found${NC}"
            exit 1
        fi
        ;;
    
    start)
        echo -e "${GREEN}▶️  Starting all services...${NC}"
        bash scripts/start.sh
        ;;
    
    stop)
        echo -e "${RED}⏹️  Stopping all services...${NC}"
        bash scripts/stop.sh
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Restarting all services...${NC}"
        bash scripts/stop.sh
        sleep 2
        bash scripts/start.sh
        ;;
    
    status)
        echo -e "${BLUE}📊 Checking services status...${NC}"
        bash scripts/status.sh
        ;;
    
    verify)
        echo -e "${CYAN}🔍 Running verification & health check...${NC}"
        bash scripts/verify.sh
        ;;
    
    logs)
        echo -e "${BLUE}📜 Viewing service logs...${NC}"
        bash scripts/logs.sh
        ;;
    
    web)
        echo -e "${CYAN}🌐 Opening web browser...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8080
        elif command -v open &> /dev/null; then
            open http://localhost:8080
        else
            echo -e "${YELLOW}⚠️  Please open http://localhost:8080 manually${NC}"
        fi
        ;;
    
    db)
        echo -e "${CYAN}🗄️  Opening phpMyAdmin...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8081
        elif command -v open &> /dev/null; then
            open http://localhost:8081
        else
            echo -e "${YELLOW}⚠️  Please open http://localhost:8081 manually${NC}"
        fi
        ;;
    
    backup)
        echo -e "${BLUE}💾 Backing up database...${NC}"
        bash scripts/backup-db.sh
        ;;
    
    reset)
        echo -e "${YELLOW}🔄 Resetting services...${NC}"
        bash scripts/reset.sh
        ;;
    
    python)
        echo -e "${BLUE}🐍 Launching Python CLI...${NC}"
        bash scripts/python.sh
        ;;
    
    check)
        echo -e "${BLUE}🔍 Checking system requirements...${NC}"
        bash scripts/check-system.sh
        ;;
    
    help|--help|-h)
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Unknown command: $COMMAND${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
