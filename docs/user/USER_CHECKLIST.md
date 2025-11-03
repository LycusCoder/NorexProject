# ✅ NourProject Phase 2 - User Checklist

## 🎯 Getting Started with GUI

### Step 1: Verify Installation
```bash
# Check Python
python3 --version
# Should show: Python 3.8 or higher

# Check Docker
docker --version
# Should show: Docker version 20.x or higher
```

### Step 2: Install Dependencies
```bash
# Install GUI dependencies
pip3 install PySide6 psutil

# For Linux, install system libraries (if needed)
# See GUI_INSTALLATION.md for OS-specific commands
```

### Step 3: Launch GUI
```bash
cd /app/gui
bash run.sh
```

**Expected Result**: GUI window should open with dark theme

---

## 🧪 Feature Testing Checklist

### Basic Operations
- [ ] GUI opens without errors
- [ ] Window displays properly
- [ ] Dark theme is applied
- [ ] Welcome message appears in log panel

### Service Status
- [ ] Status indicators visible (3 lights)
- [ ] Indicators show correct status (red for stopped)
- [ ] Auto-refresh works (wait 5 seconds, status updates)
- [ ] Hover tooltips show service names

### Service Control
- [ ] Click "▶️ Start Services" button
- [ ] Log panel shows startup output
- [ ] Status indicators turn green
- [ ] Services actually start (check with `docker ps`)
- [ ] Click "⏹️ Stop Services" button
- [ ] Services actually stop
- [ ] Status indicators turn red
- [ ] Click "🔄 Refresh Status" button
- [ ] Status updates immediately

### PHP Version Switcher
- [ ] Dropdown shows 3 versions (8.1, 8.2, 8.3)
- [ ] Select a different version
- [ ] Click "Switch & Rebuild"
- [ ] Confirmation dialog appears
- [ ] Click "Yes" to confirm
- [ ] Log shows rebuild progress
- [ ] Process completes successfully
- [ ] PHP version actually changes (check http://localhost:8080)

### Settings Panel
- [ ] Click "⚙️ Settings" button
- [ ] Settings dialog opens
- [ ] Three tabs visible: Ports, Database, Advanced

#### Ports Tab
- [ ] Current ports loaded correctly
- [ ] Web port shows 8080 (or your current setting)
- [ ] PMA port shows 8081
- [ ] MySQL port shows 3306
- [ ] Can change web port value
- [ ] "Use Port 80" button works
- [ ] "Use Port 8080" button works

#### Database Tab
- [ ] Database name shows: nour_db
- [ ] Username shows: root
- [ ] Password shows: 041201 (hidden)
- [ ] "Show Password" checkbox works
- [ ] Can change values

#### Advanced Tab
- [ ] Container names displayed
- [ ] Auto-restart checkbox works

#### Settings Save
- [ ] Click "💾 Save & Apply"
- [ ] Validation works (try duplicate ports)
- [ ] Port 80 warning shows (if applicable)
- [ ] Confirmation dialog appears
- [ ] Settings save successfully
- [ ] Backup file created (.backup)
- [ ] docker-compose.yml updated correctly

### Quick Access
- [ ] Click "🌍 Open Main Site"
- [ ] Browser opens to http://localhost:8080
- [ ] Click "🗄️ Open phpMyAdmin"
- [ ] Browser opens to http://localhost:8081

### Log Panel
- [ ] Logs display in terminal green color
- [ ] Auto-scroll works (logs scroll to bottom)
- [ ] Emoji indicators visible
- [ ] Output is readable
- [ ] Scrollbar works for history

### Auto-Refresh
- [ ] Start services
- [ ] Keep GUI open
- [ ] Wait 5 seconds
- [ ] Status refreshes automatically (no manual action)
- [ ] Indicators stay accurate

---

## 🔧 Advanced Testing

### Port 80 Configuration
1. Open Settings
2. Change web port to 80
3. Save & Apply
4. If you get permission error:
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```
5. Restart services
6. Access http://localhost (no :80 needed)

### PHP Version Complete Cycle
1. Start with PHP 8.2 (default)
2. Switch to 8.1 → verify at http://localhost:8080
3. Switch to 8.3 → verify at http://localhost:8080
4. Switch back to 8.2 → verify at http://localhost:8080

### Database Configuration
1. Open Settings → Database tab
2. Change password to something else (e.g., "newpass123")
3. Save & Apply
4. Restart services
5. Try accessing phpMyAdmin with new password
6. Should work with new credentials

### Error Handling
- [ ] Try starting already running services (should show message)
- [ ] Try stopping already stopped services (should show message)
- [ ] Try duplicate ports in settings (should show warning)
- [ ] Try invalid port numbers (should validate)

---

## 🐛 Troubleshooting Checklist

### GUI Won't Start
- [ ] Python version is 3.8+
- [ ] PySide6 is installed: `pip3 list | grep PySide6`
- [ ] System libraries installed (Linux)
- [ ] No import errors in terminal

### Status Not Updating
- [ ] Docker is running: `docker info`
- [ ] Containers exist: `docker ps -a`
- [ ] Container names match: nour_apache, nour_mysql, nour_pma
- [ ] No errors in log panel

### Services Won't Start
- [ ] Ports not in use: `sudo lsof -i :8080`
- [ ] Docker has permissions
- [ ] docker-compose.yml is valid
- [ ] Check logs: `docker compose logs`

### Settings Won't Save
- [ ] docker-compose.yml is writable
- [ ] YAML syntax is valid
- [ ] No port conflicts
- [ ] Backup file gets created

---

## 📊 Performance Checklist

### Response Time
- [ ] GUI opens in < 2 seconds
- [ ] Button clicks respond immediately
- [ ] Status refresh is fast (< 1 second)
- [ ] Settings dialog opens instantly

### Resource Usage
- [ ] GUI uses reasonable CPU (< 5% when idle)
- [ ] GUI uses reasonable memory (< 200MB)
- [ ] No memory leaks (check after extended use)

### Stability
- [ ] No crashes during normal operation
- [ ] No freezing during long operations
- [ ] Handles errors gracefully
- [ ] Can recover from failures

---

## ✨ Quality Assurance

### UI/UX
- [ ] Interface is intuitive
- [ ] Colors are readable
- [ ] Buttons are clearly labeled
- [ ] Feedback is immediate
- [ ] Errors are user-friendly

### Functionality
- [ ] All features work as documented
- [ ] No broken buttons
- [ ] No silent failures
- [ ] Validation prevents errors

### Documentation
- [ ] README is clear and complete
- [ ] Installation guide works
- [ ] Examples are accurate
- [ ] Troubleshooting helps

---

## 🎓 User Experience Goals

After completing this checklist, users should be able to:

1. ✅ Launch GUI with one command
2. ✅ See service status at a glance
3. ✅ Start/Stop services with one click
4. ✅ Switch PHP versions easily
5. ✅ Configure ports without YAML editing
6. ✅ Access localhost quickly
7. ✅ Monitor operations in real-time
8. ✅ Understand any errors that occur

---

## 📝 Feedback Form

Please report:

### What Works Well
- Features you love
- Smooth operations
- Helpful features

### What Needs Improvement
- Confusing interfaces
- Bugs encountered
- Missing features
- Documentation gaps

### Feature Requests
- New capabilities
- UI improvements
- Integration ideas

---

## 🎉 Success!

If all items are checked, congratulations! 🎊

NourProject Phase 2 is fully functional and ready for daily use!

**Enjoy your powerful PHP development environment!** 🚀

---

## 📧 Support

Need help? Check:
1. [GUI README](gui/README.md)
2. [Installation Guide](GUI_INSTALLATION.md)
3. [Main README](README.md)
4. Docker logs: `docker compose logs`
5. GUI logs: Check log panel in app

---

*Last updated: Phase 2 completion*
*NourProject - Development made easy!*
