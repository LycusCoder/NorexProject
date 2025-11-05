#!/bin/bash
################################################################################
# NOREX V3.6 - MySQL Service Manager
# Manages MySQL binary runtime (non-Docker)
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
MYSQL_BASE="$PROJECT_ROOT/bin/mysql/mysql-8.4.3-linux-glibc2.28-x86_64"
MYSQL_BIN="$MYSQL_BASE/bin/mysqld"
MYSQL_DATA="$MYSQL_BASE/data"
MYSQL_PID="$PROJECT_ROOT/bin/.pids/mysql.pid"
MYSQL_SOCK="$PROJECT_ROOT/bin/mysql/mysql.sock"
MYSQL_PORT="3306"
LOG_FILE="$PROJECT_ROOT/logs/service_mysql.log"

# Create directories
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$PROJECT_ROOT/bin/.pids"
mkdir -p "$(dirname "$MYSQL_SOCK")"

# Logging function
log_msg() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check if MySQL binary exists
check_binary() {
    if [ ! -f "$MYSQL_BIN" ]; then
        echo -e "${RED}❌ MySQL binary not found: $MYSQL_BIN${NC}"
        echo -e "${YELLOW}💡 Run: bash scripts/verify_setup.sh${NC}"
        exit 1
    fi
}

# Initialize MySQL data directory (first time)
init_data_dir() {
    if [ ! -d "$MYSQL_DATA" ]; then
        log_msg "📦 Initializing MySQL data directory..."
        echo -e "${BLUE}📦 Initializing MySQL data directory...${NC}"
        
        mkdir -p "$MYSQL_DATA"
        
        # Initialize with mysqld --initialize-insecure (no password first time)
        "$MYSQL_BIN" --initialize-insecure \
            --datadir="$MYSQL_DATA" \
            --basedir="$MYSQL_BASE" \
            --user="$USER" 2>&1 | tee -a "$LOG_FILE"
        
        if [ $? -eq 0 ]; then
            log_msg "✅ MySQL data directory initialized"
            echo -e "${GREEN}✅ MySQL data directory initialized${NC}"
        else
            log_msg "❌ Failed to initialize MySQL data directory"
            echo -e "${RED}❌ Failed to initialize MySQL${NC}"
            exit 1
        fi
    fi
}

# Start MySQL
start_mysql() {
    log_msg "🚀 Starting MySQL service..."
    echo -e "${BLUE}🚀 Starting MySQL...${NC}"
    
    check_binary
    init_data_dir
    
    # Check if already running
    if [ -f "$MYSQL_PID" ] && kill -0 $(cat "$MYSQL_PID") 2>/dev/null; then
        log_msg "⚠️  MySQL already running (PID: $(cat "$MYSQL_PID"))"
        echo -e "${YELLOW}⚠️  MySQL already running${NC}"
        return 0
    fi
    
    # Check port availability
    if lsof -Pi :$MYSQL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_msg "❌ Port $MYSQL_PORT already in use"
        echo -e "${RED}❌ Port $MYSQL_PORT already in use${NC}"
        exit 1
    fi
    
    # Start MySQL in background
    "$MYSQL_BIN" \
        --datadir="$MYSQL_DATA" \
        --basedir="$MYSQL_BASE" \
        --port="$MYSQL_PORT" \
        --socket="$MYSQL_SOCK" \
        --pid-file="$MYSQL_PID" \
        --user="$USER" \
        --log-error="$PROJECT_ROOT/logs/mysql_error.log" \
        --daemonize 2>&1 | tee -a "$LOG_FILE"
    
    # Wait for MySQL to be ready
    sleep 3
    
    if [ -f "$MYSQL_PID" ] && kill -0 $(cat "$MYSQL_PID") 2>/dev/null; then
        log_msg "✅ MySQL started successfully (PID: $(cat "$MYSQL_PID"))"
        echo -e "${GREEN}✅ MySQL started (Port: $MYSQL_PORT)${NC}"
        
        # Set root password if first time
        set_root_password
    else
        log_msg "❌ MySQL failed to start"
        echo -e "${RED}❌ MySQL failed to start${NC}"
        echo -e "${YELLOW}📄 Check logs: $LOG_FILE${NC}"
        exit 1
    fi
}

# Set root password (first time setup)
set_root_password() {
    log_msg "🔑 Setting root password..."
    
    # Wait for MySQL to accept connections
    sleep 2
    
    "$MYSQL_BASE/bin/mysql" \
        --socket="$MYSQL_SOCK" \
        --user=root \
        -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '041201'; FLUSH PRIVILEGES;" \
        2>/dev/null || true
    
    log_msg "✅ Root password configured"
}

# Stop MySQL
stop_mysql() {
    log_msg "🛑 Stopping MySQL service..."
    echo -e "${YELLOW}🛑 Stopping MySQL...${NC}"
    
    if [ -f "$MYSQL_PID" ] && kill -0 $(cat "$MYSQL_PID") 2>/dev/null; then
        PID=$(cat "$MYSQL_PID")
        
        # Graceful shutdown
        "$MYSQL_BASE/bin/mysqladmin" \
            --socket="$MYSQL_SOCK" \
            --user=root \
            --password=041201 \
            shutdown 2>/dev/null || kill -TERM "$PID"
        
        # Wait for shutdown
        for i in {1..10}; do
            if ! kill -0 "$PID" 2>/dev/null; then
                break
            fi
            sleep 1
        done
        
        # Force kill if still running
        if kill -0 "$PID" 2>/dev/null; then
            log_msg "⚠️  Force killing MySQL"
            kill -9 "$PID" 2>/dev/null || true
        fi
        
        rm -f "$MYSQL_PID"
        log_msg "✅ MySQL stopped"
        echo -e "${GREEN}✅ MySQL stopped${NC}"
    else
        log_msg "⚠️  MySQL not running"
        echo -e "${YELLOW}⚠️  MySQL not running${NC}"
    fi
}

# Check MySQL status
status_mysql() {
    if [ -f "$MYSQL_PID" ] && kill -0 $(cat "$MYSQL_PID") 2>/dev/null; then
        PID=$(cat "$MYSQL_PID")
        echo -e "${GREEN}✅ MySQL is running${NC} (PID: $PID, Port: $MYSQL_PORT)"
        return 0
    else
        echo -e "${RED}❌ MySQL is not running${NC}"
        return 1
    fi
}

# Restart MySQL
restart_mysql() {
    log_msg "🔄 Restarting MySQL..."
    echo -e "${BLUE}🔄 Restarting MySQL...${NC}"
    stop_mysql
    sleep 2
    start_mysql
}

# Main command handler
case "${1:-status}" in
    start)
        start_mysql
        ;;
    stop)
        stop_mysql
        ;;
    restart)
        restart_mysql
        ;;
    status)
        status_mysql
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
