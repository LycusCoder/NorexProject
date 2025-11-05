#!/bin/bash
################################################################################
# NOREX V3.6 - phpMyAdmin Service Manager
# Manages phpMyAdmin runtime (via Apache)
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"
PMA_BASE="$PROJECT_ROOT/bin/phpmyadmin/phpMyAdmin-5.2.1-all-languages"
PMA_CONFIG="$PMA_BASE/config.inc.php"
PMA_PORT="8081"
LOG_FILE="$PROJECT_ROOT/logs/service_phpmyadmin.log"

# MySQL connection (dynamic from services.yaml)
MYSQL_SOCK="$PROJECT_ROOT/bin/mysql/mysql.sock"

# Logging function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if phpMyAdmin exists
check_pma() {
    if [ ! -d "$PMA_BASE" ]; then
        echo -e "${RED}❌ phpMyAdmin not found: $PMA_BASE${NC}"
        echo -e "${YELLOW}💡 Run: bash scripts/verify_setup.sh${NC}"
        exit 1
    fi
}

# Configure phpMyAdmin
configure_pma() {
    if [ ! -f "$PMA_CONFIG" ]; then
        log_msg "⚙️  Creating phpMyAdmin configuration..."
        echo -e "${BLUE}⚙️  Creating phpMyAdmin configuration...${NC}"
        
        cat > "$PMA_CONFIG" <<EOF
<?php
/**
 * NOREX V3.6 - phpMyAdmin Configuration
 */

\$cfg['blowfish_secret'] = 'norex_phpmyadmin_secret_key_2025_random';

\$i = 0;
\$i++;
\$cfg['Servers'][\$i]['auth_type'] = 'cookie';
\$cfg['Servers'][\$i]['host'] = 'localhost';
\$cfg['Servers'][\$i]['port'] = '3306';
\$cfg['Servers'][\$i]['socket'] = '$MYSQL_SOCK';
\$cfg['Servers'][\$i]['compress'] = false;
\$cfg['Servers'][\$i]['AllowNoPassword'] = false;

\$cfg['UploadDir'] = '';
\$cfg['SaveDir'] = '';
\$cfg['TempDir'] = '/tmp';

\$cfg['DefaultLang'] = 'en';
\$cfg['ServerDefault'] = 1;
\$cfg['VersionCheck'] = false;

?>
EOF
        
        log_msg "✅ phpMyAdmin configuration created"
        echo -e "${GREEN}✅ phpMyAdmin configuration created${NC}"
    fi
}

# Start phpMyAdmin (via symlink to www)
start_pma() {
    log_msg "🚀 Starting phpMyAdmin service..."
    echo -e "${BLUE}🚀 Starting phpMyAdmin...${NC}"
    
    check_pma
    configure_pma
    
    # Check if Apache is running (dependency)
    if ! lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_msg "❌ Apache not running (required for phpMyAdmin)"
        echo -e "${RED}❌ Apache not running${NC}"
        echo -e "${YELLOW}💡 Start Apache first: bash scripts/services/service_apache.sh start${NC}"
        exit 1
    fi
    
    # Check if MySQL is running (dependency)
    if [ ! -S "$MYSQL_SOCK" ]; then
        log_msg "❌ MySQL not running (required for phpMyAdmin)"
        echo -e "${RED}❌ MySQL not running${NC}"
        echo -e "${YELLOW}💡 Start MySQL first: bash scripts/services/service_mysql.sh start${NC}"
        exit 1
    fi
    
    # Create symlink in www/ for Apache access
    if [ ! -L "$PROJECT_ROOT/www/phpmyadmin" ]; then
        ln -sf "$PMA_BASE" "$PROJECT_ROOT/www/phpmyadmin"
        log_msg "✅ phpMyAdmin symlink created"
    fi
    
    # phpMyAdmin is served via Apache, so just verify access
    if curl -s http://localhost:8080/phpmyadmin/ | grep -q "phpMyAdmin" 2>/dev/null; then
        log_msg "✅ phpMyAdmin accessible"
        echo -e "${GREEN}✅ phpMyAdmin running (Port: 8081 via Apache)${NC}"
        echo -e "${GREEN}   Access: http://localhost:8080/phpmyadmin${NC}"
    else
        log_msg "⚠️  phpMyAdmin configured but not yet accessible"
        echo -e "${YELLOW}⚠️  phpMyAdmin configured${NC}"
        echo -e "${YELLOW}   Wait for Apache to fully start${NC}"
    fi
}

# Stop phpMyAdmin
stop_pma() {
    log_msg "🛑 Stopping phpMyAdmin service..."
    echo -e "${YELLOW}🛑 Stopping phpMyAdmin...${NC}"
    
    # Remove symlink
    if [ -L "$PROJECT_ROOT/www/phpmyadmin" ]; then
        rm -f "$PROJECT_ROOT/www/phpmyadmin"
        log_msg "✅ phpMyAdmin symlink removed"
    fi
    
    echo -e "${GREEN}✅ phpMyAdmin stopped${NC}"
}

# Check phpMyAdmin status
status_pma() {
    if [ -L "$PROJECT_ROOT/www/phpmyadmin" ] && [ -S "$MYSQL_SOCK" ]; then
        if curl -s http://localhost:8080/phpmyadmin/ | grep -q "phpMyAdmin" 2>/dev/null; then
            echo -e "${GREEN}✅ phpMyAdmin is running${NC} (http://localhost:8080/phpmyadmin)"
            return 0
        else
            echo -e "${YELLOW}⚠️  phpMyAdmin configured but not accessible${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ phpMyAdmin is not running${NC}"
        return 1
    fi
}

# Restart phpMyAdmin
restart_pma() {
    log_msg "🔄 Restarting phpMyAdmin..."
    echo -e "${BLUE}🔄 Restarting phpMyAdmin...${NC}"
    stop_pma
    sleep 1
    start_pma
}

# Main command handler
case "${1:-status}" in
    start)
        start_pma
        ;;
    stop)
        stop_pma
        ;;
    restart)
        restart_pma
        ;;
    status)
        status_pma
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
