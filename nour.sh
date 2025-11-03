#!/bin/bash

################################################################################
# NourProject - Main CLI Tool
# Version: 3.0.0
# 
# Usage: bash nour.sh [command]
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
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GUI_DIR="$PROJECT_ROOT/gui"
SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Banner
show_banner() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════"
    echo "                   🚀 NourProject v3.0.0                       "
    echo "        Modern PHP Development Environment with GUI           "
    echo "═══════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Help menu
show_help() {
    show_banner
    echo -e "${BOLD}Usage:${NC} bash nour.sh [command]"
    echo ""
    echo -e "${BOLD}Quick Start Commands:${NC}"
    echo -e "  ${GREEN}setup${NC}              First-time setup (install dependencies)"
    echo -e "  ${GREEN}gui${NC}                Launch GUI Desktop Application"
    echo -e "  ${GREEN}start${NC}              Start all services (Docker)"
    echo -e "  ${GREEN}stop${NC}               Stop all services"
    echo -e "  ${GREEN}restart${NC}            Restart all services"
    echo ""
    echo -e "${BOLD}Service Management:${NC}"
    echo -e "  ${GREEN}status${NC}             Check service status"
    echo -e "  ${GREEN}logs${NC}               View service logs"
    echo -e "  ${GREEN}shell${NC}              Open bash shell in web container"
    echo ""
    echo -e "${BOLD}PHP Management:${NC}"
    echo -e "  ${GREEN}php [version]${NC}      Switch PHP version (8.1, 8.2, 8.3)"
    echo -e "  ${GREEN}php-info${NC}           Show current PHP version"
    echo ""
    echo -e "${BOLD}Database:${NC}"
    echo -e "  ${GREEN}db-backup${NC}          Backup MySQL database"
    echo -e "  ${GREEN}db-shell${NC}           Open MySQL shell"
    echo ""
    echo -e "${BOLD}Python CLI:${NC}"
    echo -e "  ${GREEN}python${NC}             Interactive Python shell (Docker)"
    echo -e "  ${GREEN}python [code]${NC}      Execute Python code"
    echo -e "  ${GREEN}python [file]${NC}      Run Python script file"
    echo ""
    echo -e "${BOLD}Utilities:${NC}"
    echo -e "  ${GREEN}verify${NC}             Verify installation & health check"
    echo -e "  ${GREEN}open${NC}               Open main site in browser"
    echo -e "  ${GREEN}pma${NC}                Open phpMyAdmin in browser"
    echo -e "  ${GREEN}reset${NC}              Reset environment (⚠️  destroys data)"
    echo -e "  ${GREEN}update${NC}             Update NourProject (git pull)"
    echo ""
    echo -e "${BOLD}Information:${NC}"
    echo -e "  ${GREEN}info${NC}               Show system information"
    echo -e "  ${GREEN}version${NC}            Show version information"
    echo -e "  ${GREEN}help${NC}               Show this help menu"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo -e "  ${CYAN}bash nour.sh setup${NC}              # First-time setup"
    echo -e "  ${CYAN}bash nour.sh gui${NC}                # Launch GUI"
    echo -e "  ${CYAN}bash nour.sh start${NC}              # Start services"
    echo -e "  ${CYAN}bash nour.sh python${NC}             # Python shell"
    echo -e "  ${CYAN}bash nour.sh php 8.3${NC}            # Switch to PHP 8.3"
    echo ""
    echo -e "${BOLD}Documentation:${NC} /app/docs/"
    echo -e "${BOLD}Quick Start:${NC}   /app/docs/guides/PHASE_3_QUICK_START.md"
    echo ""
}

# Check if Docker is running
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker is not installed!${NC}"
        echo -e "${YELLOW}Please install Docker first.${NC}"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        echo -e "${RED}✗ Docker is not running!${NC}"
        echo -e "${YELLOW}Please start Docker daemon first.${NC}"
        exit 1
    fi
}

# Commands
case "${1:-}" in
    # Quick Start
    setup)
        show_banner
        echo -e "${BLUE}🔧 Running first-time setup...${NC}"
        echo ""
        bash "$PROJECT_ROOT/scripts/setup.sh"
        ;;
    
    gui)
        show_banner
        echo -e "${BLUE}🖥️  Launching GUI Desktop Application...${NC}"
        echo ""
        cd "$GUI_DIR" && bash run.sh
        ;;
    
    start)
        show_banner
        echo -e "${BLUE}▶️  Starting all services...${NC}"
        echo ""
        check_docker
        bash "$SCRIPTS_DIR/start.sh"
        ;;
    
    stop)
        show_banner
        echo -e "${BLUE}⏹️  Stopping all services...${NC}"
        echo ""
        check_docker
        bash "$SCRIPTS_DIR/stop.sh"
        ;;
    
    restart)
        show_banner
        echo -e "${BLUE}🔄 Restarting all services...${NC}"
        echo ""
        check_docker
        bash "$SCRIPTS_DIR/stop.sh"
        sleep 2
        bash "$SCRIPTS_DIR/start.sh"
        ;;
    
    status)
        show_banner
        check_docker
        bash "$SCRIPTS_DIR/status.sh"
        ;;
    
    logs)
        show_banner
        check_docker
        bash "$SCRIPTS_DIR/logs.sh"
        ;;
    
    shell)
        show_banner
        echo -e "${BLUE}🐚 Opening bash shell in web container...${NC}"
        echo -e "${CYAN}Type 'exit' to return${NC}"
        echo ""
        check_docker
        docker exec -it nour_apache bash
        ;;
    
    # PHP Management
    php)
        if [ -z "$2" ]; then
            show_banner
            echo -e "${YELLOW}Usage: bash nour.sh php [version]${NC}"
            echo -e "Available versions: ${GREEN}8.1${NC}, ${GREEN}8.2${NC}, ${GREEN}8.3${NC}"
            exit 1
        fi
        show_banner
        echo -e "${BLUE}🔧 Switching to PHP $2...${NC}"
        echo ""
        check_docker
        bash "$SCRIPTS_DIR/switch-php.sh" "$2"
        ;;
    
    php-info)
        show_banner
        check_docker
        echo -e "${BLUE}📋 Current PHP Version:${NC}"
        docker exec nour_apache php -v 2>/dev/null || echo -e "${RED}✗ Services not running${NC}"
        ;;
    
    # Database
    db-backup)
        show_banner
        echo -e "${BLUE}💾 Backing up database...${NC}"
        echo ""
        check_docker
        bash "$SCRIPTS_DIR/backup-db.sh"
        ;;
    
    db-shell)
        show_banner
        echo -e "${BLUE}🗄️  Opening MySQL shell...${NC}"
        echo -e "${CYAN}Password: 041201${NC}"
        echo -e "${CYAN}Type 'exit' to return${NC}"
        echo ""
        check_docker
        docker exec -it nour_mysql mysql -uroot -p041201 nour_db
        ;;
    
    # Python CLI
    python)
        show_banner
        if [ -z "$2" ]; then
            echo -e "${BLUE}🐍 Starting interactive Python shell...${NC}"
            echo ""
            bash "$SCRIPTS_DIR/python.sh"
        elif [ -f "$PROJECT_ROOT/$2" ]; then
            echo -e "${BLUE}🐍 Running Python script: $2${NC}"
            echo ""
            bash "$SCRIPTS_DIR/python.sh" "$2"
        else
            echo -e "${BLUE}🐍 Executing Python code...${NC}"
            echo ""
            bash "$SCRIPTS_DIR/python.sh" "$2"
        fi
        ;;
    
    # Utilities
    verify)
        show_banner
        bash "$PROJECT_ROOT/scripts/verify.sh"
        ;;
    
    open)
        show_banner
        echo -e "${BLUE}🌍 Opening main site in browser...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8080
        elif command -v open &> /dev/null; then
            open http://localhost:8080
        else
            echo -e "${YELLOW}Please open: ${GREEN}http://localhost:8080${NC}"
        fi
        ;;
    
    pma)
        show_banner
        echo -e "${BLUE}🗄️  Opening phpMyAdmin in browser...${NC}"
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8081
        elif command -v open &> /dev/null; then
            open http://localhost:8081
        else
            echo -e "${YELLOW}Please open: ${GREEN}http://localhost:8081${NC}"
        fi
        ;;
    
    reset)
        show_banner
        echo -e "${RED}⚠️  WARNING: This will destroy all data!${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${BLUE}🔄 Resetting environment...${NC}"
            echo ""
            check_docker
            bash "$SCRIPTS_DIR/reset.sh"
        else
            echo -e "${GREEN}✓ Reset cancelled${NC}"
        fi
        ;;
    
    update)
        show_banner
        echo -e "${BLUE}🔄 Updating NourProject...${NC}"
        echo ""
        if [ -d "$PROJECT_ROOT/.git" ]; then
            cd "$PROJECT_ROOT"
            git pull
            echo -e "${GREEN}✓ Update complete!${NC}"
        else
            echo -e "${RED}✗ Not a git repository${NC}"
        fi
        ;;
    
    # Information
    info)
        show_banner
        echo -e "${BOLD}System Information:${NC}"
        echo ""
        echo -e "${CYAN}Project Root:${NC} $PROJECT_ROOT"
        echo -e "${CYAN}Version:${NC} 3.0.0 (Phase 3 Complete)"
        echo ""
        echo -e "${CYAN}Docker Status:${NC}"
        if docker info &> /dev/null; then
            echo -e "  ${GREEN}✓${NC} Running"
            docker --version
        else
            echo -e "  ${RED}✗${NC} Not running"
        fi
        echo ""
        echo -e "${CYAN}Services:${NC}"
        if docker ps --format "{{.Names}}" | grep -q "nour_"; then
            docker ps --filter "name=nour_" --format "  ${GREEN}✓${NC} {{.Names}} ({{.Status}})"
        else
            echo -e "  ${YELLOW}No services running${NC}"
        fi
        echo ""
        echo -e "${CYAN}Access URLs:${NC}"
        echo -e "  Main Site:    ${GREEN}http://localhost:8080${NC}"
        echo -e "  phpMyAdmin:   ${GREEN}http://localhost:8081${NC}"
        echo -e "  MySQL:        ${GREEN}localhost:3306${NC}"
        echo ""
        ;;
    
    version)
        show_banner
        echo -e "${BOLD}NourProject v3.0.0${NC}"
        echo -e "Phase 3: Refinement Complete"
        echo ""
        echo -e "Features:"
        echo -e "  • Native Desktop GUI (PySide6)"
        echo -e "  • Context Menu & Modern UI"
        echo -e "  • Docker-based PHP Stack"
        echo -e "  • Python CLI Integration"
        echo -e "  • Multi-PHP Support (8.1, 8.2, 8.3)"
        echo -e "  • System Tray Support"
        echo ""
        ;;
    
    help|--help|-h|"")
        show_help
        ;;
    
    *)
        show_banner
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        echo -e "Run ${GREEN}bash nour.sh help${NC} to see available commands"
        exit 1
        ;;
esac
