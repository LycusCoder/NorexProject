# Changelog

All notable changes to NourProject will be documented in this file.

---

## [v3.0.0] - Phase 3: Refinement (Current)

### 🎯 Focus: UX Refinement & Developer Tooling

### Added
- ✨ **Context Menu System** - Right-click anywhere for quick actions
  - Start/Stop/Restart services
  - Check status
  - Python CLI access
  - View logs
  - Backup database
  - Exit application
- 🐍 **Python CLI Integration** (`scripts/python.sh`)
  - Docker-based Python 3.11+ environment
  - Interactive shell mode
  - Code execution support
  - Script file execution
  - Isolated environment without host installation
- 🖥️ **System Tray Support**
  - Minimize to tray
  - Quick actions menu
  - Double-click to restore
- 🎨 **Toolbar with Settings Icon**
  - Settings accessible via ⚙️ icon
  - Status indicator in toolbar
  - Clean, minimal design
- 🔄 **Restart Services** - One-click restart functionality
- 📋 **View All Logs** - Quick access via context menu
- 💾 **Database Backup** - GUI-accessible backup function

### Changed
- 🎨 **Complete UI/UX Refinement**
  - Professional dark theme dengan gradients
  - Smooth hover effects dan transitions
  - Enhanced color palette
  - Better typography dan spacing
- 🟢 **Enhanced Status Indicators**
  - Larger size (20px → 24px)
  - Gradient backgrounds
  - Smooth animations
  - Better tooltips
- 📝 **Welcome Message** - Updated untuk Phase 3 features
- 🎯 **User Guidance** - Added context menu hint
- 📊 **Version Badge** - Added di header

### Improved
- ⚡ **Performance** - Better async operations
- 🎨 **Visual Feedback** - Enhanced user feedback
- 🖱️ **Accessibility** - Context menu untuk easier access
- 📖 **Documentation** - Complete Phase 3 guide

### Technical
- `main.py` - Complete refinement (890 lines)
  - Context menu implementation
  - System tray integration
  - Toolbar system
  - Enhanced styling
  - New utility functions
- `scripts/python.sh` - New Python CLI script
  - Docker integration
  - Multiple execution modes
  - Error handling

---

## [v2.5.0] - Phase 2.5: Clean Architecture

### 🎯 Focus: Project Organization & Documentation

### Added
- 📁 **Organized Documentation Structure**
  - `docs/user/` - End-user guides
  - `docs/technical/` - Technical documentation
  - `docs/guides/` - Phase summaries
  - `docs/meta/` - Project metadata
- 📚 **Complete Documentation Index** (`docs/README.md`)
- 📝 **Phase 2 Complete Summary** (`docs/guides/PHASE_2_COMPLETE.md`)

### Changed
- 🗂️ **Root Directory** - Cleaned up (12 files → 3 files)
- 📖 **README.md** - Simplified (366 lines → 203 lines)
  - Focused on essential information
  - Links to organized docs
  - Professional appearance
- 📍 **Path References** - Updated GUI to reference `/app/docs/`

### Improved
- 🎯 **Navigation** - Easier to find information
- 👥 **User Experience** - Role-based documentation paths
- 🏗️ **Project Structure** - Industry-standard layout
- 🎨 **Professional Image** - Ready for public release

---

## [v2.0.0] - Phase 2: Native Desktop GUI

### 🎯 Focus: Laragon-style Desktop Application

### Added
- 🖥️ **Native Desktop GUI** (`gui/main.py`)
  - PySide6-based control panel
  - Real-time service monitoring
  - One-click service control
  - Live log viewer
  - Auto-refresh every 5 seconds
- ⚙️ **Settings Dialog** (`gui/settings_dialog.py`)
  - Port configuration (Web, MySQL, phpMyAdmin)
  - Database credentials management
  - Container names customization
  - Auto-restart options
  - Tab-based interface
- 🔄 **PHP Version Switcher**
  - Support for PHP 8.1, 8.2, 8.3
  - GUI dropdown selection
  - Automatic container rebuild
- 🌐 **Quick Access Buttons**
  - Open main site (localhost:8080)
  - Open phpMyAdmin (localhost:8081)
  - Direct browser launch
- 📊 **Status Indicators**
  - Visual status lights (green/red)
  - Real-time updates
  - Service tooltips
- 🎨 **Dark Theme UI**
  - Professional dark color scheme
  - Cyan/teal accent colors
  - Modern, clean design

### Technical
- **Dependencies:**
  - PySide6 (Qt6 bindings)
  - psutil (system monitoring)
- **Architecture:**
  - Worker threads untuk non-blocking operations
  - Signal/slot pattern untuk async updates
  - Automatic status refresh
  - YAML parsing untuk settings

---

## [v1.0.0] - Phase 1: Docker Stack Foundation

### 🎯 Focus: Complete PHP Development Stack

### Added
- 🐳 **Docker Stack**
  - Apache 2.4 web server
  - PHP 8.2 (switchable: 8.1, 8.2, 8.3)
  - MySQL 8.0 database
  - phpMyAdmin admin tool
- 📦 **Complete PHP Extensions**
  - Database: mysqli, pdo_mysql
  - Image: gd
  - Compression: zip
  - Utilities: intl, opcache, mbstring, bcmath, exif, soap, curl
- 🔧 **Management Scripts** (`scripts/`)
  - `start.sh` - Start all services
  - `stop.sh` - Stop all services
  - `status.sh` - Check service status
  - `switch-php.sh` - Switch PHP version
  - `change-port.sh` - Change web server port
  - `backup-db.sh` - Backup MySQL database
  - `reset.sh` - Reset environment
  - `check-system.sh` - System health check
  - `logs.sh` - View service logs
- 📝 **Documentation**
  - Quick Start Guide
  - Installation Guide
  - Architecture Overview
  - User Checklist
  - Quick Reference Card
- 🌐 **Default Configuration**
  - Web: localhost:8080
  - phpMyAdmin: localhost:8081
  - MySQL: localhost:3306
  - Credentials: root / 041201 (dev only)

### Technical
- **Dockerfile** - Custom PHP image dengan all extensions
- **docker-compose.yml** - Multi-service orchestration
- **Persistent Storage** - MySQL data volume
- **Network** - Isolated Docker network
- **Auto-restart** - Services restart automatically

---

## Version History Summary

| Version | Phase | Focus | Key Features |
|---------|-------|-------|-------------|
| v3.0.0 | Phase 3 | Refinement | Context menu, Python CLI, Modern UI |
| v2.5.0 | Phase 2.5 | Architecture | Clean structure, Organized docs |
| v2.0.0 | Phase 2 | Desktop GUI | Native app, Settings, Monitoring |
| v1.0.0 | Phase 1 | Foundation | Docker stack, Scripts, Docs |

---

## Upgrade Path

### From v2.5.0 to v3.0.0
1. Pull latest changes
2. GUI automatically updated
3. New Python CLI available: `bash scripts/python.sh`
4. Right-click untuk context menu
5. Settings now accessible via ⚙️ icon

### From v2.0.0 to v2.5.0
1. Documentation moved to `docs/` folder
2. Update any custom scripts referencing old paths
3. README simplified - check for important links

### From v1.0.0 to v2.0.0
1. Install GUI dependencies: `pip install PySide6 psutil`
2. Launch GUI: `cd gui && bash run.sh`
3. All CLI scripts still work
4. Settings now manageable via GUI

---

## Roadmap

### Planned Features
- [ ] Enhanced database management tools
- [ ] Built-in code editor integration
- [ ] Project templates system
- [ ] Extension/plugin system
- [ ] Multi-project support
- [ ] Cloud backup integration
- [ ] Performance monitoring
- [ ] Advanced logging system

### Under Consideration
- [ ] Windows native support
- [ ] macOS native support
- [ ] Mobile companion app
- [ ] Web-based GUI alternative
- [ ] Kubernetes deployment option
- [ ] CI/CD integration

---

## Contributors

NourProject is developed and maintained with ❤️

---

## License

NourProject - Modern PHP Development Environment

---

*Last Updated: Phase 3 Complete*
