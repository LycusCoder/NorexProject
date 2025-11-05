# 🚀 NOREX V3.6 - Quick Start Guide

## 📋 Prerequisites Checklist

Before starting services, ensure:
- ✅ All scripts are executable (`chmod +x scripts/**/*.sh`)
- ✅ Binary download URLs updated in `config/downloads.yaml`
- ✅ Internet connection available (for first-time binary download)
- ✅ Ports 8080 and 3306 are available

---

## 🎯 Quick Commands

### Check Services Status
```bash
cd /app
bash scripts/status_services.sh
```

### Start All Services
```bash
bash scripts/start_services.sh
```

### Stop All Services
```bash
bash scripts/stop_services.sh
```

### Verify Setup (Download Binaries)
```bash
bash scripts/verify_setup.sh
```

---

## 🖥️ GUI Usage

### Launch GUI
```bash
cd /app/gui
yarn dev
```

**Features:**
- **Start Button:** Starts all services (MySQL → Apache → phpMyAdmin)
- **Stop Button:** Stops all services gracefully
- **Status:** Auto-updates every 5 seconds
- **Filter:** Toggle "Running Only" to show/hide stopped services

---

## 📊 Service Management

### Individual Service Control

**MySQL:**
```bash
bash scripts/services/service_mysql.sh start|stop|restart|status
```

**Apache:**
```bash
bash scripts/services/service_apache.sh start|stop|restart|reload|status
```

**phpMyAdmin:**
```bash
bash scripts/services/service_phpmyadmin.sh start|stop|restart|status
```

---

## 🔗 Access Points

Once services are running:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Main Site** | http://localhost:8080 | - |
| **phpMyAdmin** | http://localhost:8080/phpmyadmin | root / 041201 |
| **MySQL** | localhost:3306 | root / 041201 |

---

## 📁 Important Directories

```
/app/
├── bin/                    # Binaries (auto-downloaded)
│   ├── apache/
│   ├── mysql/
│   ├── php/
│   └── phpmyadmin/
├── scripts/                # Service management scripts
│   ├── services/          # Individual service scripts
│   └── utils/             # Utility scripts
├── logs/                   # All service logs
├── config/                 # Configuration files
│   ├── downloads.yaml     # Binary download sources
│   └── services.yaml      # Service configurations
└── www/                    # Web document root
```

---

## 🐛 Troubleshooting

### Services Won't Start

**1. Check Binary Installation:**
```bash
ls -la bin/apache/ bin/mysql/ bin/php/
```
If empty, run:
```bash
bash scripts/verify_setup.sh
```

**2. Check Logs:**
```bash
tail -f logs/service_*.log
```

**3. Check Port Conflicts:**
```bash
lsof -i :8080  # Apache
lsof -i :3306  # MySQL
```

### GUI Shows "Command Failed"

**1. Check Script Permissions:**
```bash
ls -la scripts/*.sh scripts/services/*.sh
```
Should show `-rwxr-xr-x` (executable).

**2. Check Logs:**
```bash
cat logs/gui_status.log
cat logs/start_services.log
```

**3. Manual Test:**
```bash
cd /app
/bin/bash scripts/status_services.sh
```

### Binary Download Fails

**1. Check URLs:**
```bash
cat config/downloads.yaml
```

**2. Test Download Manually:**
```bash
wget -O test.tar.gz "YOUR_DOWNLOAD_URL"
```

**3. Check Logs:**
```bash
cat logs/download.log
```

---

## 🔧 Configuration

### Update Binary URLs

Edit `/app/config/downloads.yaml`:
```yaml
binaries:
  apache:
    version: "2.4.62"
    url: "https://your-mirror.com/apache.tar.gz"
  mysql:
    version: "8.4.3"
    url: "https://your-mirror.com/mysql.tar.gz"
  # ... etc
```

### Update Service Ports

Edit `/app/config/services.yaml`:
```yaml
services:
  apache:
    port: "8080"  # Change this
  mysql:
    port: "3306"  # Change this
```

**Note:** After changing ports, also update service scripts and restart services.

---

## 📝 Logs

All logs are stored in `/app/logs/`:

| Log File | Purpose |
|----------|---------|
| `start_services.log` | Service startup logs |
| `stop_services.log` | Service shutdown logs |
| `service_apache.log` | Apache operations |
| `service_mysql.log` | MySQL operations |
| `service_phpmyadmin.log` | phpMyAdmin operations |
| `gui_status.log` | GUI status checks |
| `download.log` | Binary downloads |
| `extract.log` | Binary extraction |

**View logs in real-time:**
```bash
tail -f logs/service_*.log
```

---

## 🔄 Service Dependencies

Services start in this order:
1. **MySQL** (no dependencies)
2. **Apache** (no dependencies)
3. **phpMyAdmin** (requires Apache + MySQL)

Services stop in reverse order:
1. **phpMyAdmin**
2. **Apache**
3. **MySQL**

---

## ⚡ Tips & Best Practices

1. **Always check status before starting:**
   ```bash
   bash scripts/status_services.sh
   ```

2. **Stop services before system shutdown:**
   ```bash
   bash scripts/stop_services.sh
   ```

3. **Monitor logs during first start:**
   ```bash
   tail -f logs/start_services.log
   ```

4. **Keep binaries updated:**
   - Update URLs in `config/downloads.yaml`
   - Delete old binaries in `bin/`
   - Run `bash scripts/verify_setup.sh`

5. **Backup MySQL data:**
   ```bash
   cp -r bin/mysql/data bin/mysql/data.backup
   ```

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs:** `/app/logs/`
2. **Check Binary Installation:** `/app/bin/`
3. **Check Permissions:** All scripts executable?
4. **Check Ports:** No conflicts?
5. **Manual Test:** Run scripts directly from terminal

**Still stuck?** Check `/app/OPTION_A_IMPLEMENTATION.md` for detailed implementation notes.

---

## 🎉 Success Indicators

Everything is working when:

✅ `bash scripts/status_services.sh` shows all services running
✅ http://localhost:8080 displays your site
✅ http://localhost:8080/phpmyadmin shows phpMyAdmin login
✅ GUI shows all services with ✔ icon
✅ No errors in logs

---

**Version:** NOREX V3.6
**Last Updated:** November 5, 2025
