#!/bin/bash
# NourProject - Build Executable dengan PyInstaller
# Creates standalone executable for Linux

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  📦 NourProject - Building Executable"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if PyInstaller is installed
if ! python3 -c "import PyInstaller" 2>/dev/null; then
    echo "📥 Installing PyInstaller..."
    pip3 install pyinstaller
    echo ""
fi

cd "$(dirname "$0")/.."

echo "🔨 Building NourProject Desktop executable..."
echo ""

# Build executable
pyinstaller --onefile \
    --windowed \
    --name="NourProject-Desktop" \
    --icon=NONE \
    --add-data="scripts:scripts" \
    --hidden-import=PySide6 \
    --hidden-import=psutil \
    gui/main.py

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  ✅ Build Successful!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📂 Executable location: dist/NourProject-Desktop"
    echo ""
    echo "🚀 Run with: ./dist/NourProject-Desktop"
    echo ""
else
    echo ""
    echo "❌ Build failed!"
    echo ""
fi
