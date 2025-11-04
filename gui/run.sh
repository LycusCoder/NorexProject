#!/bin/bash

# NorexProject - Tauri Launcher Script dengan Auto-Dependency Check

set -e  # Exit on error

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Meluncurkan GUI Desktop Tauri...${NC}"
echo ""

# Pindah ke directory Tauri
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

# ====================================
# 1. CEK FRONTEND DEPENDENCIES (Node.js)
# ====================================
echo -e "${BLUE}📦 Mengecek frontend dependencies...${NC}"

NEED_NPM_INSTALL=false

# Cek apakah node_modules ada
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Folder node_modules tidak ditemukan${NC}"
    NEED_NPM_INSTALL=true
fi

# Cek apakah package.json lebih baru dari node_modules
if [ -f "package.json" ] && [ -d "node_modules" ]; then
    if [ "package.json" -nt "node_modules" ]; then
        echo -e "${YELLOW}⚠️  package.json lebih baru dari node_modules${NC}"
        NEED_NPM_INSTALL=true
    fi
fi

# Cek apakah ada package yang belum terinstall
if [ -d "node_modules" ]; then
    MISSING_PACKAGES=$(npm ls 2>&1 | grep -c "UNMET DEPENDENCY" || true)
    if [ "$MISSING_PACKAGES" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Ada $MISSING_PACKAGES dependencies yang belum terinstall${NC}"
        NEED_NPM_INSTALL=true
    fi
fi

# Tanyakan untuk install jika diperlukan
if [ "$NEED_NPM_INSTALL" = true ]; then
    echo -e "${YELLOW}📋 Frontend dependencies perlu diinstall/update${NC}"
    if ask_confirmation "Install/update frontend dependencies sekarang?"; then
        echo -e "${GREEN}📥 Installing frontend dependencies...${NC}"
        npm install
        echo -e "${GREEN}✅ Frontend dependencies berhasil diinstall!${NC}"
        echo ""
    else
        echo -e "${RED}⚠️  Melewati instalasi. Aplikasi mungkin error jika dependencies tidak lengkap.${NC}"
        echo ""
    fi
else
    echo -e "${GREEN}✅ Frontend dependencies sudah up-to-date${NC}"
    echo ""
fi

# ====================================
# 2. CEK RUST/CARGO DEPENDENCIES
# ====================================
echo -e "${BLUE}🦀 Mengecek Rust dependencies...${NC}"

NEED_CARGO_BUILD=false

# Cek apakah Cargo.lock lebih baru dari target/
if [ -f "src-tauri/Cargo.toml" ]; then
    if [ ! -d "src-tauri/target" ]; then
        echo -e "${YELLOW}⚠️  Folder target/ tidak ditemukan (first build)${NC}"
        NEED_CARGO_BUILD=true
    elif [ "src-tauri/Cargo.toml" -nt "src-tauri/target" ]; then
        echo -e "${YELLOW}⚠️  Cargo.toml lebih baru dari build terakhir${NC}"
        NEED_CARGO_BUILD=true
    fi
fi

# Info untuk Cargo (biasanya auto-handled oleh tauri dev)
if [ "$NEED_CARGO_BUILD" = true ]; then
    echo -e "${YELLOW}📋 Rust dependencies akan di-compile saat tauri dev berjalan${NC}"
    echo -e "${BLUE}ℹ️  Proses compile pertama kali bisa memakan waktu 5-10 menit${NC}"
    if ! ask_confirmation "Lanjutkan?"; then
        echo -e "${RED}❌ Dibatalkan oleh user${NC}"
        exit 0
    fi
    echo ""
else
    echo -e "${GREEN}✅ Rust dependencies sudah di-compile${NC}"
    echo ""
fi

# ====================================
# 3. CEK SYSTEM DEPENDENCIES (Linux)
# ====================================
if [ "$(uname)" = "Linux" ]; then
    echo -e "${BLUE}🐧 Mengecek system dependencies (Linux)...${NC}"
    
    MISSING_DEPS=()
    
    # Cek apakah pkg-config ada
    if ! command -v pkg-config &> /dev/null; then
        MISSING_DEPS+=("pkg-config")
    fi
    
    # Cek WebKit2GTK
    if ! pkg-config --exists webkit2gtk-4.1 2>/dev/null && ! pkg-config --exists webkit2gtk-4.0 2>/dev/null; then
        MISSING_DEPS+=("libwebkit2gtk")
    fi
    
    # Cek build-essential
    if ! command -v gcc &> /dev/null; then
        MISSING_DEPS+=("build-essential")
    fi
    
    if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
        echo -e "${RED}⚠️  System dependencies yang hilang: ${MISSING_DEPS[*]}${NC}"
        echo -e "${YELLOW}Untuk menginstall, jalankan:${NC}"
        echo -e "${GREEN}sudo apt update && sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev${NC}"
        echo ""
        if ! ask_confirmation "Lanjutkan tanpa dependencies ini? (kemungkinan akan error)"; then
            echo -e "${RED}❌ Dibatalkan. Install system dependencies terlebih dahulu.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ System dependencies sudah terpenuhi${NC}"
    fi
    echo ""
fi

# ====================================
# 4. JALANKAN TAURI DEV
# ====================================
echo -e "${GREEN}🎯 Memulai Tauri development server...${NC}"
echo -e "${BLUE}ℹ️  Tekan Ctrl+C untuk menghentikan${NC}"
echo ""
echo "=========================================="

# Jalankan tauri dev
npm run tauri:dev