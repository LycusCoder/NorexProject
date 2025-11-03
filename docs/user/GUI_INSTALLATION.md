# 🎨 NourProject Desktop GUI - Installation Guide

## 📋 Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu/Debian/Fedora/Arch), macOS, or Windows with WSL2
- **Python**: 3.8 or higher
- **Docker**: Latest version
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Display**: X11 or Wayland display server (Linux)

### Required Packages (Linux)

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install -y \
    python3 \
    python3-pip \
    libgl1-mesa-glx \
    libegl1 \
    libxkbcommon-x11-0 \
    libxcb-icccm4 \
    libxcb-image0 \
    libxcb-keysyms1 \
    libxcb-randr0 \
    libxcb-render-util0 \
    libxcb-xinerama0 \
    libxcb-xfixes0
```

#### Fedora/RHEL
```bash
sudo dnf install -y \
    python3 \
    python3-pip \
    mesa-libGL \
    mesa-libEGL \
    libxkbcommon-x11 \
    xcb-util-image \
    xcb-util-keysyms \
    xcb-util-renderutil \
    xcb-util-wm
```

#### Arch Linux
```bash
sudo pacman -S \
    python \
    python-pip \
    mesa \
    libxkbcommon-x11 \
    xcb-util-image \
    xcb-util-keysyms \
    xcb-util-renderutil \
    xcb-util-wm
```

## 🚀 Installation Steps

### 1. Clone or Navigate to NourProject
```bash
cd /path/to/NourProject
```

### 2. Install Python Dependencies
```bash
pip3 install PySide6 psutil
```

Or use the launcher which auto-installs:
```bash
cd gui
bash run.sh
```

### 3. Verify Installation
```bash
python3 -c "import PySide6; print('PySide6 version:', PySide6.__version__)"
```

Expected output:
```
PySide6 version: 6.x.x
```

### 4. Launch GUI
```bash
cd gui
bash run.sh
```

Or directly:
```bash
python3 gui/main.py
```

## 🐛 Troubleshooting

### Error: "libEGL.so.1: cannot open shared object file"

**Solution**: Install EGL libraries
```bash
# Ubuntu/Debian
sudo apt-get install libegl1

# Fedora
sudo dnf install mesa-libEGL

# Arch
sudo pacman -S mesa
```

### Error: "Could not find the Qt platform plugin"

**Solution**: Install xcb platform plugins
```bash
# Ubuntu/Debian
sudo apt-get install libxcb-xinerama0

# Fedora
sudo dnf install xcb-util-wm

# Arch
sudo pacman -S xcb-util-wm
```

### Error: "No module named 'PySide6'"

**Solution**: Install PySide6
```bash
pip3 install --upgrade PySide6
```

### GUI doesn't start on WSL2

**Solution**: Install and configure X server (VcXsrv or X410)

1. Download and install VcXsrv from: https://sourceforge.net/projects/vcxsrv/
2. Run XLaunch with "Disable access control" enabled
3. Set DISPLAY environment variable:
```bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '{print $2}'):0.0
```

Add to `~/.bashrc` to make it permanent:
```bash
echo 'export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '\''{print $2}'\''):0.0' >> ~/.bashrc
```

### Permission denied for Docker commands

**Solution**: Add user to docker group
```bash
sudo usermod -aG docker $USER
newgrp docker
```

Or run GUI with sudo (not recommended):
```bash
sudo python3 gui/main.py
```

### Port 80 not working

**Solution**: Docker needs root privileges for ports < 1024

Option 1 - Add user to docker group (recommended):
```bash
sudo usermod -aG docker $USER
newgrp docker
```

Option 2 - Run Docker with sudo:
```bash
sudo docker compose up -d
```

Option 3 - Use port 8080 instead:
- Open GUI Settings (⚙️ button)
- Change Web Server port to 8080
- Save & Apply

## 🔧 Advanced Configuration

### Building Standalone Executable

For distributing GUI without Python installation:

```bash
cd gui
bash build.sh
```

Executable will be created in `dist/NourProject-Desktop`

### Custom Themes

Edit `main.py` stylesheet section to customize colors:

```python
# Around line 100 in main.py
self.setStyleSheet("""
    QMainWindow {
        background-color: #1e1e1e;  # Change background
    }
    QPushButton {
        background-color: #0d7377;  # Change button color
    }
    # ... more styles
""")
```

### Disable Auto-refresh

Edit `main.py` line ~250:

```python
# Change refresh interval (milliseconds)
self.status_timer.start(10000)  # 10 seconds instead of 5
```

Or disable completely:
```python
# Comment out the auto-refresh line
# self.status_timer.start(5000)
```

## 📚 Additional Resources

### Documentation
- [GUI Features](gui/README.md)
- [Main README](../README.md)
- [Quick Start Guide](../QUICK_START.md)

### PySide6 Documentation
- Official Docs: https://doc.qt.io/qtforpython/
- Examples: https://doc.qt.io/qtforpython/examples/index.html

### Docker Documentation
- Official Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

## 💡 Tips

1. **First Launch**: May take a few seconds to initialize
2. **Container Status**: Allow 5-10 seconds for containers to start
3. **Log Panel**: Check logs for detailed error messages
4. **Settings Changes**: Always require service restart
5. **Backup**: Settings automatically backed up before changes

## 🆘 Getting Help

1. Check logs in GUI log panel
2. Run `bash scripts/status.sh` to check container status
3. Review Docker logs: `docker compose logs`
4. Check GitHub issues (if available)
5. Contact maintainer

## 🎉 Enjoy NourProject!

Your powerful, modern PHP development environment with native GUI! 🚀
