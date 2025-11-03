#!/usr/bin/env python3
"""
NourProject Desktop - Native GUI Control Panel
Phase 3: Refined UX with Context Menu & Modern Design
"""

import sys
import os
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QTextEdit, QGroupBox, QComboBox, QMessageBox,
    QMenu, QSystemTrayIcon, QToolBar, QSizePolicy
)
from PySide6.QtCore import Qt, QThread, Signal, QTimer
from PySide6.QtGui import QFont, QIcon, QPalette, QColor, QAction, QCursor
import subprocess
import psutil
from settings_dialog import SettingsDialog


class WorkerThread(QThread):
    """Thread untuk menjalankan subprocess tanpa freeze GUI"""
    output_signal = Signal(str)
    finished_signal = Signal(bool, str)

    def __init__(self, command):
        super().__init__()
        self.command = command

    def run(self):
        try:
            # Jalankan command dan capture output
            process = subprocess.Popen(
                self.command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )

            # Stream output real-time
            for line in iter(process.stdout.readline, ''):
                if line:
                    self.output_signal.emit(line.strip())

            process.wait()
            
            if process.returncode == 0:
                self.finished_signal.emit(True, "Command completed successfully")
            else:
                self.finished_signal.emit(False, f"Command failed with code {process.returncode}")

        except Exception as e:
            self.finished_signal.emit(False, f"Error: {str(e)}")


class StatusIndicator(QLabel):
    """Lampu indikator status dengan animasi smooth"""
    def __init__(self, service_name):
        super().__init__()
        self.service_name = service_name
        self.setFixedSize(24, 24)
        self.setAlignment(Qt.AlignCenter)
        self.set_status(False)

    def set_status(self, is_running):
        if is_running:
            self.setStyleSheet("""
                background-color: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                    stop:0 #00ff88, stop:1 #00cc66);
                border-radius: 12px;
                border: 2px solid #00ff88;
            """)
            self.setToolTip(f"✅ {self.service_name} - Running")
        else:
            self.setStyleSheet("""
                background-color: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                    stop:0 #ff4444, stop:1 #cc0000);
                border-radius: 12px;
                border: 2px solid #ff4444;
            """)
            self.setToolTip(f"❌ {self.service_name} - Stopped")


class NourProjectGUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.worker = None
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.init_ui()
        self.setup_context_menu()
        self.setup_system_tray()
        self.setup_auto_refresh()

    def init_ui(self):
        """Initialize UI Components with Modern Design"""
        self.setWindowTitle("NourProject Desktop - Control Panel")
        self.setGeometry(100, 100, 950, 750)
        
        # Professional Dark Theme with Smooth Gradients
        self.setStyleSheet("""
            QMainWindow {
                background-color: qlineargradient(x1:0, y1:0, x2:0, y2:1,
                    stop:0 #1a1a2e, stop:1 #16213e);
            }
            QLabel {
                color: #eaeaea;
            }
            QPushButton {
                background-color: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                    stop:0 #0f4c75, stop:1 #1b262c);
                color: #bbe1fa;
                border: none;
                padding: 12px 24px;
                font-size: 13px;
                border-radius: 8px;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            QPushButton:hover {
                background-color: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                    stop:0 #3282b8, stop:1 #0f4c75);
                color: #ffffff;
                border: 1px solid #3282b8;
            }
            QPushButton:pressed {
                background-color: #1b262c;
                padding: 13px 24px 11px 24px;
            }
            QPushButton:disabled {
                background-color: #2d3748;
                color: #718096;
            }
            QTextEdit {
                background-color: #0f1419;
                color: #a0e7e5;
                border: 2px solid #0f4c75;
                border-radius: 8px;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 12px;
                padding: 8px;
                selection-background-color: #0f4c75;
            }
            QGroupBox {
                color: #bbe1fa;
                border: 2px solid #0f4c75;
                border-radius: 10px;
                margin-top: 16px;
                font-weight: 600;
                font-size: 13px;
                padding-top: 12px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 15px;
                padding: 0 8px;
                background-color: #1a1a2e;
            }
            QComboBox {
                background-color: #1b262c;
                color: #eaeaea;
                border: 2px solid #0f4c75;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 13px;
            }
            QComboBox:hover {
                border: 2px solid #3282b8;
            }
            QComboBox::drop-down {
                border: none;
                padding-right: 8px;
            }
            QComboBox QAbstractItemView {
                background-color: #1b262c;
                color: #eaeaea;
                selection-background-color: #0f4c75;
                border: 1px solid #0f4c75;
            }
            QToolBar {
                background-color: #0f1419;
                border: none;
                spacing: 10px;
                padding: 8px;
            }
            QToolButton {
                background-color: transparent;
                border: none;
                padding: 8px;
                border-radius: 6px;
            }
            QToolButton:hover {
                background-color: #0f4c75;
            }
        """)

        # Central Widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(15, 10, 15, 15)
        main_layout.setSpacing(12)

        # Toolbar with Settings Icon
        self.create_toolbar()

        # Header
        header_widget = QWidget()
        header_layout = QHBoxLayout(header_widget)
        header_layout.setContentsMargins(0, 0, 0, 0)
        
        header = QLabel("🚀 NourProject Desktop")
        header.setAlignment(Qt.AlignLeft | Qt.AlignVCenter)
        header.setFont(QFont("Segoe UI", 26, QFont.Bold))
        header.setStyleSheet("""
            color: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #3282b8, stop:1 #bbe1fa);
            padding: 10px 0;
        """)
        header_layout.addWidget(header)
        
        # Version badge
        version_label = QLabel("Phase 3")
        version_label.setStyleSheet("""
            background-color: #0f4c75;
            color: #bbe1fa;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        """)
        header_layout.addWidget(version_label, alignment=Qt.AlignRight)
        
        main_layout.addWidget(header_widget)

        # Context Menu Hint
        hint_label = QLabel("💡 Right-click anywhere for quick actions")
        hint_label.setAlignment(Qt.AlignCenter)
        hint_label.setStyleSheet("""
            color: #3282b8;
            font-size: 12px;
            font-style: italic;
            padding: 5px;
            background-color: rgba(50, 130, 184, 0.1);
            border-radius: 5px;
        """)
        main_layout.addWidget(hint_label)

        # Status Group
        status_group = self.create_status_group()
        main_layout.addWidget(status_group)

        # PHP Switcher Group
        php_group = self.create_php_group()
        main_layout.addWidget(php_group)

        # Quick Access Group
        access_group = self.create_access_group()
        main_layout.addWidget(access_group)

        # Log Panel
        log_group = QGroupBox("📋 Live Output")
        log_layout = QVBoxLayout()
        log_layout.setContentsMargins(8, 20, 8, 8)
        self.log_panel = QTextEdit()
        self.log_panel.setReadOnly(True)
        self.log_panel.setMinimumHeight(220)
        log_layout.addWidget(self.log_panel)
        log_group.setLayout(log_layout)
        main_layout.addWidget(log_group)

        # Initial status check
        self.check_status(silent=True)
        
        # Welcome message
        self.show_welcome_message()

    def create_toolbar(self):
        """Create toolbar with settings icon"""
        toolbar = QToolBar("Main Toolbar")
        toolbar.setMovable(False)
        self.addToolBar(Qt.TopToolBarArea, toolbar)
        
        # Settings Action
        settings_action = QAction("⚙️", self)
        settings_action.setToolTip("Open Settings")
        settings_action.triggered.connect(self.open_settings)
        toolbar.addAction(settings_action)
        
        # Spacer
        spacer = QWidget()
        spacer.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        toolbar.addWidget(spacer)
        
        # Status text in toolbar
        self.toolbar_status = QLabel("● System Ready")
        self.toolbar_status.setStyleSheet("color: #00ff88; font-size: 12px; font-weight: bold;")
        toolbar.addWidget(self.toolbar_status)

    def setup_context_menu(self):
        """Setup right-click context menu"""
        self.setContextMenuPolicy(Qt.CustomContextMenu)
        self.customContextMenuRequested.connect(self.show_context_menu)

    def show_context_menu(self, position):
        """Show context menu on right-click"""
        context_menu = QMenu(self)
        
        # Modern menu styling
        context_menu.setStyleSheet("""
            QMenu {
                background-color: #1b262c;
                color: #eaeaea;
                border: 2px solid #0f4c75;
                border-radius: 8px;
                padding: 5px;
            }
            QMenu::item {
                padding: 10px 30px 10px 20px;
                border-radius: 5px;
            }
            QMenu::item:selected {
                background-color: #0f4c75;
                color: #bbe1fa;
            }
            QMenu::separator {
                height: 2px;
                background-color: #0f4c75;
                margin: 5px 10px;
            }
        """)
        
        # Service Control Actions
        start_action = context_menu.addAction("▶️  Start Services")
        start_action.triggered.connect(self.start_services)
        
        stop_action = context_menu.addAction("⏹️  Stop Services")
        stop_action.triggered.connect(self.stop_services)
        
        restart_action = context_menu.addAction("🔄  Restart Services")
        restart_action.triggered.connect(self.restart_services)
        
        context_menu.addSeparator()
        
        # Status
        status_action = context_menu.addAction("🔍  Check Status")
        status_action.triggered.connect(lambda: self.check_status(silent=False))
        
        context_menu.addSeparator()
        
        # Tools
        python_action = context_menu.addAction("🐍  Python CLI (Docker)")
        python_action.triggered.connect(self.open_python_cli)
        
        logs_action = context_menu.addAction("📋  View All Logs")
        logs_action.triggered.connect(self.view_logs)
        
        backup_action = context_menu.addAction("💾  Backup Database")
        backup_action.triggered.connect(self.backup_database)
        
        context_menu.addSeparator()
        
        # Exit
        exit_action = context_menu.addAction("❌  Exit Application")
        exit_action.triggered.connect(self.close)
        
        # Show menu at cursor position
        context_menu.exec(self.mapToGlobal(position))

    def setup_system_tray(self):
        """Setup system tray icon and menu"""
        try:
            # Create tray icon
            self.tray_icon = QSystemTrayIcon(self)
            # self.tray_icon.setIcon(QIcon.fromTheme("applications-system"))
            self.tray_icon.setToolTip("NourProject Desktop")
            
            # Tray menu
            tray_menu = QMenu()
            
            show_action = tray_menu.addAction("Show Window")
            show_action.triggered.connect(self.show)
            
            tray_menu.addSeparator()
            
            start_action = tray_menu.addAction("Start Services")
            start_action.triggered.connect(self.start_services)
            
            stop_action = tray_menu.addAction("Stop Services")
            stop_action.triggered.connect(self.stop_services)
            
            tray_menu.addSeparator()
            
            quit_action = tray_menu.addAction("Quit")
            quit_action.triggered.connect(QApplication.quit)
            
            self.tray_icon.setContextMenu(tray_menu)
            self.tray_icon.activated.connect(self.tray_icon_activated)
            self.tray_icon.show()
        except Exception as e:
            # Tray icon might not be supported on all systems
            print(f"System tray not available: {e}")

    def tray_icon_activated(self, reason):
        """Handle tray icon activation"""
        if reason == QSystemTrayIcon.DoubleClick:
            self.show()
            self.activateWindow()

    def show_welcome_message(self):
        """Display welcome message in log"""
        welcome = """
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║              🚀 NourProject Desktop - Phase 3                     ║
║        Refined Native GUI Control Panel for PHP Development      ║
║                                                                   ║
║  ✨ New in Phase 3:                                               ║
║     • Right-click context menu for quick actions                 ║
║     • Modern, smooth UI design                                   ║
║     • Settings accessible via toolbar icon (⚙️)                  ║
║     • Python CLI integration (Docker-based)                      ║
║     • System tray support                                        ║
║     • Enhanced status indicators                                 ║
║                                                                   ║
║  💡 Tips:                                                         ║
║     • Right-click anywhere to access service controls            ║
║     • Use ⚙️ icon in toolbar for settings                        ║
║     • Python CLI available via context menu                      ║
║                                                                   ║
║  📚 Documentation: /app/docs/                                    ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
"""
        self.log(welcome)
        self.log("🎯 Ready! Right-click to access service controls.")
        self.log("")

    def create_status_group(self):
        """Create status indicators group"""
        group = QGroupBox("📊 Service Status")
        layout = QHBoxLayout()
        layout.setSpacing(30)
        layout.setContentsMargins(20, 25, 20, 15)

        # Apache Status
        apache_layout = QVBoxLayout()
        apache_layout.setSpacing(8)
        self.apache_indicator = StatusIndicator("Apache")
        apache_label = QLabel("Apache")
        apache_label.setAlignment(Qt.AlignCenter)
        apache_label.setStyleSheet("font-weight: bold; font-size: 13px;")
        apache_port = QLabel("Port 8080")
        apache_port.setAlignment(Qt.AlignCenter)
        apache_port.setStyleSheet("font-size: 11px; color: #718096;")
        apache_layout.addWidget(self.apache_indicator, alignment=Qt.AlignCenter)
        apache_layout.addWidget(apache_label)
        apache_layout.addWidget(apache_port)
        layout.addLayout(apache_layout)

        # MySQL Status
        mysql_layout = QVBoxLayout()
        mysql_layout.setSpacing(8)
        self.mysql_indicator = StatusIndicator("MySQL")
        mysql_label = QLabel("MySQL")
        mysql_label.setAlignment(Qt.AlignCenter)
        mysql_label.setStyleSheet("font-weight: bold; font-size: 13px;")
        mysql_port = QLabel("Port 3306")
        mysql_port.setAlignment(Qt.AlignCenter)
        mysql_port.setStyleSheet("font-size: 11px; color: #718096;")
        mysql_layout.addWidget(self.mysql_indicator, alignment=Qt.AlignCenter)
        mysql_layout.addWidget(mysql_label)
        mysql_layout.addWidget(mysql_port)
        layout.addLayout(mysql_layout)

        # phpMyAdmin Status
        pma_layout = QVBoxLayout()
        pma_layout.setSpacing(8)
        self.pma_indicator = StatusIndicator("phpMyAdmin")
        pma_label = QLabel("phpMyAdmin")
        pma_label.setAlignment(Qt.AlignCenter)
        pma_label.setStyleSheet("font-weight: bold; font-size: 13px;")
        pma_port = QLabel("Port 8081")
        pma_port.setAlignment(Qt.AlignCenter)
        pma_port.setStyleSheet("font-size: 11px; color: #718096;")
        pma_layout.addWidget(self.pma_indicator, alignment=Qt.AlignCenter)
        pma_layout.addWidget(pma_label)
        pma_layout.addWidget(pma_port)
        layout.addLayout(pma_layout)

        group.setLayout(layout)
        return group

    def create_php_group(self):
        """Create PHP version switcher group"""
        group = QGroupBox("🔧 PHP Version Manager")
        layout = QHBoxLayout()
        layout.setContentsMargins(15, 25, 15, 15)
        layout.setSpacing(15)

        label = QLabel("Active Version:")
        label.setStyleSheet("font-size: 13px; font-weight: 600;")
        layout.addWidget(label)

        self.php_combo = QComboBox()
        self.php_combo.addItems(["8.1", "8.2", "8.3"])
        self.php_combo.setCurrentText("8.2")  # Default
        self.php_combo.setMinimumWidth(120)
        layout.addWidget(self.php_combo)

        self.switch_btn = QPushButton("🔄 Switch & Rebuild")
        self.switch_btn.clicked.connect(self.switch_php)
        layout.addWidget(self.switch_btn)

        layout.addStretch()
        
        # Info label
        info_label = QLabel("Rebuilds containers with selected PHP version")
        info_label.setStyleSheet("font-size: 11px; color: #718096; font-style: italic;")
        layout.addWidget(info_label)
        
        group.setLayout(layout)
        return group

    def create_access_group(self):
        """Create quick access buttons group"""
        group = QGroupBox("🌐 Quick Access")
        layout = QHBoxLayout()
        layout.setContentsMargins(15, 25, 15, 15)
        layout.setSpacing(12)

        web_btn = QPushButton("🌍 Main Site")
        web_btn.clicked.connect(lambda: self.open_url("http://localhost:8080"))
        layout.addWidget(web_btn)

        pma_btn = QPushButton("🗄️ phpMyAdmin")
        pma_btn.clicked.connect(lambda: self.open_url("http://localhost:8081"))
        layout.addWidget(pma_btn)
        
        python_btn = QPushButton("🐍 Python CLI")
        python_btn.clicked.connect(self.open_python_cli)
        layout.addWidget(python_btn)

        group.setLayout(layout)
        return group

    def setup_auto_refresh(self):
        """Setup timer untuk auto-refresh status"""
        self.status_timer = QTimer()
        self.status_timer.timeout.connect(lambda: self.check_status(silent=True))
        self.status_timer.start(5000)  # Refresh setiap 5 detik

    def log(self, message):
        """Add message to log panel"""
        self.log_panel.append(message)
        # Auto-scroll to bottom
        scrollbar = self.log_panel.verticalScrollBar()
        scrollbar.setValue(scrollbar.maximum())

    def run_command(self, command, success_msg="Command completed"):
        """Run shell command in background thread"""
        if self.worker and self.worker.isRunning():
            self.log("⚠️  Please wait for current operation to finish...")
            return

        # Update toolbar status
        self.toolbar_status.setText("● Processing...")
        self.toolbar_status.setStyleSheet("color: #ffa500; font-size: 12px; font-weight: bold;")
        
        self.log(f"\n🚀 Executing: {command}")
        self.log("━" * 65)

        self.worker = WorkerThread(command)
        self.worker.output_signal.connect(self.log)
        self.worker.finished_signal.connect(
            lambda success, msg: self.on_command_finished(success, msg, success_msg)
        )
        self.worker.start()

    def on_command_finished(self, success, msg, success_msg):
        """Handle command completion"""
        self.log("━" * 65)
        if success:
            self.log(f"✅ {success_msg}")
            self.toolbar_status.setText("● Success")
            self.toolbar_status.setStyleSheet("color: #00ff88; font-size: 12px; font-weight: bold;")
        else:
            self.log(f"❌ {msg}")
            self.toolbar_status.setText("● Error")
            self.toolbar_status.setStyleSheet("color: #ff4444; font-size: 12px; font-weight: bold;")
        self.log("")
        
        # Refresh status
        QTimer.singleShot(1000, lambda: self.check_status(silent=True))
        
        # Reset toolbar status after 3 seconds
        QTimer.singleShot(3000, lambda: (
            self.toolbar_status.setText("● System Ready"),
            self.toolbar_status.setStyleSheet("color: #00ff88; font-size: 12px; font-weight: bold;")
        ))

    def start_services(self):
        """Start NourProject services"""
        command = f"cd {self.project_root} && bash scripts/start.sh"
        self.run_command(command, "Services started successfully! 🎉")

    def stop_services(self):
        """Stop NourProject services"""
        command = f"cd {self.project_root} && bash scripts/stop.sh"
        self.run_command(command, "Services stopped successfully! 🛑")

    def restart_services(self):
        """Restart NourProject services"""
        self.log("\n🔄 Restarting services...")
        command = f"cd {self.project_root} && bash scripts/stop.sh && bash scripts/start.sh"
        self.run_command(command, "Services restarted successfully! 🔄")

    def switch_php(self):
        """Switch PHP version"""
        version = self.php_combo.currentText()
        
        reply = QMessageBox.question(
            self,
            "Confirm PHP Switch",
            f"Switch to PHP {version}?\n\nThis will rebuild containers and may take a few minutes.",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            command = f"cd {self.project_root} && bash scripts/switch-php.sh {version}"
            self.run_command(command, f"PHP switched to version {version}! 🔧")

    def check_status(self, silent=False):
        """Check service status and update indicators"""
        if not silent:
            self.log("\n🔍 Checking service status...")
        
        try:
            # Check if containers are running
            result = subprocess.run(
                ["docker", "ps", "--format", "{{.Names}}"],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            running_containers = result.stdout.strip().split('\n')
            
            # Update indicators
            apache_running = "nour_apache" in running_containers
            mysql_running = "nour_mysql" in running_containers
            pma_running = "nour_pma" in running_containers
            
            self.apache_indicator.set_status(apache_running)
            self.mysql_indicator.set_status(mysql_running)
            self.pma_indicator.set_status(pma_running)
            
            if not silent:
                self.log(f"Apache: {'✅ Running' if apache_running else '❌ Stopped'}")
                self.log(f"MySQL: {'✅ Running' if mysql_running else '❌ Stopped'}")
                self.log(f"phpMyAdmin: {'✅ Running' if pma_running else '❌ Stopped'}")
                self.log("")
        
        except Exception as e:
            if not silent:
                self.log(f"⚠️  Error checking status: {str(e)}")

    def open_url(self, url):
        """Open URL in default browser"""
        import webbrowser
        webbrowser.open(url)
        self.log(f"🌐 Opening: {url}")

    def open_python_cli(self):
        """Open Python CLI info"""
        msg = QMessageBox(self)
        msg.setWindowTitle("Python CLI - Docker Isolated")
        msg.setIcon(QMessageBox.Information)
        msg.setText("🐍 Python CLI (Docker-based)")
        msg.setInformativeText(
            "Run Python 3.11+ in isolated Docker container:\n\n"
            "Terminal Command:\n"
            "  bash scripts/python.sh\n\n"
            "Or with Python code:\n"
            "  bash scripts/python.sh 'print(\"Hello World\")'\n\n"
            "Interactive shell:\n"
            "  bash scripts/python.sh -i\n\n"
            "Run script file:\n"
            "  bash scripts/python.sh script.py"
        )
        msg.setStandardButtons(QMessageBox.Ok)
        msg.setStyleSheet("""
            QMessageBox {
                background-color: #1b262c;
            }
            QMessageBox QLabel {
                color: #eaeaea;
                font-size: 13px;
            }
            QPushButton {
                background-color: #0f4c75;
                color: #bbe1fa;
                border: none;
                padding: 8px 20px;
                border-radius: 5px;
                min-width: 80px;
            }
            QPushButton:hover {
                background-color: #3282b8;
            }
        """)
        msg.exec()
        self.log("\n💡 Python CLI info displayed. Run: bash scripts/python.sh")

    def view_logs(self):
        """View all system logs"""
        command = f"cd {self.project_root} && bash scripts/logs.sh"
        self.run_command(command, "Logs retrieved! 📋")

    def backup_database(self):
        """Backup database"""
        reply = QMessageBox.question(
            self,
            "Backup Database",
            "Create a backup of the MySQL database?\n\nBackup will be saved in project root.",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            command = f"cd {self.project_root} && bash scripts/backup-db.sh"
            self.run_command(command, "Database backup completed! 💾")

    def open_settings(self):
        """Open settings dialog"""
        dialog = SettingsDialog(self.project_root, self)
        dialog.settings_changed.connect(self.on_settings_changed)
        dialog.exec()

    def on_settings_changed(self):
        """Handle settings changes"""
        self.log("\n⚙️  Settings updated!")
        self.log("💡 Restart services to apply changes")
        self.log("")
        self.check_status(silent=True)

    def closeEvent(self, event):
        """Handle window close event"""
        reply = QMessageBox.question(
            self,
            "Exit Application",
            "Close NourProject Desktop?\n\nServices will continue running in background.",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()


def main():
    app = QApplication(sys.argv)
    app.setApplicationName("NourProject Desktop")
    app.setOrganizationName("NourProject")
    
    window = NourProjectGUI()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
