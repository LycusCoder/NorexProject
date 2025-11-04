# 🚀 NorexProject - Quick Start Guide

## ⚡ Instant Commands

### Start Everything
```bash
cd /path/to/NorexProject
bash scripts/start.sh
```

### Access URLs
- 🌐 **Website**: http://localhost:8080
- 🧪 **Test Page**: http://localhost:8080/db_test.php
- 🛠️ **phpMyAdmin**: http://localhost:8081 (root / 041201)

### Stop Everything
```bash
bash scripts/stop.sh
```

---

## 🔧 Common Tasks

### Check Status
```bash
bash scripts/status.sh
```

### Switch PHP Version
```bash
# Switch to PHP 8.3
bash scripts/switch-php.sh 8.3

# Switch to PHP 8.1
bash scripts/switch-php.sh 8.1

# Back to PHP 8.2
bash scripts/switch-php.sh 8.2
```

### View Logs
```bash
# All logs
bash scripts/logs.sh all

# Specific service
bash scripts/logs.sh web
bash scripts/logs.sh db
bash scripts/logs.sh pma
```

### Backup Database
```bash
bash scripts/backup-db.sh
# Saved to: ./backups/norex_db_YYYYMMDD_HHMMSS.sql
```

---

## 📝 Database Connection

### PHP Connection Info
```php
Host: 'db'              // Important: use 'db', not 'localhost'!
Database: 'norex_db'
Username: 'root'
Password: '041201'
```

### MySQLi Example
```php
<?php
$conn = new mysqli('db', 'root', '041201', 'norex_db');
if ($conn->connect_error) {
    die("Error: " . $conn->connect_error);
}
echo "Connected!";
$conn->close();
?>
```

### PDO Example
```php
<?php
$pdo = new PDO('mysql:host=db;dbname=norex_db', 'root', '041201');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>
```

---

## 📂 Where to Put Your Files

```
NorexProject/
└── www/                 ← Put your PHP files here!
    ├── index.php        ← Homepage
    ├── db_test.php      ← Test page
    └── your-app.php     ← Your new files
```

---

## 🎯 Pro Tips

1. **Changes are instant** - No need to restart after editing PHP files!
2. **Use `db` as hostname** - Not `localhost` or `127.0.0.1`
3. **Backup before experiments** - `bash scripts/backup-db.sh`
4. **Check logs for errors** - `bash scripts/logs.sh all`
5. **Status check anytime** - `bash scripts/status.sh`

---

## 🆘 Troubleshooting

### Port Already Used?
Edit `docker-compose.yml` and change:
- `"8080:80"` → `"8090:80"`
- `"8081:80"` → `"8091:80"`
- `"3306:3306"` → `"3307:3306"`

### Container Won't Start?
```bash
bash scripts/logs.sh all      # Check errors
docker compose ps             # Check status
bash scripts/reset.sh         # Nuclear option (deletes data!)
```

### Can't Connect to Database?
1. Wait 10-15 seconds after starting
2. Check container: `docker compose ps`
3. Verify password in `docker-compose.yml`
4. Use `db` as host, not `localhost`

---

## 🏆 Better Than Laragon/XAMPP Because:

✅ Works on **Linux, macOS, Windows**  
✅ **Isolated environment** (no conflicts!)  
✅ **Easy version switching**  
✅ **Git-friendly** setup  
✅ **One command** to start/stop  
✅ **Auto-restart** on crashes  
✅ **Built-in backup** tools  
✅ **Modern stack** (PHP 8.2, MySQL 8.0)  

---

## 🎉 You're Ready!

**Start coding in `www/` folder and enjoy!**

Need help? Check the full README.md for detailed documentation.
