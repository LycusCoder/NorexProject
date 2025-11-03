# 🚀 Getting Started with NourProject

**Quick start guide untuk memulai NourProject dari awal sampai running!**

---

## 📋 Prasyarat

Pastikan sudah terinstall:
- ✅ **Docker** (dan sedang running)
- ✅ **Python 3** (optional, untuk GUI)

---

## 🎯 3 Langkah Mudah

### Step 1: Setup (Pertama Kali Saja)

```bash
cd /app
bash nour.sh setup
```

**Apa yang dilakukan:**
- ✅ Check semua requirement (Docker, Python)
- ✅ Install GUI dependencies (PySide6, psutil)
- ✅ Build Docker images
- ✅ Setup directories
- ✅ Set permissions

**Output:** "Setup Complete!" ✅

---

### Step 2: Start Services

```bash
bash nour.sh start
```

**Apa yang dilakukan:**
- ✅ Start Apache web server
- ✅ Start MySQL database
- ✅ Start phpMyAdmin

**Output:** Services running! 🚀

---

### Step 3: Launch GUI (Pilih salah satu)

**Option A: GUI Desktop (Recommended)**
```bash
bash nour.sh gui
```

**Option B: Browser**
```bash
bash nour.sh open
```

**Selesai!** 🎉

---

## 🎨 Using GUI (Desktop)

Setelah `bash nour.sh gui`:

1. **Window muncul** dengan status indicators
2. **Right-click di mana saja** untuk context menu:
   - Start/Stop/Restart Services
   - Check Status
   - Python CLI
   - View Logs
   - Backup Database
3. **Click ⚙️ icon** di toolbar untuk settings
4. **Status indicators** menunjukkan service status real-time

---

## 🌐 Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Main Site** | http://localhost:8080 | - |
| **phpMyAdmin** | http://localhost:8081 | root / 041201 |
| **MySQL** | localhost:3306 | root / 041201 |

---

## 📚 All Available Commands

Lihat semua command yang tersedia:

```bash
bash nour.sh help
```

**Quick Commands:**

```bash
# Service Management
bash nour.sh start          # Start services
bash nour.sh stop           # Stop services
bash nour.sh restart        # Restart services
bash nour.sh status         # Check status

# GUI
bash nour.sh gui            # Launch GUI

# PHP Management
bash nour.sh php 8.3        # Switch to PHP 8.3
bash nour.sh php-info       # Show PHP version

# Python CLI
bash nour.sh python         # Interactive Python shell
bash nour.sh python 'code'  # Execute Python code

# Database
bash nour.sh db-backup      # Backup database
bash nour.sh db-shell       # MySQL shell

# Utilities
bash nour.sh verify         # Health check
bash nour.sh open           # Open main site
bash nour.sh pma            # Open phpMyAdmin
bash nour.sh info           # System info
```

---

## 🐛 Troubleshooting

### Docker Not Running
```bash
# Linux
sudo systemctl start docker

# Mac/Windows
# Start Docker Desktop
```

### Services Not Starting
```bash
# Check what's wrong
bash nour.sh status

# View logs
bash nour.sh logs

# Restart everything
bash nour.sh restart
```

### GUI Not Working
```bash
# Install dependencies
pip3 install PySide6 psutil

# Or run setup again
bash nour.sh setup
```

### Port Already in Use
```bash
# Launch GUI and change port via Settings ⚙️
bash nour.sh gui
# Click ⚙️ → Ports → Change port → Save
# Restart services
```

---

## 🔄 Daily Workflow

**Morning:**
```bash
bash nour.sh start          # Start services
bash nour.sh gui            # Launch GUI (optional)
```

**Development:**
- Edit files in `/app/www/`
- Changes reflect immediately (hot reload)
- Use GUI for service control
- Use `bash nour.sh python` for Python scripts

**Evening:**
```bash
bash nour.sh stop           # Stop services (optional)
# Or just close - services keep running
```

---

## 💡 Pro Tips

### 1. Keep GUI Running
Launch GUI di pagi hari dan minimize to tray - easy access sepanjang hari!

### 2. Use Context Menu
Right-click di GUI untuk quick access ke semua fungsi.

### 3. Python CLI for Automation
```bash
# Quick scripts
bash nour.sh python 'import requests; print(requests.get("http://localhost:8080").text)'

# Or create script files
echo 'print("Hello NourProject!")' > test.py
bash nour.sh python test.py
```

### 4. Database Backup Berkala
```bash
# Backup database
bash nour.sh db-backup

# Backup saved di project root dengan timestamp
```

### 5. PHP Version Switching
```bash
# Test aplikasi di PHP berbeda
bash nour.sh php 8.1
bash nour.sh php 8.2
bash nour.sh php 8.3
```

---

## 📖 Next Steps

1. **Explore Documentation:** `/app/docs/`
2. **Read Quick Start:** `/app/docs/guides/PHASE_3_QUICK_START.md`
3. **Read Complete Guide:** `/app/docs/guides/PHASE_3_COMPLETE.md`
4. **Check Changelog:** `/app/docs/technical/CHANGELOG.md`

---

## 🎯 Common Tasks

### Create New PHP Project
```bash
cd /app/www
mkdir my-project
cd my-project
echo '<?php phpinfo(); ?>' > index.php
# Open: http://localhost:8080/my-project/
```

### Install PHP Package (Composer)
```bash
bash nour.sh shell
# Inside container:
composer require vendor/package
exit
```

### Database Operations
```bash
# Shell
bash nour.sh db-shell
# Inside MySQL:
SHOW DATABASES;
USE nour_db;
SHOW TABLES;

# Backup
bash nour.sh db-backup
```

### Python Automation
```bash
# Create automation script
cat > automation.py << 'EOF'
import requests
import json

# Check if web server is up
response = requests.get('http://localhost:8080')
print(f'Status: {response.status_code}')
print(f'PHP Version detected!')
EOF

# Run it
bash nour.sh python automation.py
```

---

## 🆘 Need Help?

```bash
# Quick health check
bash nour.sh verify

# System information
bash nour.sh info

# View all commands
bash nour.sh help
```

**Documentation:** `/app/docs/`

---

## 🎉 You're Ready!

Sekarang Anda sudah siap menggunakan NourProject!

**Workflow sederhana:**
1. `bash nour.sh start` → Services running
2. `bash nour.sh gui` → GUI launched
3. Right-click untuk quick actions
4. Code di `/app/www/`
5. Enjoy! 🚀

---

*NourProject - Making PHP development powerful, modern, and enjoyable!*
