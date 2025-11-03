# 🚀 Phase 3 Quick Start Guide

**Quick reference untuk fitur-fitur baru Phase 3**

---

## ✨ What's New in Phase 3?

### 1. Context Menu (Right-Click) 🖱️

**Akses cepat ke semua fungsi:**
```
Right-click di window mana saja:
├─ ▶️  Start Services
├─ ⏹️  Stop Services  
├─ 🔄 Restart Services
├─ 🔍 Check Status
├─ 🐍 Python CLI
├─ 📋 View Logs
├─ 💾 Backup Database
└─ ❌ Exit
```

### 2. Python CLI 🐍

**Docker-based Python environment - No host installation needed!**

#### Quick Commands:
```bash
# Interactive shell
bash scripts/python.sh

# Execute code
bash scripts/python.sh 'print("Hello World")'

# Run script file
bash scripts/python.sh my_script.py

# Check Python version
bash scripts/python.sh -c 'import sys; print(sys.version)'
```

#### Examples:
```bash
# Quick calculation
bash scripts/python.sh 'print(sum(range(1, 101)))'

# JSON parsing
bash scripts/python.sh 'import json; print(json.dumps({"status": "ok"}))'

# File operations (project mounted at /workspace)
bash scripts/python.sh 'import os; print(os.listdir("/workspace"))'
```

### 3. Modern UI Improvements 🎨

**What changed:**
- ✅ Professional dark theme with gradients
- ✅ Settings accessible via ⚙️ icon (top toolbar)
- ✅ Enhanced status indicators (larger, animated)
- ✅ System tray support (minimize to tray)
- ✅ Toolbar with real-time status
- ✅ Smooth hover effects

---

## 🎯 Common Tasks

### Starting Services
**Option 1:** Right-click → Start Services  
**Option 2:** From tray menu → Start Services

### Changing Settings
1. Click ⚙️ icon in toolbar
2. Modify settings (ports, database, etc.)
3. Save & apply
4. Restart services

### Using Python CLI
```bash
# Quick script
cd /app
bash scripts/python.sh 'print("Hello NourProject!")'

# Interactive development
bash scripts/python.sh
>>> import requests  # Install packages inside container
>>> # Your code here
>>> exit()
```

### Viewing Logs
Right-click → View All Logs

### Backing Up Database
Right-click → Backup Database

---

## 🔧 Keyboard Shortcuts (Future)

*Planned for next phase*

---

## 💡 Pro Tips

### 1. Context Menu Everywhere
Right-click works anywhere in the window - header, status area, logs panel, etc.

### 2. Python Package Installation
```bash
# Enter container to install packages
bash scripts/python.sh
>>> import subprocess
>>> subprocess.check_call(['pip', 'install', 'package-name'])
```

### 3. System Tray
Minimize to tray to keep app running in background while freeing screen space.

### 4. Status Toolbar
Watch the top-right corner for real-time operation status.

### 5. Project Access in Python
```bash
bash scripts/python.sh
>>> # Your project is at /workspace
>>> import os
>>> os.chdir('/workspace/www')
>>> # Access your PHP files, configs, etc.
```

---

## 🐛 Troubleshooting

### Context Menu Not Showing
- Make sure you're right-clicking inside the application window
- Try clicking in different areas (header, status panel, logs)

### Python CLI Docker Error
```bash
# Check Docker status
docker ps

# Start Docker if not running
sudo systemctl start docker  # Linux
# or start Docker Desktop (Windows/Mac)
```

### GUI Not Loading
```bash
# Check dependencies
pip install PySide6 psutil

# Launch GUI
cd /app/gui
bash run.sh
```

---

## 📚 Learn More

- [Complete Phase 3 Documentation](PHASE_3_COMPLETE.md)
- [Architecture Overview](../technical/ARCHITECTURE.md)
- [Full Changelog](../technical/CHANGELOG.md)

---

**Enjoy the refined NourProject experience!** 🎉
