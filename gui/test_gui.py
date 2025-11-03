#!/usr/bin/env python3
"""
Test script untuk GUI NourProject
Membuat screenshot GUI tanpa interaksi user
"""

import sys
import os
from PySide6.QtWidgets import QApplication
from PySide6.QtCore import QTimer
from main import NourProjectGUI

def test_gui():
    """Test GUI dan buat screenshot"""
    app = QApplication(sys.argv)
    window = NourProjectGUI()
    window.show()
    
    # Log welcome message
    window.log("🎉 Welcome to NourProject Desktop GUI!")
    window.log("📦 Phase 2: Modern Control Panel")
    window.log("")
    window.log("✅ All systems ready!")
    window.log("💡 Use control buttons to manage services")
    window.log("")
    
    # Take screenshot after 1 second
    def take_screenshot():
        try:
            pixmap = window.grab()
            screenshot_path = "/app/gui/screenshot.png"
            pixmap.save(screenshot_path)
            print(f"✅ Screenshot saved: {screenshot_path}")
        except Exception as e:
            print(f"❌ Screenshot error: {e}")
        finally:
            app.quit()
    
    # Schedule screenshot
    QTimer.singleShot(1000, take_screenshot)
    
    return app.exec()

if __name__ == "__main__":
    sys.exit(test_gui())
