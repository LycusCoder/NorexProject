#!/bin/bash
################################################################################
# NOREX V3.6 - Apache Service Manager
# Manages Apache HTTP Server binary runtime (non-Docker)
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
APACHE_BASE="$PROJECT_ROOT/bin/apache/httpd-2.4.62"
APACHE_BIN="$APACHE_BASE/bin/httpd"
APACHE_CTL="$APACHE_BASE/bin/apachectl"
APACHE_CONF="$APACHE_BASE/conf/httpd.conf"
APACHE_PID="$PROJECT_ROOT/bin/.pids/apache.pid"
APACHE_PORT="8080"
LOG_FILE="$PROJECT_ROOT/logs/service_apache.log"

# Create directories
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$PROJECT_ROOT/bin/.pids"

# Logging function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if Apache binary exists
check_binary() {
    if [ ! -f "$APACHE_BIN" ]; then
        echo -e "${RED}❌ Apache binary not found: $APACHE_BIN${NC}"
        echo -e "${YELLOW}💡 Run: bash scripts/verify_setup.sh${NC}"
        exit 1
    fi
}

# Configure Apache (first time)
configure_apache() {
    if [ ! -f "$APACHE_CONF" ]; then
        log_msg "⚙️  Creating Apache configuration..."
        echo -e "${BLUE}⚙️  Creating Apache configuration...${NC}"
        
        # Ensure mime.types exists
        MIME_TYPES_PATH="$APACHE_BASE/conf/mime.types"
        if [ ! -f "$MIME_TYPES_PATH" ]; then
            log_msg "📝 Creating fallback mime.types..."
            mkdir -p "$APACHE_BASE/conf"
            
            # Create minimal mime.types
            cat > "$MIME_TYPES_PATH" <<'MIMEEOF'
# Minimal MIME types for NOREX V3.6
text/html                             html htm
text/css                              css
text/javascript                       js
text/plain                            txt
text/xml                              xml
application/json                      json
application/javascript                js
application/xml                       xml
application/pdf                       pdf
application/zip                       zip
image/jpeg                            jpeg jpg
image/png                             png
image/gif                             gif
image/svg+xml                         svg
image/webp                            webp
image/x-icon                          ico
MIMEEOF
            log_msg "✅ Fallback mime.types created"
        fi
        
        # Create minimal httpd.conf
        cat > "$APACHE_CONF" <<EOF
# NOREX V3.6 - Apache Configuration
ServerRoot "$APACHE_BASE"
Listen $APACHE_PORT

LoadModule mpm_event_module modules/mod_mpm_event.so
LoadModule authz_core_module modules/mod_authz_core.so
LoadModule dir_module modules/mod_dir.so
LoadModule mime_module modules/mod_mime.so
LoadModule log_config_module modules/mod_log_config.so
LoadModule unixd_module modules/mod_unixd.so

ServerName localhost:$APACHE_PORT
DocumentRoot "$PROJECT_ROOT/www"

<Directory "$PROJECT_ROOT/www">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

DirectoryIndex index.html index.php

ErrorLog "$PROJECT_ROOT/logs/apache_error.log"
CustomLog "$PROJECT_ROOT/logs/apache_access.log" combined

PidFile "$APACHE_PID"

TypesConfig conf/mime.types
EOF
        
        log_msg "✅ Apache configuration created"
        echo -e "${GREEN}✅ Apache configuration created${NC}"
    fi
}

# Start Apache
start_apache() {
    log_msg "🚀 Starting Apache service..."
    echo -e "${BLUE}🚀 Starting Apache...${NC}"
    
    check_binary
    configure_apache
    
    # Check if already running
    if [ -f "$APACHE_PID" ] && kill -0 $(cat "$APACHE_PID") 2>/dev/null; then
        log_msg "⚠️  Apache already running (PID: $(cat "$APACHE_PID"))"
        echo -e "${YELLOW}⚠️  Apache already running${NC}"
        return 0
    fi
    
    # Check port availability
    if lsof -Pi :$APACHE_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_msg "❌ Port $APACHE_PORT already in use"
        echo -e "${RED}❌ Port $APACHE_PORT already in use${NC}"
        exit 1
    fi
    
    # Start Apache
    if [ -f "$APACHE_CTL" ]; then
        "$APACHE_CTL" -f "$APACHE_CONF" -k start 2>&1 | tee -a "$LOG_FILE"
    else
        "$APACHE_BIN" -f "$APACHE_CONF" -k start 2>&1 | tee -a "$LOG_FILE"
    fi
    
    sleep 2
    
    if [ -f "$APACHE_PID" ] && kill -0 $(cat "$APACHE_PID") 2>/dev/null; then
        log_msg "✅ Apache started successfully (PID: $(cat "$APACHE_PID"))"
        echo -e "${GREEN}✅ Apache started (Port: $APACHE_PORT)${NC}"
    else
        log_msg "❌ Apache failed to start"
        echo -e "${RED}❌ Apache failed to start${NC}"
        echo -e "${YELLOW}📄 Check logs: $LOG_FILE${NC}"
        exit 1
    fi
}

# Stop Apache
stop_apache() {
    log_msg "🛑 Stopping Apache service..."
    echo -e "${YELLOW}🛑 Stopping Apache...${NC}"
    
    if [ -f "$APACHE_PID" ] && kill -0 $(cat "$APACHE_PID") 2>/dev/null; then
        PID=$(cat "$APACHE_PID")
        
        # Graceful shutdown
        if [ -f "$APACHE_CTL" ]; then
            "$APACHE_CTL" -f "$APACHE_CONF" -k graceful-stop 2>&1 | tee -a "$LOG_FILE"
        else
            kill -TERM "$PID"
        fi
        
        # Wait for shutdown
        for i in {1..10}; do
            if ! kill -0 "$PID" 2>/dev/null; then
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if kill -0 "$PID" 2>/dev/null; then
            log_msg "⚠️  Force killing Apache"
            kill -9 "$PID" 2>/dev/null || true
        fi
        
        rm -f "$APACHE_PID"
        log_msg "✅ Apache stopped"
        echo -e "${GREEN}✅ Apache stopped${NC}"
    else
        log_msg "⚠️  Apache not running"
        echo -e "${YELLOW}⚠️  Apache not running${NC}"
    fi
}

# Reload Apache (graceful restart)
reload_apache() {
    log_msg "🔄 Reloading Apache configuration..."
    echo -e "${BLUE}🔄 Reloading Apache...${NC}"
    
    if [ -f "$APACHE_PID" ] && kill -0 $(cat "$APACHE_PID") 2>/dev/null; then
        if [ -f "$APACHE_CTL" ]; then
            "$APACHE_CTL" -f "$APACHE_CONF" -k graceful 2>&1 | tee -a "$LOG_FILE"
        else
            kill -USR1 $(cat "$APACHE_PID")
        fi
        
        log_msg "✅ Apache reloaded"
        echo -e "${GREEN}✅ Apache reloaded${NC}"
    else
        log_msg "❌ Apache not running"
        echo -e "${RED}❌ Apache not running${NC}"
        exit 1
    fi
}

# Check Apache status
status_apache() {
    if [ -f "$APACHE_PID" ] && kill -0 $(cat "$APACHE_PID") 2>/dev/null; then
        PID=$(cat "$APACHE_PID")
        echo -e "${GREEN}✅ Apache is running${NC} (PID: $PID, Port: $APACHE_PORT)"
        return 0
    else
        echo -e "${RED}❌ Apache is not running${NC}"
        return 1
    fi
}

# Restart Apache
restart_apache() {
    log_msg "🔄 Restarting Apache..."
    echo -e "${BLUE}🔄 Restarting Apache...${NC}"
    stop_apache
    sleep 2
    start_apache
}

# Main command handler
case "${1:-status}" in
    start)
        start_apache
        ;;
    stop)
        stop_apache
        ;;
    restart)
        restart_apache
        ;;
    reload)
        reload_apache
        ;;
    status)
        status_apache
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|reload|status}"
        exit 1
        ;;
esac
