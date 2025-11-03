#!/usr/bin/env python3
"""
NourProject Desktop - Native GUI Control Panel
Phase 2: Modern Desktop Application ala Laragon
"""

import sys
import os
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QTextEdit, QGroupBox, QComboBox, QMessageBox
)
from PySide6.QtCore import Qt, QThread, Signal, QTimer
from PySide6.QtGui import QFont, QIcon, QPalette, QColor
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
    """Lampu indikator status (hijau/merah)"""
    def __init__(self, service_name):
        super().__init__()
        self.service_name = service_name
        self.setFixedSize(20, 20)
        self.setAlignment(Qt.AlignCenter)
        self.set_status(False)

    def set_status(self, is_running):
        if is_running:
            self.setStyleSheet("""
                background-color: #00ff00;
                border-radius: 10px;
                border: 2px solid #00cc00;
            """)
            self.setToolTip(f"{self.service_name} - Running ✅")
        else:
            self.setStyleSheet("""
                background-color: #ff0000;
                border-radius: 10px;
                border: 2px solid #cc0000;
            """)
            self.setToolTip(f"{self.service_name} - Stopped ❌")


class NourProjectGUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.worker = None
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.init_ui()
        self.setup_auto_refresh()

    def init_ui(self):
        """Initialize UI Components"""
        self.setWindowTitle("NourProject Desktop - Control Panel")
        self.setGeometry(100, 100, 900, 700)
        
        # Dark theme styling
        self.setStyleSheet("""
            QMainWindow {
                background-color: #1e1e1e;
            }
            QLabel {
                color: #ffffff;
            }
            QPushButton {
                background-color: #0d7377;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 14px;
                border-radius: 5px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #14FFEC;
                color: #000000;
            }
            QPushButton:pressed {
                background-color: #0a5254;
            }
            QPushButton:disabled {
                background-color: #555555;
                color: #888888;
            }
            QTextEdit {
                background-color: #2d2d2d;
                color: #00ff00;
                border: 2px solid #0d7377;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
            }
            QGroupBox {
                color: #ffffff;
                border: 2px solid #0d7377;
                border-radius: 5px;
                margin-top: 10px;
                font-weight: bold;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px 0 5px;
            }
            QComboBox {
                background-color: #2d2d2d;
                color: #ffffff;
                border: 2px solid #0d7377;
                padding: 5px;
                border-radius: 5px;
            }
            QComboBox:hover {
                border: 2px solid #14FFEC;
            }
            QComboBox::drop-down {
                border: none;
            }
            QComboBox QAbstractItemView {
                background-color: #2d2d2d;
                color: #ffffff;
                selection-background-color: #0d7377;
            }
        """)

        # Central Widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)

        # Header
        header = QLabel("🚀 NourProject Desktop")
        header.setAlignment(Qt.AlignCenter)
        header.setFont(QFont("Arial", 24, QFont.Bold))
        header.setStyleSheet("color: #14FFEC; margin: 10px;")
        main_layout.addWidget(header)

        # Status Group
        status_group = self.create_status_group()
        main_layout.addWidget(status_group)

        # Control Buttons Group
        control_group = self.create_control_group()
        main_layout.addWidget(control_group)

        # PHP Switcher Group
        php_group = self.create_php_group()
        main_layout.addWidget(php_group)

        # Quick Access Group
        access_group = self.create_access_group()
        main_layout.addWidget(access_group)

        # Log Panel
        log_group = QGroupBox("📋 Live Logs")
        log_layout = QVBoxLayout()
        self.log_panel = QTextEdit()
        self.log_panel.setReadOnly(True)
        self.log_panel.setMinimumHeight(200)
        log_layout.addWidget(self.log_panel)
        log_group.setLayout(log_layout)
        main_layout.addWidget(log_group)

        # Initial status check
        self.check_status(silent=True)
        
        # Welcome message
        self.show_welcome_message()

    def show_welcome_message(self):
        """Display welcome message in log"""
        welcome = """
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║              🚀 NourProject Desktop - Phase 2                     ║
║           Native GUI Control Panel for PHP Development           ║
║                                                                   ║
║  ✨ Features:                                                     ║
║     • Real-time service monitoring                               ║
║     • One-click service control                                  ║
║     • PHP version switcher (8.1, 8.2, 8.3)                       ║
║     • Settings panel (ports, database, advanced)                 ║
║     • Live log viewer                                            ║
║     • Quick browser access                                       ║
║                                                                   ║
║  💡 Tip: Click ⚙️ Settings to configure ports and database       ║
║                                                                   ║
║  📚 Documentation: /app/docs/                                    ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
"""
        self.log(welcome)
        self.log("🎯 Ready! Use control buttons to manage your services.")
        self.log("")

    def create_status_group(self):
        """Create status indicators group"""
        group = QGroupBox("📊 Service Status")
        layout = QHBoxLayout()

        # Apache Status
        apache_layout = QVBoxLayout()
        self.apache_indicator = StatusIndicator("Apache")
        apache_label = QLabel("Apache\n(Port 8080)")
        apache_label.setAlignment(Qt.AlignCenter)
        apache_layout.addWidget(self.apache_indicator, alignment=Qt.AlignCenter)
        apache_layout.addWidget(apache_label)
        layout.addLayout(apache_layout)

        # MySQL Status
        mysql_layout = QVBoxLayout()
        self.mysql_indicator = StatusIndicator("MySQL")
        mysql_label = QLabel("MySQL\n(Port 3306)")
        mysql_label.setAlignment(Qt.AlignCenter)
        mysql_layout.addWidget(self.mysql_indicator, alignment=Qt.AlignCenter)
        mysql_layout.addWidget(mysql_label)
        layout.addLayout(mysql_layout)

        # phpMyAdmin Status
        pma_layout = QVBoxLayout()
        self.pma_indicator = StatusIndicator("phpMyAdmin")
        pma_label = QLabel("phpMyAdmin\n(Port 8081)")
        pma_label.setAlignment(Qt.AlignCenter)
        pma_layout.addWidget(self.pma_indicator, alignment=Qt.AlignCenter)
        pma_layout.addWidget(pma_label)
        layout.addLayout(pma_layout)

        group.setLayout(layout)
        return group

    def create_control_group(self):
        """Create control buttons group"""
        group = QGroupBox("🎮 Service Control")
        layout = QHBoxLayout()

        self.start_btn = QPushButton("▶️ Start Services")
        self.start_btn.clicked.connect(self.start_services)
        layout.addWidget(self.start_btn)

        self.stop_btn = QPushButton("⏹️ Stop Services")
        self.stop_btn.clicked.connect(self.stop_services)
        layout.addWidget(self.stop_btn)

        self.status_btn = QPushButton("🔄 Refresh Status")
        self.status_btn.clicked.connect(lambda: self.check_status(silent=False))
        layout.addWidget(self.status_btn)

        self.settings_btn = QPushButton("⚙️ Settings")
        self.settings_btn.clicked.connect(self.open_settings)
        layout.addWidget(self.settings_btn)

        group.setLayout(layout)
        return group

    def create_php_group(self):
        """Create PHP version switcher group"""
        group = QGroupBox("🔧 PHP Version Switcher")
        layout = QHBoxLayout()

        label = QLabel("Select PHP Version:")
        layout.addWidget(label)

        self.php_combo = QComboBox()
        self.php_combo.addItems(["8.1", "8.2", "8.3"])
        self.php_combo.setCurrentText("8.2")  # Default
        layout.addWidget(self.php_combo)

        self.switch_btn = QPushButton("Switch & Rebuild")
        self.switch_btn.clicked.connect(self.switch_php)
        layout.addWidget(self.switch_btn)

        layout.addStretch()
        group.setLayout(layout)
        return group

    def create_access_group(self):
        """Create quick access buttons group"""
        group = QGroupBox("🌐 Quick Access")
        layout = QHBoxLayout()

        web_btn = QPushButton("🌍 Open Main Site")
        web_btn.clicked.connect(lambda: self.open_url("http://localhost:8080"))
        layout.addWidget(web_btn)

        pma_btn = QPushButton("🗄️ Open phpMyAdmin")
        pma_btn.clicked.connect(lambda: self.open_url("http://localhost:8081"))
        layout.addWidget(pma_btn)

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
            self.log("⚠️ Please wait for current operation to finish...")
            return

        # Disable buttons during operation
        self.set_buttons_enabled(False)
        
        self.log(f"\n🚀 Executing: {command}")
        self.log("━" * 60)

        self.worker = WorkerThread(command)
        self.worker.output_signal.connect(self.log)
        self.worker.finished_signal.connect(
            lambda success, msg: self.on_command_finished(success, msg, success_msg)
        )
        self.worker.start()

    def on_command_finished(self, success, msg, success_msg):
        """Handle command completion"""
        self.log("━" * 60)
        if success:
            self.log(f"✅ {success_msg}")
        else:
            self.log(f"❌ {msg}")
        self.log("")
        
        # Re-enable buttons
        self.set_buttons_enabled(True)
        
        # Refresh status
        self.check_status(silent=True)

    def set_buttons_enabled(self, enabled):
        """Enable/disable all control buttons"""
        self.start_btn.setEnabled(enabled)
        self.stop_btn.setEnabled(enabled)
        self.status_btn.setEnabled(enabled)
        self.switch_btn.setEnabled(enabled)
        self.settings_btn.setEnabled(enabled)

    def start_services(self):
        """Start NourProject services"""
        command = f"cd {self.project_root} && bash scripts/start.sh"
        self.run_command(command, "Services started successfully! 🎉")

    def stop_services(self):
        """Stop NourProject services"""
        command = f"cd {self.project_root} && bash scripts/stop.sh"
        self.run_command(command, "Services stopped successfully! 🛑")

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
                self.log(f"⚠️ Error checking status: {str(e)}")

    def open_url(self, url):
        """Open URL in default browser"""
        import webbrowser
        webbrowser.open(url)
        self.log(f"🌐 Opening: {url}")

    def open_settings(self):
        """Open settings dialog"""
        dialog = SettingsDialog(self.project_root, self)
        dialog.settings_changed.connect(self.on_settings_changed)
        dialog.exec()

    def on_settings_changed(self):
        """Handle settings changes"""
        self.log("\n⚙️ Settings updated!")
        self.log("💡 Restart services to apply changes")
        self.log("")
        self.check_status(silent=True)


def main():
    app = QApplication(sys.argv)
    window = NourProjectGUI()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
