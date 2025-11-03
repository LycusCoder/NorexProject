# 🖥️ NourProject Desktop - Native GUI Control Panel

**Phase 2: Modern Desktop Application ala Laragon**

## 🌟 Features

- ✅ **Native Desktop GUI** dengan PySide6 (Qt6)
- ✅ **Real-time Status Indicators** (🟢 hijau / 🔴 merah)
- ✅ **One-Click Service Control** (Start, Stop, Refresh)
- ✅ **PHP Version Switcher** (8.1, 8.2, 8.3) dengan dropdown
- ✅ **Settings Panel** dengan tabs:
  - 🌐 **Ports Configuration** (Web/phpMyAdmin/MySQL)
  - 🗄️ **Database Credentials** (nama, user, password)
  - 🔧 **Advanced Options** (container names, auto-restart)
- ✅ **Live Log Viewer** dengan output real-time dan auto-scroll
- ✅ **Quick Access Links** ke localhost (browser integration)
- ✅ **Modern Dark Theme** UI dengan cyan/teal accent
- ✅ **Auto-refresh Status** setiap 5 detik
- ✅ **Non-blocking Operations** dengan threading
- ✅ **Port Conflict Detection** dan validation
- ✅ **Automatic Settings Backup** sebelum perubahan
- ✅ **Port 80 Support** dengan sudo warning

## 🚀 Quick Start

### Installation

#### 1. Install Dependencies (First Time Only)
```bash
pip3 install PySide6 psutil
```

See [GUI_INSTALLATION.md](../GUI_INSTALLATION.md) for detailed OS-specific instructions.

#### 2. Launch GUI
```bash
cd /app/gui
bash run.sh
```

Or directly:
```bash
python3 /app/gui/main.py
```

## 📸 Interface Overview

### 1. Service Status Panel
- **🟢 Green Light**: Service is running
- **🔴 Red Light**: Service is stopped
- **Auto-refresh**: Every 5 seconds
- **Services Monitored**:
  - Apache (Web Server)
  - MySQL (Database)
  - phpMyAdmin (Admin Tool)

### 2. Service Control Buttons
- **▶️ Start Services**: Launch all Docker containers
- **⏹️ Stop Services**: Stop all Docker containers
- **🔄 Refresh Status**: Manual status update
- **⚙️ Settings**: Open configuration dialog

### 3. PHP Version Switcher
- **Dropdown selector**: Choose from 8.1, 8.2, 8.3
- **Switch & Rebuild button**: Apply changes
- **Real-time progress**: Watch rebuild in log panel
- **Confirmation dialog**: Prevent accidental switches

### 4. Quick Access Panel
- **🌍 Open Main Site**: http://localhost:8080 (or configured port)
- **🗄️ Open phpMyAdmin**: http://localhost:8081 (or configured port)
- Opens in default browser
- One-click access

### 5. Live Log Panel
- **Real-time output**: All operations logged
- **Auto-scroll**: Automatically scrolls to bottom
- **Color-coded**: Terminal-style output
- **Emoji indicators**: Visual status markers
- **Persistent**: Logs remain across operations

## ⚙️ Settings Dialog

Access via **⚙️ Settings** button in main window.

### Ports Tab 🌐

#### Web Server (Apache)
- **Default**: 8080
- **Custom range**: 1-65535
- **Quick presets**:
  - "Use Port 80" button
  - "Use Port 8080" button
- **Port 80 notice**: Requires sudo privileges

#### phpMyAdmin
- **Default**: 8081
- **Custom range**: 1-65535

#### MySQL Database
- **Default**: 3306 (standard MySQL port)
- **Custom range**: 1-65535

**Features**:
- Port conflict detection
- Validation before save
- Warning for privileged ports

### Database Tab 🗄️

#### MySQL Credentials
- **Database Name**: Default `nour_db`
- **Username**: Default `root`
- **Password**: Default `041201`
- **Show/Hide Password**: Toggle visibility
- **Security warning**: Development use only

### Advanced Tab 🔧

#### Container Names
- **Web Container**: Default `nour_apache`
- **DB Container**: Default `nour_mysql`
- **PMA Container**: Default `nour_pma`

#### Auto Options
- **Auto-restart containers**: Enabled by default
- Sets Docker restart policy to `unless-stopped`

### Settings Operations

1. **Load Current**: Auto-loads from `docker-compose.yml`
2. **Validate**: Checks for conflicts and issues
3. **Backup**: Creates `.backup` file before changes
4. **Save**: Writes to `docker-compose.yml`
5. **Apply**: Requires container restart

## 🎨 UI Theme

### Color Scheme
- **Background**: Dark (#1e1e1e, #2d2d2d)
- **Primary**: Cyan/Teal (#0d7377)
- **Accent**: Bright Cyan (#14FFEC)
- **Text**: White (#ffffff)
- **Logs**: Terminal green (#00ff00)

### Font
- **UI**: Arial, system default
- **Logs**: Courier New, monospace

### Visual Design
- Modern dark theme
- Professional look
- Easy on eyes for long sessions
- High contrast for readability

## 🔧 Technical Details

### Architecture

```
gui/
├── main.py              # Main application & UI
├── settings_dialog.py   # Settings configuration dialog
├── run.sh              # Launcher script
├── build.sh            # PyInstaller builder
├── test_gui.py         # GUI screenshot test
├── test_settings.py    # Settings parser test
└── README.md           # This file
```

### Key Components

#### WorkerThread (main.py)
- Background subprocess execution
- Real-time output streaming
- Signal-based communication
- Error handling

#### StatusIndicator (main.py)
- Visual status representation
- Color-coded (green/red)
- Tooltip information
- Auto-update capability

#### NourProjectGUI (main.py)
- Main application window
- Service control logic
- Log management
- Timer-based auto-refresh

#### SettingsDialog (settings_dialog.py)
- Tabbed configuration interface
- YAML parsing and writing
- Validation and conflict detection
- Backup management

### Threading Model
- **Main Thread**: UI rendering and event handling
- **Worker Thread**: Shell command execution
- **Communication**: Qt Signal/Slot mechanism
- **Benefits**: Non-blocking, responsive UI

### File Operations
- **Read**: `docker-compose.yml` parsing with regex
- **Write**: Atomic file updates with backup
- **Backup**: Automatic `.backup` creation
- **Restore**: Auto-restore on write failure

## 📦 Dependencies

### Required Python Packages
```
PySide6==6.10.0  # Qt6 bindings for Python
psutil==7.1.3    # System and process utilities
```

### System Libraries (Linux)
- libEGL
- libGL (Mesa)
- libxkbcommon-x11
- xcb utilities (image, keysyms, render-util, wm)

See [GUI_INSTALLATION.md](../GUI_INSTALLATION.md) for installation commands.

## 🧪 Testing

### Test GUI Loading
```bash
cd /app/gui
python3 -c "import main; print('✅ GUI module OK')"
```

### Test Settings Parser
```bash
cd /app/gui
python3 test_settings.py
```

### Test Screenshot (Non-interactive)
```bash
cd /app/gui
python3 test_gui.py
```

### Manual Testing Checklist
- [ ] GUI launches without errors
- [ ] Status indicators update correctly
- [ ] Start/Stop buttons work
- [ ] PHP switcher changes version
- [ ] Settings dialog opens
- [ ] Port changes apply correctly
- [ ] Logs display real-time output
- [ ] Quick access opens browser
- [ ] Auto-refresh works (wait 5s)

## 🐛 Troubleshooting

### GUI Won't Launch

**Check Python version**:
```bash
python3 --version  # Should be 3.8+
```

**Check PySide6**:
```bash
python3 -c "import PySide6; print(PySide6.__version__)"
```

**Reinstall dependencies**:
```bash
pip3 install --force-reinstall PySide6 psutil
```

### "libEGL.so.1 not found"

Install EGL libraries:
```bash
# Ubuntu/Debian
sudo apt-get install libegl1 libgl1-mesa-glx

# See GUI_INSTALLATION.md for other distros
```

### Docker Commands Fail

**Check Docker running**:
```bash
docker info
```

**Check permissions**:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Status Indicators Not Updating

- Verify Docker daemon is running
- Check container names match defaults
- Try manual refresh (🔄 button)
- Check logs for error messages

### Settings Won't Save

- Check file permissions on `docker-compose.yml`
- Verify valid YAML syntax
- Look for backup file (`.backup`)
- Check logs for specific error

### Port 80 Issues

- Requires root/sudo for Docker
- Add user to docker group
- Or use port 8080 instead
- See Settings → Ports tab

## 💡 Usage Tips

1. **Keep GUI Open**: Auto-refresh keeps monitoring
2. **Check Logs**: All output visible in log panel
3. **Wait for Completion**: Don't spam buttons
4. **Use Settings**: Easier than manual YAML edits
5. **Quick Access**: One-click browser launching
6. **Confirmation Dialogs**: Prevent accidents
7. **Backup Restored**: Settings auto-restore on error

## 🎯 Keyboard Shortcuts

Currently not implemented. Future enhancement.

## 🔮 Future Enhancements (Phase 3)

- [ ] System tray integration
- [ ] Desktop notifications
- [ ] Database backup/restore GUI
- [ ] Log filtering and search
- [ ] Multiple project profiles
- [ ] Custom PHP extensions selector
- [ ] Nginx option
- [ ] Theme customization
- [ ] Keyboard shortcuts
- [ ] Status history graph

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [GUI Installation](../GUI_INSTALLATION.md) - Detailed setup
- [Quick Start](../QUICK_START.md) - Getting started
- [Installation Guide](../INSTALLATION.md) - Full install

## 🤝 Contributing

Improvements welcome! Focus areas:
- UI/UX enhancements
- Additional features
- Bug fixes
- Documentation
- Cross-platform testing

## 📄 License

Same as NourProject main license.

## 🎉 Enjoy!

NourProject Desktop - Control your development stack like a pro! 🚀

**Made with ❤️ using PySide6 (Qt6) and Python**
