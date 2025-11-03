#!/bin/bash
# NourProject - PHP Version Switcher (Laragon Style)
# Usage: bash scripts/switch-php.sh [version]

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🔄 NourProject - PHP Version Switcher"
echo "═══════════════════════════════════════════════════════════"
echo ""

VERSION="$1"

if [ -z "$VERSION" ]; then
    echo "📌 Available PHP versions:"
    echo "  • 8.1"
    echo "  • 8.2 (current)"
    echo "  • 8.3"
    echo ""
    echo "Usage: bash scripts/switch-php.sh [version]"
    echo "Example: bash scripts/switch-php.sh 8.3"
    echo ""
    exit 0
fi

# Validate version
if [[ ! "$VERSION" =~ ^8\.[1-3]$ ]]; then
    echo "❌ Invalid version: $VERSION"
    echo "Available versions: 8.1, 8.2, 8.3"
    exit 1
fi

echo "🔧 Switching to PHP $VERSION..."
echo ""

# Update Dockerfile
cat > Dockerfile << EOF
# NourProject - PHP $VERSION with All Essential Extensions

FROM php:$VERSION-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    libfreetype6-dev \\
    libjpeg62-turbo-dev \\
    libpng-dev \\
    libzip-dev \\
    libicu-dev \\
    libonig-dev \\
    libxml2-dev \\
    libcurl4-openssl-dev \\
    unzip \\
    git \\
    vim \\
    nano \\
    curl \\
    wget \\
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \\
    && docker-php-ext-install -j\$(nproc) \\
    mysqli \\
    pdo \\
    pdo_mysql \\
    gd \\
    zip \\
    intl \\
    opcache \\
    bcmath \\
    exif \\
    pcntl \\
    soap \\
    mbstring \\
    && docker-php-ext-enable \\
    mysqli \\
    pdo_mysql \\
    opcache

# Enable Apache modules
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
    CMD curl -f http://localhost/ || exit 1
EOF

echo "✅ Dockerfile updated to PHP $VERSION"
echo ""
echo "🔄 Rebuilding containers..."

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d

echo ""
echo "⏳ Waiting for services..."
sleep 5

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ Successfully switched to PHP $VERSION!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🔍 Verify: http://localhost:8080/db_test.php"
echo ""