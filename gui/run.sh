#!/bin/bash
# NourProject Desktop - Launcher Script

echo "🚀 Launching NourProject Desktop GUI..."
echo ""

# Check if PySide6 is installed
if ! python3 -c "import PySide6" 2>/dev/null; then
    echo "⚠️ Installing required dependencies..."
    pip3 install PySide6 psutil
    echo ""
fi

# Run the GUI application
cd "$(dirname "$0")"
python3 main.py
