# 🚀 NourProject

**Sistem Development PHP yang lebih powerful dari Laragon & XAMPP!**

## 🌟 Fitur Utama

- ✅ **Multi-version PHP Support** (8.1, 8.2, 8.3)
- ✅ **Easy Version Switching** (seperti Laragon)
- ✅ **All Essential PHP Extensions** (mysqli, pdo, gd, zip, intl, opcache, dll)
- ✅ **MySQL 8.0** dengan phpMyAdmin
- ✅ **Docker-based** (cross-platform: Linux, macOS, Windows)
- ✅ **Auto-restart** untuk development yang smooth
- ✅ **Complete Tooling** (backup, logs, status monitoring)

## 📦 Tech Stack

- **Web Server**: Apache 2.4
- **PHP**: 8.2 (switchable ke 8.1 atau 8.3)
- **Database**: MySQL 8.0
- **Admin Tool**: phpMyAdmin
- **Container**: Docker & Docker Compose

## 🚀 Quick Start

### 1. Start Services
```bash
bash scripts/start.sh
```

### 2. Access Points
- **Main Site**: http://localhost:8080
- **Database Test**: http://localhost:8080/db_test.php
- **phpMyAdmin**: http://localhost:8081
  - Username: `root`
  - Password: `041201`

### 3. Stop Services
```bash
bash scripts/stop.sh
```

## 🔧 Command Reference

### Service Management
```bash
# Start all services
bash scripts/start.sh

# Stop all services
bash scripts/stop.sh

# Check status
bash scripts/status.sh

# View logs
bash scripts/logs.sh [web|db|pma|all]
```

### PHP Version Switching (Laragon Style!)
```bash
# Switch to PHP 8.1
bash scripts/switch-php.sh 8.1

# Switch to PHP 8.3
bash scripts/switch-php.sh 8.3

# List available versions
bash scripts/switch-php.sh
```

### Database Management
```bash
# Backup database
bash scripts/backup-db.sh

# Backups saved to: ./backups/
```

### Advanced
```bash
# Complete reset (WARNING: deletes all data!)
bash scripts/reset.sh
```

## 📁 Project Structure

```
NourProject/
├── www/                  # Your PHP files here
│   ├── index.php
│   └── db_test.php
├── config/
│   └── php/
│       └── php.ini       # PHP configuration
├── data/
│   └── mysql/            # MySQL data (persistent)
├── backups/              # Database backups
├── scripts/              # Management scripts
│   ├── start.sh
│   ├── stop.sh
│   ├── status.sh
│   ├── switch-php.sh
│   ├── logs.sh
│   ├── backup-db.sh
│   └── reset.sh
├── Dockerfile
└── docker-compose.yml
```

## 📚 PHP Extensions Included

- **Database**: mysqli, pdo, pdo_mysql
- **Image**: gd (with freetype & jpeg)
- **Compression**: zip
- **Internationalization**: intl, mbstring
- **Performance**: opcache
- **Others**: bcmath, exif, pcntl, soap, curl, json

## 🔌 Database Connection

### Using MySQLi
```php
<?php
$conn = new mysqli('db', 'root', '041201', 'nour_db');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
$conn->close();
?>
```

### Using PDO
```php
<?php
try {
    $pdo = new PDO('mysql:host=db;dbname=nour_db', 'root', '041201');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
```

## ⚙️ Configuration

### Change PHP Settings
Edit `config/php/php.ini` and restart:
```bash
bash scripts/stop.sh
bash scripts/start.sh
```

### Change MySQL Password
1. Edit `docker-compose.yml`
2. Update both `MYSQL_ROOT_PASSWORD` values
3. Reset and restart:
```bash
bash scripts/reset.sh
bash scripts/start.sh
```

## 🎯 Keunggulan vs Laragon/XAMPP

| Feature | NourProject | Laragon | XAMPP |
|---------|-------------|---------|-------|
| Cross-platform | ✅ | ❌ (Windows only) | ✅ |
| Version Switching | ✅ | ✅ | ❌ |
| Isolated Environment | ✅ | ❌ | ❌ |
| Easy Backup | ✅ | ❌ | ❌ |
| All Extensions | ✅ | ✅ | ⚠️ |
| Modern Stack | ✅ | ✅ | ⚠️ |
| Git-friendly | ✅ | ⚠️ | ⚠️ |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the ports
sudo lsof -i :8080
sudo lsof -i :8081
sudo lsof -i :3306

# Kill the process or change ports in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
bash scripts/logs.sh all

# Try rebuilding
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Database Connection Error
1. Check if MySQL container is running: `docker compose ps`
2. Verify password in docker-compose.yml
3. Wait 10 seconds after starting for MySQL to initialize

## 📝 Development Tips

1. **Place your PHP files in `www/` folder**
2. **Changes are reflected immediately** (hot reload enabled)
3. **Use `db` as database host** (not `localhost` or `127.0.0.1`)
4. **Backup regularly** with `bash scripts/backup-db.sh`
5. **Check status** with `bash scripts/status.sh`

## 🔐 Security Notes

- Default password `041201` is for **development only**
- Change passwords for production use
- Don't expose ports to public networks
- Keep Docker updated

## 💬 Support

For issues or questions:
1. Check logs: `bash scripts/logs.sh all`
2. Check status: `bash scripts/status.sh`
3. Try reset: `bash scripts/reset.sh`

## 🎉 Enjoy!

NourProject - Development environment yang powerful, modern, dan mudah digunakan!

**Happy Coding! 🚀**