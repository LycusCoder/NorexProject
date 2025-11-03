#!/usr/bin/env python3
"""
Settings Dialog untuk NourProject Desktop
Mengelola konfigurasi port, password, dan settings lainnya
"""

from PySide6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
    QPushButton, QLabel, QLineEdit, QSpinBox, QGroupBox,
    QMessageBox, QCheckBox, QTabWidget, QWidget
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QFont
import os
import re


class SettingsDialog(QDialog):
    """Dialog untuk mengatur konfigurasi NourProject"""
    settings_changed = Signal()

    def __init__(self, project_root, parent=None):
        super().__init__(parent)
        self.project_root = project_root
        self.docker_compose_path = os.path.join(project_root, "docker-compose.yml")
        self.init_ui()
        self.load_current_settings()

    def init_ui(self):
        """Initialize UI"""
        self.setWindowTitle("⚙️ NourProject Settings")
        self.setMinimumSize(600, 500)
        
        # Apply dark theme
        self.setStyleSheet("""
            QDialog {
                background-color: #1e1e1e;
            }
            QLabel {
                color: #ffffff;
            }
            QLineEdit, QSpinBox {
                background-color: #2d2d2d;
                color: #ffffff;
                border: 2px solid #0d7377;
                padding: 5px;
                border-radius: 5px;
            }
            QLineEdit:focus, QSpinBox:focus {
                border: 2px solid #14FFEC;
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
            QTabWidget::pane {
                border: 2px solid #0d7377;
                background-color: #1e1e1e;
            }
            QTabBar::tab {
                background-color: #2d2d2d;
                color: #ffffff;
                padding: 10px 20px;
                border: 1px solid #0d7377;
            }
            QTabBar::tab:selected {
                background-color: #0d7377;
                color: #ffffff;
            }
            QCheckBox {
                color: #ffffff;
            }
            QCheckBox::indicator {
                width: 18px;
                height: 18px;
                border: 2px solid #0d7377;
                border-radius: 3px;
                background-color: #2d2d2d;
            }
            QCheckBox::indicator:checked {
                background-color: #14FFEC;
                border: 2px solid #14FFEC;
            }
        """)

        layout = QVBoxLayout(self)

        # Header
        header = QLabel("⚙️ Configuration Settings")
        header.setAlignment(Qt.AlignCenter)
        header.setFont(QFont("Arial", 18, QFont.Bold))
        header.setStyleSheet("color: #14FFEC; margin: 10px;")
        layout.addWidget(header)

        # Tabs
        tabs = QTabWidget()
        
        # Ports Tab
        ports_tab = self.create_ports_tab()
        tabs.addTab(ports_tab, "🌐 Ports")
        
        # Database Tab
        db_tab = self.create_database_tab()
        tabs.addTab(db_tab, "🗄️ Database")
        
        # Advanced Tab
        advanced_tab = self.create_advanced_tab()
        tabs.addTab(advanced_tab, "🔧 Advanced")
        
        layout.addWidget(tabs)

        # Warning label
        self.warning_label = QLabel("⚠️ Changes require container restart!")
        self.warning_label.setAlignment(Qt.AlignCenter)
        self.warning_label.setStyleSheet("color: #ff9800; font-weight: bold; margin: 10px;")
        layout.addWidget(self.warning_label)

        # Buttons
        button_layout = QHBoxLayout()
        
        save_btn = QPushButton("💾 Save & Apply")
        save_btn.clicked.connect(self.save_settings)
        button_layout.addWidget(save_btn)
        
        cancel_btn = QPushButton("❌ Cancel")
        cancel_btn.clicked.connect(self.reject)
        button_layout.addWidget(cancel_btn)
        
        layout.addLayout(button_layout)

    def create_ports_tab(self):
        """Create ports configuration tab"""
        widget = QWidget()
        layout = QVBoxLayout(widget)

        # Web Server Port
        web_group = QGroupBox("🌐 Web Server (Apache)")
        web_layout = QFormLayout()
        
        self.web_port = QSpinBox()
        self.web_port.setRange(1, 65535)
        self.web_port.setValue(8080)
        web_layout.addRow("External Port:", self.web_port)
        
        web_info = QLabel("💡 Port 80 requires sudo privileges")
        web_info.setStyleSheet("color: #888888; font-size: 11px;")
        web_layout.addRow("", web_info)
        
        # Quick preset buttons
        preset_layout = QHBoxLayout()
        
        port_80_btn = QPushButton("Use Port 80")
        port_80_btn.clicked.connect(lambda: self.web_port.setValue(80))
        preset_layout.addWidget(port_80_btn)
        
        port_8080_btn = QPushButton("Use Port 8080")
        port_8080_btn.clicked.connect(lambda: self.web_port.setValue(8080))
        preset_layout.addWidget(port_8080_btn)
        
        web_layout.addRow("Quick Set:", preset_layout)
        
        web_group.setLayout(web_layout)
        layout.addWidget(web_group)

        # phpMyAdmin Port
        pma_group = QGroupBox("🗄️ phpMyAdmin")
        pma_layout = QFormLayout()
        
        self.pma_port = QSpinBox()
        self.pma_port.setRange(1, 65535)
        self.pma_port.setValue(8081)
        pma_layout.addRow("External Port:", self.pma_port)
        
        pma_group.setLayout(pma_layout)
        layout.addWidget(pma_group)

        # MySQL Port
        mysql_group = QGroupBox("🐬 MySQL Database")
        mysql_layout = QFormLayout()
        
        self.mysql_port = QSpinBox()
        self.mysql_port.setRange(1, 65535)
        self.mysql_port.setValue(3306)
        mysql_layout.addRow("External Port:", self.mysql_port)
        
        mysql_info = QLabel("💡 Standard MySQL port is 3306")
        mysql_info.setStyleSheet("color: #888888; font-size: 11px;")
        mysql_layout.addRow("", mysql_info)
        
        mysql_group.setLayout(mysql_layout)
        layout.addWidget(mysql_group)

        layout.addStretch()
        return widget

    def create_database_tab(self):
        """Create database configuration tab"""
        widget = QWidget()
        layout = QVBoxLayout(widget)

        # MySQL Configuration
        mysql_group = QGroupBox("🔐 MySQL Credentials")
        mysql_layout = QFormLayout()
        
        self.db_name = QLineEdit()
        self.db_name.setText("nour_db")
        mysql_layout.addRow("Database Name:", self.db_name)
        
        self.db_user = QLineEdit()
        self.db_user.setText("root")
        mysql_layout.addRow("Username:", self.db_user)
        
        self.db_password = QLineEdit()
        self.db_password.setText("041201")
        self.db_password.setEchoMode(QLineEdit.Password)
        mysql_layout.addRow("Password:", self.db_password)
        
        self.show_password = QCheckBox("Show Password")
        self.show_password.toggled.connect(
            lambda checked: self.db_password.setEchoMode(
                QLineEdit.Normal if checked else QLineEdit.Password
            )
        )
        mysql_layout.addRow("", self.show_password)
        
        security_info = QLabel("⚠️ Development use only! Change password for production.")
        security_info.setStyleSheet("color: #ff9800; font-size: 11px;")
        security_info.setWordWrap(True)
        mysql_layout.addRow("", security_info)
        
        mysql_group.setLayout(mysql_layout)
        layout.addWidget(mysql_group)

        layout.addStretch()
        return widget

    def create_advanced_tab(self):
        """Create advanced settings tab"""
        widget = QWidget()
        layout = QVBoxLayout(widget)

        # Container Names
        container_group = QGroupBox("📦 Container Names")
        container_layout = QFormLayout()
        
        self.web_container = QLineEdit()
        self.web_container.setText("nour_apache")
        container_layout.addRow("Web Container:", self.web_container)
        
        self.db_container = QLineEdit()
        self.db_container.setText("nour_mysql")
        container_layout.addRow("DB Container:", self.db_container)
        
        self.pma_container = QLineEdit()
        self.pma_container.setText("nour_pma")
        container_layout.addRow("PMA Container:", self.pma_container)
        
        container_group.setLayout(container_layout)
        layout.addWidget(container_group)

        # Auto Options
        auto_group = QGroupBox("🔄 Auto Options")
        auto_layout = QVBoxLayout()
        
        self.auto_restart = QCheckBox("Auto-restart containers on failure")
        self.auto_restart.setChecked(True)
        auto_layout.addWidget(self.auto_restart)
        
        auto_group.setLayout(auto_layout)
        layout.addWidget(auto_group)

        layout.addStretch()
        return widget

    def load_current_settings(self):
        """Load settings dari docker-compose.yml"""
        try:
            if not os.path.exists(self.docker_compose_path):
                return
            
            with open(self.docker_compose_path, 'r') as f:
                content = f.read()
            
            # Parse ports
            web_port_match = re.search(r'"(\d+):80".*# web server', content, re.IGNORECASE)
            if web_port_match:
                self.web_port.setValue(int(web_port_match.group(1)))
            
            pma_port_match = re.search(r'"(\d+):80".*# phpmyadmin', content, re.IGNORECASE)
            if pma_port_match:
                self.pma_port.setValue(int(pma_port_match.group(1)))
            
            mysql_port_match = re.search(r'"(\d+):3306"', content)
            if mysql_port_match:
                self.mysql_port.setValue(int(mysql_port_match.group(1)))
            
            # Parse database settings
            db_name_match = re.search(r'MYSQL_DATABASE:\s*(\S+)', content)
            if db_name_match:
                self.db_name.setText(db_name_match.group(1))
            
            db_pass_match = re.search(r'MYSQL_ROOT_PASSWORD:\s*(\S+)', content)
            if db_pass_match:
                self.db_password.setText(db_pass_match.group(1))
            
        except Exception as e:
            print(f"Error loading settings: {e}")

    def save_settings(self):
        """Save settings ke docker-compose.yml"""
        # Validasi
        if self.web_port.value() == self.pma_port.value():
            QMessageBox.warning(
                self,
                "Port Conflict",
                "Web Server and phpMyAdmin cannot use the same port!"
            )
            return
        
        if self.web_port.value() == self.mysql_port.value():
            QMessageBox.warning(
                self,
                "Port Conflict",
                "Web Server and MySQL cannot use the same port!"
            )
            return
        
        # Confirm jika menggunakan port 80
        if self.web_port.value() == 80:
            reply = QMessageBox.question(
                self,
                "Port 80 Requires Sudo",
                "Port 80 requires root privileges.\n\n"
                "Make sure to run Docker with sudo or add your user to docker group.\n\n"
                "Continue?",
                QMessageBox.Yes | QMessageBox.No
            )
            if reply != QMessageBox.Yes:
                return
        
        # Confirm save
        reply = QMessageBox.question(
            self,
            "Save Settings",
            "Save changes to docker-compose.yml?\n\n"
            "This will require container restart to take effect.",
            QMessageBox.Yes | QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            if self.write_docker_compose():
                QMessageBox.information(
                    self,
                    "Settings Saved",
                    "Settings saved successfully!\n\n"
                    "Please restart services to apply changes."
                )
                self.settings_changed.emit()
                self.accept()
            else:
                QMessageBox.critical(
                    self,
                    "Save Failed",
                    "Failed to save settings to docker-compose.yml"
                )

    def write_docker_compose(self):
        """Write updated docker-compose.yml"""
        try:
            # Backup original
            backup_path = self.docker_compose_path + ".backup"
            if os.path.exists(self.docker_compose_path):
                with open(self.docker_compose_path, 'r') as f:
                    original = f.read()
                with open(backup_path, 'w') as f:
                    f.write(original)
            
            # Read current file
            with open(self.docker_compose_path, 'r') as f:
                content = f.read()
            
            # Update ports
            content = re.sub(
                r'"(\d+):80"(\s*#?\s*web)',
                f'"{self.web_port.value()}:80"\\2',
                content,
                flags=re.IGNORECASE
            )
            
            content = re.sub(
                r'"(\d+):80"(\s*#?\s*pma)',
                f'"{self.pma_port.value()}:80"\\2',
                content,
                flags=re.IGNORECASE
            )
            
            content = re.sub(
                r'"(\d+):3306"',
                f'"{self.mysql_port.value()}:3306"',
                content
            )
            
            # Update database settings
            content = re.sub(
                r'(MYSQL_DATABASE:\s*)\S+',
                f'\\1{self.db_name.text()}',
                content
            )
            
            content = re.sub(
                r'(MYSQL_ROOT_PASSWORD:\s*)\S+',
                f'\\1{self.db_password.text()}',
                content
            )
            
            content = re.sub(
                r'(DATABASE_PASSWORD:\s*)\S+',
                f'\\1{self.db_password.text()}',
                content
            )
            
            # Update restart policy
            restart_policy = "unless-stopped" if self.auto_restart.isChecked() else "no"
            content = re.sub(
                r'restart:\s*\S+',
                f'restart: {restart_policy}',
                content
            )
            
            # Write updated file
            with open(self.docker_compose_path, 'w') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error writing docker-compose.yml: {e}")
            # Restore backup jika ada error
            if os.path.exists(backup_path):
                with open(backup_path, 'r') as f:
                    original = f.read()
                with open(self.docker_compose_path, 'w') as f:
                    f.write(original)
            return False
