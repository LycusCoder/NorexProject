# 📦 NorexProject - Installation Guide

Panduan instalasi lengkap NorexProject di Linux (Ubuntu/Debian based).

---

## 📋 Prerequisites

### 1. System Requirements
- **OS**: Linux (Ubuntu 20.04+, Debian 11+, atau distro modern lainnya)
- **RAM**: Minimal 2GB (recommended 4GB+)
- **Disk**: Minimal 2GB free space
- **Processor**: x86_64 architecture

### 2. Required Software
- Docker Engine (20.10+)
- Docker Compose (2.0+)

---

## 🚀 Installation Steps

### Step 1: Install Docker

#### Ubuntu/Debian:
```bash
# Update package index
sudo apt-get update

# Install dependencies
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

#### Alternative: Using Docker's convenience script
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Step 2: Post-Installation Setup

#### Allow running Docker without sudo:
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Apply changes (logout and login, or run):
newgrp docker

# Test
docker run hello-world
```

#### Enable Docker to start on boot:
```bash
sudo systemctl enable docker
sudo systemctl start docker
```

### Step 3: Verify Installation

```bash
# Check if Docker is running
docker info

# Check Docker Compose
docker compose version

# Should output something like:
# Docker Compose version v2.x.x
```

---

## 📥 Get NorexProject

### Option 1: Clone from Git (if available)
```bash
git clone <your-repo-url> NorexProject
cd NorexProject
```

### Option 2: Download ZIP
```bash
# Extract the downloaded NorexProject.zip
unzip NorexProject.zip
cd NorexProject
```

### Option 3: Manual Setup
```bash
# Create directory
mkdir -p NorexProject
cd NorexProject

# Copy all NorexProject files here
# Make sure you have:
#   - Dockerfile
#   - docker-compose.yml
#   - www/ folder
#   - config/ folder
#   - scripts/ folder
```

---

## ✅ Verify Setup

Run the system check:
```bash
bash scripts/check-system.sh
```

If all checks pass, you're ready!

---

## 🎯 First Run

### Start NorexProject:
```bash
bash scripts/start.sh
```

This will:
1. ✅ Build Docker image (first time only, ~3-5 minutes)
2. ✅ Start all containers (Apache, MySQL, phpMyAdmin)
3. ✅ Initialize database
4. ✅ Show access URLs

### Test Installation:

Open in browser:
- **Main Site**: http://localhost:8080
- **Database Test**: http://localhost:8080/db_test.php ← Check this first!
- **phpMyAdmin**: http://localhost:8081

Expected results:
- ✅ PHP Version showing
- ✅ MySQLi Extension Active (green)
- ✅ PDO MySQL Extension Active (green)
- ✅ Database Connection successful
- ✅ All extensions loaded

---

## 🔧 Configuration

### Change Database Password:

1. Edit `docker-compose.yml`:
```yaml
services:
  db:
    environment:
      MYSQL_ROOT_PASSWORD: YOUR_NEW_PASSWORD  # Change here
  
  pma:
    environment:
      MYSQL_ROOT_PASSWORD: YOUR_NEW_PASSWORD  # And here
```

2. Edit `config/php/php.ini`:
```ini
mysqli.default_pw = YOUR_NEW_PASSWORD
```

3. Reset and restart:
```bash
bash scripts/reset.sh
bash scripts/start.sh
```

### Change Ports (if 8080/8081/3306 are in use):

Edit `docker-compose.yml`:
```yaml
services:
  web:
    ports:
      - "8090:80"    # Change 8080 to 8090 (or any free port)
  
  pma:
    ports:
      - "8091:80"    # Change 8081 to 8091
  
  db:
    ports:
      - "3307:3306"  # Change 3306 to 3307
```

Restart: `bash scripts/stop.sh && bash scripts/start.sh`

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to Docker daemon"
**Solution:**
```bash
# Start Docker service
sudo systemctl start docker

# Or for Docker Desktop
# Launch Docker Desktop application
```

### Issue: "Port already in use"
**Solution:**
```bash
# Find what's using the port
sudo lsof -i :8080
sudo lsof -i :3306

# Kill the process or change NorexProject ports (see Configuration above)
```

### Issue: "Permission denied" errors
**Solution:**
```bash
# Make sure you're in docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended)
sudo bash scripts/start.sh
```

### Issue: Build fails or containers crash
**Solution:**
```bash
# Check logs
bash scripts/logs.sh all

# Clean everything and rebuild
docker compose down -v
docker system prune -a
bash scripts/start.sh
```

### Issue: "MySQLi Extension NOT Active"
**Solution:**
```bash
# Rebuild from scratch
bash scripts/stop.sh
docker compose build --no-cache
bash scripts/start.sh
```

### Issue: Can't connect to database in PHP
**Solution:**
- Use `db` as hostname, NOT `localhost`
- Wait 10-15 seconds after starting for MySQL to initialize
- Check password matches in docker-compose.yml
- Verify with: `bash scripts/status.sh`

---

## 🎓 Next Steps

1. ✅ Read [QUICK_START.md](QUICK_START.md) for daily usage
2. ✅ Read [README.md](README.md) for full documentation
3. ✅ Start coding in `www/` folder
4. ✅ Try switching PHP versions: `bash scripts/switch-php.sh 8.3`
5. ✅ Create your first backup: `bash scripts/backup-db.sh`

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [phpMyAdmin Documentation](https://www.phpmyadmin.net/docs/)

---

## 🎉 Installation Complete!

You now have a development environment that's:
- ✅ More powerful than Laragon
- ✅ More flexible than XAMPP
- ✅ Cross-platform compatible
- ✅ Production-ready stack

**Happy Coding! 🚀**

---

## 💡 Pro Tips

1. **Create alias for easier access:**
```bash
# Add to ~/.bashrc or ~/.zshrc
alias norex-start="cd ~/NorexProject && bash scripts/start.sh"
alias norex-stop="cd ~/NorexProject && bash scripts/stop.sh"
alias norex-status="cd ~/NorexProject && bash scripts/status.sh"

# Reload shell
source ~/.bashrc
```

2. **Create desktop shortcut (GNOME):**
```bash
cat > ~/Desktop/NorexProject.desktop << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=NorexProject
Comment=Start NorexProject Development Environment
Exec=bash -c "cd ~/NorexProject && bash scripts/start.sh; exec bash"
Icon=utilities-terminal
Terminal=true
Categories=Development;
EOF

chmod +x ~/Desktop/NorexProject.desktop
```

3. **Backup automation:**
```bash
# Add to crontab for daily backups at 2 AM
crontab -e
# Add line:
0 2 * * * cd ~/NorexProject && bash scripts/backup-db.sh
```

---

Need help? Check logs with `bash scripts/logs.sh all`
