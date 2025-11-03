# 🎴 NourProject - Quick Reference Card

## 🚀 Quick Start

### Launch GUI
```bash
cd /app/gui && bash run.sh
```

### Launch CLI
```bash
bash scripts/start.sh
```

---

## 🎮 GUI Controls

| Button | Action | Shortcut |
|--------|--------|----------|
| ▶️ Start Services | Launch all containers | - |
| ⏹️ Stop Services | Stop all containers | - |
| 🔄 Refresh Status | Update status manually | - |
| ⚙️ Settings | Open configuration | - |
| 🌍 Open Main Site | Open localhost:8080 | - |
| 🗄️ Open phpMyAdmin | Open localhost:8081 | - |

---

## 🔧 CLI Commands

### Service Management
```bash
bash scripts/start.sh          # Start all services
bash scripts/stop.sh           # Stop all services
bash scripts/status.sh         # Check status
bash scripts/logs.sh all       # View logs
```

### PHP Version
```bash
bash scripts/switch-php.sh 8.1    # Switch to PHP 8.1
bash scripts/switch-php.sh 8.2    # Switch to PHP 8.2
bash scripts/switch-php.sh 8.3    # Switch to PHP 8.3
```

### Port Management
```bash
bash scripts/change-port.sh 80     # Use port 80
bash scripts/change-port.sh 8080   # Use port 8080
```

### Database
```bash
bash scripts/backup-db.sh      # Backup database
```

---

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Main Site** | http://localhost:8080 | - |
| **phpMyAdmin** | http://localhost:8081 | root / 041201 |
| **MySQL** | localhost:3306 | root / 041201 |

---

## 📊 Status Indicators

| Color | Meaning |
|-------|---------|
| 🟢 Green | Service running |
| 🔴 Red | Service stopped |

---

## ⚙️ Settings Panel

### Ports Tab
- **Web Server**: Default 8080, can use 80
- **phpMyAdmin**: Default 8081
- **MySQL**: Default 3306

### Database Tab
- **Name**: nour_db
- **User**: root
- **Password**: 041201 (changeable)

### Advanced Tab
- Container names
- Auto-restart policy

---

## 🐘 PHP Versions

| Version | Status |
|---------|--------|
| 8.1 | ✅ Available |
| 8.2 | ✅ Default |
| 8.3 | ✅ Available |

Switch via GUI or CLI

---

## 📁 Important Paths

```
/app/
├── gui/               # GUI application
├── www/               # Your PHP files
├── scripts/           # Management scripts
├── config/php/        # PHP configuration
└── data/mysql/        # MySQL data
```

---

## 🔑 Default Credentials

### MySQL / phpMyAdmin
- **Username**: root
- **Password**: 041201
- **Database**: nour_db
- **Host** (in PHP): db
- **Host** (external): localhost

---

## 🐛 Quick Troubleshooting

### GUI won't start
```bash
pip3 install --force-reinstall PySide6 psutil
```

### Services won't start
```bash
docker compose down
docker compose up -d
```

### Port already in use
```bash
sudo lsof -i :8080    # Check what's using port
# Or change port in Settings
```

### Permission denied
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## 💡 Pro Tips

1. **Keep GUI open** for real-time monitoring
2. **Check logs** when something fails
3. **Use Settings** instead of manual YAML edits
4. **Backup database** before major changes
5. **Port 80** requires sudo/docker group

---

## 📚 Documentation

| Topic | File |
|-------|------|
| Overview | README.md |
| GUI Guide | gui/README.md |
| Installation | GUI_INSTALLATION.md |
| Checklist | USER_CHECKLIST.md |
| Phase 2 Summary | PHASE_2_COMPLETE.md |

---

## 🆘 Need Help?

1. Check GUI log panel
2. Run: `bash scripts/status.sh`
3. Check: `docker compose logs`
4. Read documentation files
5. Review error messages

---

## 🎯 Common Tasks

### Start Fresh Development
```bash
cd /app/gui && bash run.sh
# Click ▶️ Start Services
# Open 🌍 Main Site
```

### Change to Port 80
```bash
# Via GUI: Settings → Ports → Use Port 80
# Via CLI: bash scripts/change-port.sh 80
```

### Switch PHP Version
```bash
# Via GUI: Select version → Switch & Rebuild
# Via CLI: bash scripts/switch-php.sh 8.3
```

### Backup Database
```bash
bash scripts/backup-db.sh
# Backup saved to: ./backups/
```

### View Logs
```bash
# Via GUI: Check log panel
# Via CLI: bash scripts/logs.sh all
```

---

## 🔄 Update Cycle

1. Stop services
2. Make changes (code/config)
3. Restart services
4. Test in browser
5. Check logs if issues

---

## 🎨 GUI Features

- ✅ Real-time status
- ✅ One-click control
- ✅ PHP switcher
- ✅ Settings panel
- ✅ Live logs
- ✅ Browser links
- ✅ Auto-refresh
- ✅ Dark theme

---

## 🚦 Status Meanings

### Services
- **Apache**: Web server for PHP
- **MySQL**: Database server
- **phpMyAdmin**: Database admin tool

### Operations
- **Start**: Launch containers
- **Stop**: Shutdown containers
- **Restart**: Stop then start
- **Rebuild**: Recreate containers

---

## ⌨️ File Locations

### Your Files
- **PHP files**: `/app/www/`
- **PHP config**: `/app/config/php/php.ini`
- **MySQL data**: `/app/data/mysql/`

### System Files
- **Docker config**: `/app/docker-compose.yml`
- **Scripts**: `/app/scripts/`
- **GUI app**: `/app/gui/`

---

## 📞 Quick Commands

```bash
# Start everything
cd /app/gui && bash run.sh

# Check status
bash scripts/status.sh

# View logs
bash scripts/logs.sh all

# Backup DB
bash scripts/backup-db.sh

# Change port
bash scripts/change-port.sh 80

# Switch PHP
bash scripts/switch-php.sh 8.3
```

---

## ✨ Remember

- **GUI** = Easy, visual, modern
- **CLI** = Fast, scriptable, powerful
- **Both** = Available anytime!

---

**NourProject - Your powerful PHP development environment! 🚀**

*Keep this card handy for quick reference!*
