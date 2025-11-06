# NorexProject - PHP 8.2 with All Essential Extensions
# Lebih lengkap dari Laragon & XAMPP!

FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    unzip \
    git \
    vim \
    nano \
    curl \
    wget \
    jq \
    bc \
    && rm -rf /var/lib/apt/lists/*

# Install yq (YAML processor) for downloads.yaml management
RUN wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 \
    && chmod +x /usr/local/bin/yq

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    mysqli \
    pdo \
    pdo_mysql \
    gd \
    zip \
    intl \
    opcache \
    bcmath \
    exif \
    pcntl \
    soap \
    mbstring \
    && docker-php-ext-enable \
    mysqli \
    pdo_mysql \
    opcache

# Enable Apache modules
RUN a2enmod rewrite headers

# Set working directory
WORKDIR /var/www/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1