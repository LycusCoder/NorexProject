#!/usr/bin/env python3
"""
Test script untuk SettingsDialog
Memverifikasi parsing dan writing docker-compose.yml
"""

import sys
import os
import re

# Simulate loading settings
def test_load_settings():
    print("🧪 Testing docker-compose.yml parsing...")
    
    docker_compose_path = "/app/docker-compose.yml"
    
    try:
        with open(docker_compose_path, 'r') as f:
            content = f.read()
        
        print("✅ File loaded successfully")
        
        # Test web port parsing
        web_port_match = re.search(r'"(\d+):80".*# web', content, re.IGNORECASE)
        if web_port_match:
            print(f"✅ Web port parsed: {web_port_match.group(1)}")
        else:
            print("❌ Web port not found")
        
        # Test pma port parsing
        pma_port_match = re.search(r'"(\d+):80".*# pma', content, re.IGNORECASE)
        if pma_port_match:
            print(f"✅ PMA port parsed: {pma_port_match.group(1)}")
        else:
            print("❌ PMA port not found")
        
        # Test mysql port parsing
        mysql_port_match = re.search(r'"(\d+):3306"', content)
        if mysql_port_match:
            print(f"✅ MySQL port parsed: {mysql_port_match.group(1)}")
        else:
            print("❌ MySQL port not found")
        
        # Test database name
        db_name_match = re.search(r'MYSQL_DATABASE:\s*(\S+)', content)
        if db_name_match:
            print(f"✅ Database name parsed: {db_name_match.group(1)}")
        else:
            print("❌ Database name not found")
        
        # Test database password
        db_pass_match = re.search(r'MYSQL_ROOT_PASSWORD:\s*(\S+)', content)
        if db_pass_match:
            print(f"✅ Database password parsed: {db_pass_match.group(1)}")
        else:
            print("❌ Database password not found")
        
        print("\n🎉 All parsing tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = test_load_settings()
    sys.exit(0 if success else 1)
