# 🚀 NourProject

**Modern PHP development environment with Native Desktop GUI**  
*Powerful like Laragon, Cross-platform like Docker!*

---

## ✨ What is NourProject?

Complete PHP development stack featuring:
- 🖥️ **Native Desktop GUI** - Laragon-style control panel  
- 🐳 **Docker-based** - Isolated, reproducible environments
- 🔄 **Multi-PHP Support** - 8.1, 8.2, 8.3 with easy switching
- ⚙️ **Flexible Configuration** - Ports, database via GUI
- 🌐 **Complete Stack** - Apache, MySQL 8.0, phpMyAdmin
- 📦 **All PHP Extensions** - mysqli, pdo, gd, zip, intl, opcache, etc.

---

## 🚀 Quick Start

### GUI Desktop (Recommended)
```bash
cd /app/gui && bash run.sh
```
**One-click control for everything!**

### Command Line
```bash
bash scripts/start.sh
open http://localhost:8080
```
**That's it!** You're ready to develop.

---

## 📚 Documentation

**All documentation organized in [`docs/`](docs/) folder**

👉 **[Complete Documentation Index](docs/README.md)**

### Essential Guides
- 📖 [Quick Start](docs/user/QUICK_START.md) - 5-minute setup
- 💻 [Installation Guide](docs/user/INSTALLATION.md) - Detailed setup  
- 🖥️ [GUI Installation](docs/user/GUI_INSTALLATION.md) - Desktop app
- 📝 [Quick Reference](docs/user/QUICK_REFERENCE.md) - Command cheat sheet
- 🏗️ [Architecture](docs/technical/ARCHITECTURE.md) - System design
- 📋 [Changelog](docs/technical/CHANGELOG.md) - Version history

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🖥️ **Native GUI** | PySide6 desktop app with real-time monitoring |
| ⚡ **Service Control** | Start/Stop services with one click |
| 🔄 **PHP Switching** | Change versions (8.1/8.2/8.3) instantly |
| 🌐 **Port Config** | Easy port management (80/8080/custom) |
| ⚙️ **Settings Panel** | Configure via GUI (no manual edits) |
| 📊 **Live Logs** | Real-time output monitoring |
| 🚀 **Quick Access** | Browser links for instant access |
| 🔄 **Auto-Refresh** | Status updates every 5 seconds |

---

## 🎯 Access Points

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| **Main Site** | http://localhost:8080 | - |
| **phpMyAdmin** | http://localhost:8081 | root / 041201 |
| **MySQL** | localhost:3306 | root / 041201 |

*All configurable via GUI Settings ⚙️*

---

## 📦 What's Included

### Core Stack
- **Apache 2.4** - Web server
- **PHP 8.2** - Switchable: 8.1, 8.2, 8.3  
- **MySQL 8.0** - Database
- **phpMyAdmin** - Admin tool
- **PySide6** - Qt6 desktop GUI

### PHP Extensions
Database • Image (gd) • Compression (zip) • Intl • Opcache  
PDO • MySQLi • MBString • BCMath • Exif • SOAP • cURL

---

## 🏗️ Project Structure

```
NourProject/
├── gui/           # Desktop GUI application  
├── www/           # Your PHP files  
├── scripts/       # Management scripts
├── config/        # Configuration
├── docs/          # 📚 All documentation
├── data/          # MySQL data (persistent)
└── docker-compose.yml
```

---

## 💡 Common Tasks

**Start Development**
```bash
cd /app/gui && bash run.sh
```

**Change to Port 80**
- GUI: Settings ⚙️ → Ports → "Use Port 80"
- CLI: `bash scripts/change-port.sh 80`

**Switch PHP Version**
- GUI: Dropdown → Select → "Switch & Rebuild"
- CLI: `bash scripts/switch-php.sh 8.3`

**Backup Database**
```bash
bash scripts/backup-db.sh
```

---

## 🆚 Why NourProject?

### vs Laragon
✅ Cross-platform • ✅ Docker isolation • ✅ Real-time GUI monitoring

### vs XAMPP
✅ Modern GUI • ✅ PHP switching • ✅ Better dev experience

### vs Manual Docker
✅ Pre-configured • ✅ GUI management • ✅ Complete docs

---

## 🔧 Requirements

- Docker (latest)
- Python 3.8+ (GUI only)
- 2GB RAM minimum

*No PHP, MySQL, or Apache installation needed on host!*

---

## 🎓 Learning Path

1. New User → [Quick Start](docs/user/QUICK_START.md)
2. Installing → [Installation Guide](docs/user/INSTALLATION.md)
3. Need Commands → [Quick Reference](docs/user/QUICK_REFERENCE.md)
4. Understanding System → [Architecture](docs/technical/ARCHITECTURE.md)
5. Troubleshooting → Check doc's troubleshooting sections

---

## 📝 Version

**Current**: v2.0.0 (Phase 2 Complete)
- Native Desktop GUI
- Settings management
- Port 80 support
- Modern UX

[See full changelog](docs/technical/CHANGELOG.md)

---

## 🔐 Security Note

⚠️ **Default credentials for development only!**
- Change passwords for production
- Don't expose ports publicly

---

## 🤝 Get Help

- 📖 [Documentation](docs/README.md)
- 🐛 Bug? Check logs first
- 💡 Feature request? See [roadmap](docs/technical/CHANGELOG.md)

---

## 🎉 Get Started!

```bash
cd /app/gui && bash run.sh
```

**Happy Coding!** 🚀

---

*NourProject - Making PHP development powerful, modern, and enjoyable!*

**Phase 2.5** ✨ *Clean Architecture*
