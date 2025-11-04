#!/bin/bash
# NorexProject - Smart Start Script with Build Optimization
# Only builds Docker images when necessary

set -e

# Setup logging
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/start.log"

# Create logs directory if not exists
mkdir -p "$LOG_DIR"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Clear old log and start new session
echo "═══════════════════════════════════════════════════════════" > "$LOG_FILE"
log_message "🚀 START SCRIPT - Session started"
log_message "═══════════════════════════════════════════════════════════"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🚀 NorexProject - Starting Services"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_message "❌ ERROR: Docker is not running"
    echo "❌ Docker is not running. Please start Docker first."
    echo ""
    echo "💡 Solutions:"
    echo "  • Linux: sudo systemctl start docker"
    echo "  • macOS: Open Docker Desktop"
    echo "  • Windows: Open Docker Desktop"
    exit 1
fi

log_message "✅ Docker is running"
echo "✅ Docker is running"
echo ""

# Function to check if Docker image exists
check_image_exists() {
    local image_name="$1"
    if docker images --format "{{.Repository}}" | grep -q "^${image_name}$"; then
        return 0  # Image exists
    else
        return 1  # Image doesn't exist
    fi
}

# Function to check if Dockerfile has changed since last build
check_dockerfile_changed() {
    local image_name="$1"
    local dockerfile_path="$2"
    
    if [ ! -f "$dockerfile_path" ]; then
        return 0  # Dockerfile doesn't exist, need to build
    fi
    
    # Get image creation time
    local image_created=$(docker images --format "{{.CreatedAt}}" "$image_name" 2>/dev/null | head -n 1)
    
    if [ -z "$image_created" ]; then
        return 0  # Image doesn't exist, need to build
    fi
    
    # Get Dockerfile modification time
    local dockerfile_mtime=$(stat -c %Y "$dockerfile_path" 2>/dev/null || stat -f %m "$dockerfile_path" 2>/dev/null)
    local image_created_epoch=$(date -d "$image_created" +%s 2>/dev/null || date -j -f "%Y-%m-%d %H:%M:%S" "$image_created" +%s 2>/dev/null)
    
    if [ -z "$dockerfile_mtime" ] || [ -z "$image_created_epoch" ]; then
        return 0  # Can't determine, build to be safe
    fi
    
    if [ "$dockerfile_mtime" -gt "$image_created_epoch" ]; then
        return 0  # Dockerfile changed, need to rebuild
    else
        return 1  # Dockerfile not changed, skip build
    fi
}

# Check if custom PHP image exists
NEED_BUILD=false

log_message "🔍 Checking Docker images..."
echo "🔍 Checking Docker images..."

if check_image_exists "norexproject-web"; then
    log_message "  ✅ Custom PHP image found: norexproject-web"
    echo "  ✅ Custom PHP image found: norexproject-web"
    
    # Check if Dockerfile has changed
    if check_dockerfile_changed "norexproject-web" "./Dockerfile"; then
        log_message "  ⚠️  Dockerfile has changed, rebuild required"
        echo "  ⚠️  Dockerfile has changed, rebuild required"
        NEED_BUILD=true
    else
        log_message "  ✅ Dockerfile unchanged, using existing image"
        echo "  ✅ Dockerfile unchanged, using existing image"
    fi
else
    log_message "  ⚠️  Custom PHP image not found, build required"
    echo "  ⚠️  Custom PHP image not found, build required"
    NEED_BUILD=true
fi

# Check base images (MySQL, phpMyAdmin)
if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^mysql:8.0$"; then
    log_message "  ✅ MySQL 8.0 image found"
    echo "  ✅ MySQL 8.0 image found"
else
    log_message "  ⚠️  MySQL 8.0 image not found, will be downloaded"
    echo "  ⚠️  MySQL 8.0 image not found, will be downloaded"
    NEED_BUILD=true
fi

if docker images --format "{{.Repository}}" | grep -q "^phpmyadmin/phpmyadmin$"; then
    log_message "  ✅ phpMyAdmin image found"
    echo "  ✅ phpMyAdmin image found"
else
    log_message "  ⚠️  phpMyAdmin image not found, will be downloaded"
    echo "  ⚠️  phpMyAdmin image not found, will be downloaded"
    NEED_BUILD=true
fi

echo ""

# Build or skip based on checks
if [ "$NEED_BUILD" = true ]; then
    log_message "🔧 Building/Pulling Docker images..."
    echo "🔧 Building/Pulling Docker images..."
    echo "   (First time or after changes may take a while)"
    echo ""
    
    # Build custom image without cache if Dockerfile changed
    if ! check_image_exists "norexproject-web" || check_dockerfile_changed "norexproject-web" "./Dockerfile"; then
        log_message "📦 Building custom PHP image..."
        echo "📦 Building custom PHP image..."
        docker compose build --no-cache web 2>&1 | tee -a "$LOG_FILE"
    fi
    
    # Pull base images
    log_message "📥 Pulling base images if needed..."
    echo "📥 Pulling base images if needed..."
    docker compose pull db pma 2>&1 | tee -a "$LOG_FILE"
    
    echo ""
    log_message "✅ Docker images ready!"
    echo "✅ Docker images ready!"
else
    log_message "⚡ All Docker images up-to-date, skipping build"
    echo "⚡ All Docker images up-to-date, skipping build"
fi

echo ""
log_message "🚀 Starting containers..."
echo "🚀 Starting containers..."
docker compose up -d 2>&1 | tee -a "$LOG_FILE"

echo ""
log_message "⏳ Waiting for services to be ready..."
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check container status
echo ""
log_message "📦 Container Status:"
echo "📦 Container Status:"
docker compose ps 2>&1 | tee -a "$LOG_FILE"

log_message "═══════════════════════════════════════════════════════════"
log_message "✅ NorexProject Services Started!"
log_message "Main Site: http://localhost:8080"
log_message "phpMyAdmin: http://localhost:8081"
log_message "═══════════════════════════════════════════════════════════"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ NorexProject Services Started!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🌐 Access Points:"
echo "  • Main Site:     http://localhost:8080"
echo "  • Database Test: http://localhost:8080/db_test.php"
echo "  • phpMyAdmin:    http://localhost:8081"
echo ""
echo "🔑 phpMyAdmin Login:"
echo "  • Username: root"
echo "  • Password: 041201"
echo ""
echo "📊 Check status:  bash norex.sh status"
echo "🔍 Health check:  bash norex.sh verify"
echo "🛑 Stop services: bash norex.sh stop"
echo ""
echo "📄 View logs: Check /app/logs/start.log"
echo ""
