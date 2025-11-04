#!/bin/bash

# NorexProject - Tauri Build Script untuk Production

set -e

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏗️  Building Tauri Application untuk Production...${NC}"
echo ""

cd "$(dirname "$0")"

# Function untuk menanyakan konfirmasi
ask_confirmation() {
    local prompt="$1"
    while true; do
        read -p "$(echo -e ${YELLOW}$prompt${NC}) [y/n]: " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Mohon jawab y (yes) atau n (no).";;
        esac
    done
}

# Cek dependencies
echo -e "${BLUE}📦 Mengecek dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Installing frontend dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""

# Build
echo -e "${BLUE}🔨 Starting production build...${NC}"
echo -e "${YELLOW}ℹ️  Ini bisa memakan waktu beberapa menit...${NC}"
echo ""

npm run tauri:build

echo ""
echo -e "${GREEN}✅ Build selesai!${NC}"
echo -e "${BLUE}📦 Hasil build ada di: src-tauri/target/release/bundle/${NC}"
echo ""
