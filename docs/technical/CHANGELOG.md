# 📝 NourProject - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.5] - Phase 2.5: Clean Architecture - 2025-01-03

### 🧹 Major Refactor: Project Structure Reorganization

### Added
- **`docs/` Directory Structure** - Organized all documentation
  - `docs/user/` - End-user guides (5 files)
  - `docs/technical/` - Technical documentation (2 files)
  - `docs/guides/` - Development guides (2 files)
  - `docs/meta/` - Project metadata (4 files)
- **`docs/README.md`** - Complete documentation index
- **Phase 2.5 Summary** - `docs/guides/PHASE_2.5_COMPLETE.md`

### Changed
- **Root README.md** - Simplified from 366 lines to 203 lines
  - Cleaner format
  - Points to organized docs
  - Better navigation
  - Essential info only
- **GUI Welcome Message** - Updated documentation path reference

### Moved
**User Documentation** (→ `docs/user/`)
- QUICK_START.md
- INSTALLATION.md
- GUI_INSTALLATION.md
- USER_CHECKLIST.md
- QUICK_REFERENCE.md

**Technical Documentation** (→ `docs/technical/`)
- ARCHITECTURE.md
- CHANGELOG.md

**Development Guides** (→ `docs/guides/`)
- PHASE_2_COMPLETE.md

**Project Metadata** (→ `docs/meta/`)
- GIT_READY.md
- SETUP_SUMMARY.md
- FINAL_CHECKLIST.txt
- PROJECT_FILES.txt

### Removed
- Cleaned root directory (12 files moved to docs/)
- Removed redundant documentation from root
- Removed old README backup files

### Improved
- **Project Structure** - Now matches industry standards
- **Documentation Navigation** - Clear paths for different users
- **Professional Appearance** - Clean root directory
- **Maintainability** - Logical file organization
- **Scalability** - Easy to add new documentation

### Impact
- ✅ Root directory: 12 files → 3 files (75% cleaner)
- ✅ Documentation: scattered → organized
- ✅ Navigation: unclear → role-based paths
- ✅ First impression: cluttered → professional

---

## [2.0.0] - Phase 2: Native GUI - 2025-01-03

### 🎉 Major Release: Desktop GUI Application

### Added
- **Native Desktop GUI** application using PySide6 (Qt6)
- **Real-time Service Monitoring** with status indicators (green/red lights)
- **Service Control Panel** with Start/Stop/Refresh buttons
- **PHP Version Switcher** with dropdown selector (8.1, 8.2, 8.3)
- **Settings Dialog** with tabbed interface:
  - Ports configuration tab (Web/phpMyAdmin/MySQL)
  - Database credentials tab (name/user/password)
  - Advanced options tab (containers/auto-restart)
- **Live Log Viewer** with auto-scroll and color coding
- **Quick Access Panel** for browser links (Main Site/phpMyAdmin)
- **Auto-refresh Status** every 5 seconds
- **Port 80 Support** with sudo warning and validation
- **Port Conflict Detection** before saving settings
- **Automatic Settings Backup** before changes
- **Modern Dark Theme** UI with cyan/teal accents
- **Welcome Message** with ASCII art banner
- **Threading Model** for non-blocking operations

### GUI Components
- `gui/main.py` - Main GUI application (500+ lines)
- `gui/settings_dialog.py` - Settings dialog (400+ lines)
- `gui/run.sh` - GUI launcher with auto-install
- `gui/build.sh` - PyInstaller executable builder
- `gui/test_gui.py` - GUI screenshot test
- `gui/test_settings.py` - Settings parser test
- `gui/README.md` - Comprehensive GUI documentation

### Scripts
- `scripts/change-port.sh` - Quick CLI port changer

### Documentation
- `GUI_INSTALLATION.md` - OS-specific installation guide
- `PHASE_2_COMPLETE.md` - Phase 2 completion summary
- `USER_CHECKLIST.md` - User testing checklist
- `QUICK_REFERENCE.md` - Quick reference card
- Updated `README.md` with Phase 2 features
- Updated `docker-compose.yml` with port comments

### Technical
- Multi-threaded subprocess execution
- Signal/Slot communication pattern
- YAML parsing with regex
- Safe file writing with automatic backup
- Error handling and validation
- Cross-platform support (Linux/macOS/WSL2)

### Dependencies
- PySide6 (v6.10.0) - Qt6 bindings
- psutil (v7.1.3) - System utilities
- System libraries (libEGL, libGL, xcb-utils)

### Improved
- Project structure documentation
- Comparison table vs Laragon/XAMPP
- Installation instructions
- Troubleshooting guides

---

## [1.0.0] - Phase 1: CLI Foundation - 2024-12-XX

### Initial Release

### Added
- **Docker-based** PHP development environment
- **Apache 2.4** web server
- **PHP 8.2** (default) with multi-version support
- **MySQL 8.0** database server
- **phpMyAdmin** database admin tool
- **All Essential PHP Extensions**:
  - Database: mysqli, pdo, pdo_mysql
  - Image: gd (freetype, jpeg)
  - Compression: zip
  - Internationalization: intl, mbstring
  - Performance: opcache
  - Others: bcmath, exif, pcntl, soap, curl

### Scripts
- `scripts/start.sh` - Start all services
- `scripts/stop.sh` - Stop all services
- `scripts/status.sh` - Check service status
- `scripts/switch-php.sh` - Switch PHP versions
- `scripts/logs.sh` - View service logs
- `scripts/backup-db.sh` - Backup database
- `scripts/reset.sh` - Complete reset
- `scripts/check-system.sh` - System check

### Configuration
- `docker-compose.yml` - Service orchestration
- `Dockerfile` - PHP container definition
- `config/php/php.ini` - PHP configuration

### Documentation
- `README.md` - Project overview
- `QUICK_START.md` - Getting started guide
- `INSTALLATION.md` - Detailed installation
- `SETUP_SUMMARY.md` - Setup summary
- `GIT_READY.md` - Git integration guide

### Features
- Cross-platform support (Docker-based)
- Isolated development environment
- Persistent MySQL data
- Hot reload for PHP files
- Easy version switching
- Comprehensive PHP extensions
- Professional structure

---

## Comparison: Phase 1 vs Phase 2

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| **Interface** | CLI only | CLI + Native GUI |
| **Service Control** | Shell scripts | One-click buttons |
| **Status Monitoring** | Manual check | Real-time indicators |
| **Port Configuration** | Manual YAML edit | GUI settings panel |
| **PHP Switching** | CLI command | Dropdown selector |
| **Log Viewing** | Separate terminal | Integrated panel |
| **User Experience** | Terminal-based | Modern desktop app |
| **Accessibility** | Tech users | All skill levels |

---

## Roadmap

### Phase 3 (Future)
- [ ] System tray integration
- [ ] Desktop notifications
- [ ] Database backup/restore GUI
- [ ] Log filtering and search
- [ ] Multiple project profiles
- [ ] Custom PHP extensions manager
- [ ] Nginx support option
- [ ] Theme customization
- [ ] Keyboard shortcuts
- [ ] Status history graphs
- [ ] Export/Import settings
- [ ] Update checker
- [ ] Plugin system

### Long-term Vision
- [ ] Multi-project workspace
- [ ] Remote server management
- [ ] Cloud synchronization
- [ ] Team collaboration features
- [ ] Performance profiling tools
- [ ] Debugging integration
- [ ] CI/CD pipeline integration

---

## Version Numbering

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes or major feature additions (Phase releases)
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, minor improvements

---

## Support

For issues, feature requests, or questions:
1. Check documentation files
2. Review troubleshooting guides
3. Check Docker/service logs
4. Report issues (if applicable)

---

## Contributors

**Lead Developer**: E1 Agent (Emergent AI)
**Project Type**: PHP Development Environment
**Inspired By**: Laragon, XAMPP
**Built With**: Docker, PySide6, Python, Bash

---

## License

[Specify license here]

---

## Acknowledgments

### Technologies
- **Docker** - Containerization platform
- **PySide6 (Qt6)** - GUI framework
- **Apache** - Web server
- **PHP** - Programming language
- **MySQL** - Database server
- **phpMyAdmin** - Database admin tool
- **Python** - Scripting and GUI
- **Bash** - Shell scripts

### Inspiration
- **Laragon** - Windows development stack (GUI inspiration)
- **XAMPP** - Cross-platform stack (functionality reference)
- **Docker Desktop** - Container management (architecture)

---

*NourProject - Making PHP development powerful and enjoyable! 🚀*

---

## Notes

### Breaking Changes
- **v2.0.0**: Introduced GUI, no breaking changes to CLI

### Deprecations
- None currently

### Security
- Default passwords are for **development only**
- Change credentials for production use
- Don't expose ports to public networks

### Performance
- GUI uses < 200MB RAM when idle
- Auto-refresh uses minimal CPU
- Docker containers use standard resources

---

**Last Updated**: Phase 2 Completion
**Status**: Production Ready
**Next Release**: TBD (Phase 3 planning)
