# 🚀 Getting Started with NorexProject V3.6

**Quick start guide untuk memulai NOREX V3.6 Binary-based runtime!**

---

## 📋 Prasyarat

Minimal requirements:
- ✅ **Linux** (Ubuntu, Debian, CentOS, etc.)
- ✅ **2GB RAM** minimum
- ✅ **500MB disk space** untuk binaries
- ⚠️ **No Docker needed!** (Binary-based system)

Optional:
- ✅ **Node.js & Yarn** (untuk GUI development)

---

## 🎯 3 Langkah Mudah

### Step 1: Setup & Download Binaries (Pertama Kali Saja)

```bash
cd /app
bash scripts/verify_setup.sh
```

**Apa yang dilakukan:**
- ✅ Check binary requirements
- ✅ Auto-download Apache 2.4.62 (~12MB)
- ✅ Auto-download MySQL 8.4.3 (~64MB)
- ✅ Auto-download PHP 8.3.26 (~20MB)
- ✅ Auto-download phpMyAdmin 5.2.1 (~12MB)
- ✅ Extract semua binaries ke `/app/bin/`

**Output:** "Setup Verification Complete" ✅

**⏱️ Estimasi waktu:** 5-10 menit (tergantung koneksi internet)

---

### Step 2: Start Services

```bash
cd /app
bash scripts/start_services.sh
```

**Apa yang dilakukan:**
- ✅ Start MySQL database (port 3306)
- ✅ Start Apache web server (port 8080)
- ✅ Start phpMyAdmin (via Apache)
- ✅ Initialize data directories
- ✅ Configure services

**Output:**
```
═══════════════════════════════════
  ✅ Norex Services Running!
═══════════════════════════════════

🌍 http://localhost:8080
🛠 phpMyAdmin → http://localhost:8080/phpmyadmin

MySQL user: root
Password: 041201

Stop: bash scripts/stop_services.sh
Status: bash scripts/status_services.sh
```

---

### Step 3: Launch GUI (Pilih salah satu)

**Option A: GUI Desktop (Recommended)**
```bash
bash norex.sh gui
```

**Option B: Browser**
```bash
bash norex.sh open
```

**Selesai!** 🎉

---

## 🎨 Using GUI (Desktop)

Setelah `bash norex.sh gui`:

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
bash norex.sh help
```

**Quick Commands:**

```bash
# Service Management
bash norex.sh start          # Start services
bash norex.sh stop           # Stop services
bash norex.sh restart        # Restart services
bash norex.sh status         # Check status

# GUI
bash norex.sh gui            # Launch GUI

# PHP Management
bash norex.sh php 8.3        # Switch to PHP 8.3
bash norex.sh php-info       # Show PHP version

# Python CLI
bash norex.sh python         # Interactive Python shell
bash norex.sh python 'code'  # Execute Python code

# Database
bash norex.sh db-backup      # Backup database
bash norex.sh db-shell       # MySQL shell

# Utilities
bash norex.sh verify         # Health check
bash norex.sh open           # Open main site
bash norex.sh pma            # Open phpMyAdmin
bash norex.sh info           # System info
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
bash norex.sh status

# View logs
bash norex.sh logs

# Restart everything
bash norex.sh restart
```

### GUI Not Working
```bash
# Install dependencies
pip3 install PySide6 psutil

# Or run setup again
bash norex.sh setup
```

### Port Already in Use
```bash
# Launch GUI and change port via Settings ⚙️
bash norex.sh gui
# Click ⚙️ → Ports → Change port → Save
# Restart services
```

---

## 🔄 Daily Workflow

**Morning:**
```bash
bash norex.sh start          # Start services
bash norex.sh gui            # Launch GUI (optional)
```

**Development:**
- Edit files in `/app/www/`
- Changes reflect immediately (hot reload)
- Use GUI for service control
- Use `bash norex.sh python` for Python scripts

**Evening:**
```bash
bash norex.sh stop           # Stop services (optional)
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
bash norex.sh python 'import requests; print(requests.get("http://localhost:8080").text)'

# Or create script files
echo 'print("Hello NorexProject!")' > test.py
bash norex.sh python test.py
```

### 4. Database Backup Berkala
```bash
# Backup database
bash norex.sh db-backup

# Backup saved di project root dengan timestamp
```

### 5. PHP Version Switching
```bash
# Test aplikasi di PHP berbeda
bash norex.sh php 8.1
bash norex.sh php 8.2
bash norex.sh php 8.3
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
bash norex.sh shell
# Inside container:
composer require vendor/package
exit
```

### Database Operations
```bash
# Shell
bash norex.sh db-shell
# Inside MySQL:
SHOW DATABASES;
USE norex_db;
SHOW TABLES;

# Backup
bash norex.sh db-backup
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
bash norex.sh python automation.py
```

---

## 🆘 Need Help?

```bash
# Quick health check
bash norex.sh verify

# System information
bash norex.sh info

# View all commands
bash norex.sh help
```

**Documentation:** `/app/docs/`

---

## 🎉 You're Ready!

Sekarang Anda sudah siap menggunakan NorexProject!

**Workflow sederhana:**
1. `bash norex.sh start` → Services running
2. `bash norex.sh gui` → GUI launched
3. Right-click untuk quick actions
4. Code di `/app/www/`
5. Enjoy! 🚀

---

*NorexProject - Making PHP development powerful, modern, and enjoyable!*
