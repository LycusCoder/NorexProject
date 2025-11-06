#!/bin/bash
# NOREX V3.6 - Backup and Restore Configuration
# Usage: backup_config.sh <action> [backup_name]
# Actions: backup, restore, list
# Example: backup_config.sh backup my_backup
# Example: backup_config.sh restore my_backup
# Example: backup_config.sh list

set -e

ACTION="$1"
BACKUP_NAME="$2"
BACKUP_DIR="/app/config/backups"
CONFIG_DIR="/app/config"

# Validate input
if [ -z "$ACTION" ]; then
    echo '{"error": "Usage: backup_config.sh <action> [backup_name]"}'
    echo '{"info": "Actions: backup, restore, list"}'
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function: Create backup
backup_configs() {
    local name="${1:-manual_$(date +%Y%m%d_%H%M%S)}"
    local backup_path="$BACKUP_DIR/$name"
    
    # Check if backup already exists
    if [ -d "$backup_path" ]; then
        echo "{\"error\": \"Backup already exists: $name\"}"
        exit 1
    fi
    
    # Create backup directory
    mkdir -p "$backup_path"
    
    # Copy config files
    cp "$CONFIG_DIR/downloads.yaml" "$backup_path/" 2>/dev/null || true
    cp "$CONFIG_DIR/services.yaml" "$backup_path/" 2>/dev/null || true
    cp -r "$CONFIG_DIR/php" "$backup_path/" 2>/dev/null || true
    
    # Create metadata
    cat > "$backup_path/metadata.json" <<EOF
{
  "backup_name": "$name",
  "created_at": "$(date -Iseconds)",
  "version": "3.6.0"
}
EOF
    
    echo "{\"success\": true, \"message\": \"Backup created successfully\", \"backup_name\": \"$name\", \"path\": \"$backup_path\"}"
    exit 0
}

# Function: Restore backup
restore_configs() {
    local name="$1"
    local backup_path="$BACKUP_DIR/$name"
    
    if [ -z "$name" ]; then
        echo '{"error": "Please specify backup name to restore"}'
        exit 1
    fi
    
    # Check if backup exists
    if [ ! -d "$backup_path" ]; then
        echo "{\"error\": \"Backup not found: $name\"}"
        exit 1
    fi
    
    # Create safety backup before restore
    local safety_backup="pre_restore_$(date +%Y%m%d_%H%M%S)"
    backup_configs "$safety_backup" > /dev/null 2>&1 || true
    
    # Restore config files
    cp "$backup_path/downloads.yaml" "$CONFIG_DIR/" 2>/dev/null || true
    cp "$backup_path/services.yaml" "$CONFIG_DIR/" 2>/dev/null || true
    cp -r "$backup_path/php" "$CONFIG_DIR/" 2>/dev/null || true
    
    echo "{\"success\": true, \"message\": \"Configuration restored successfully\", \"backup_name\": \"$name\", \"safety_backup\": \"$safety_backup\"}"
    exit 0
}

# Function: List backups
list_backups() {
    if [ ! -d "$BACKUP_DIR" ] || [ -z "$(ls -A $BACKUP_DIR)" ]; then
        echo '{"success": true, "backups": [], "message": "No backups found"}'
        exit 0
    fi
    
    echo '{"success": true, "backups": ['
    
    local first=true
    for backup in "$BACKUP_DIR"/*; do
        if [ -d "$backup" ]; then
            local name=$(basename "$backup")
            local created="Unknown"
            
            # Try to read metadata
            if [ -f "$backup/metadata.json" ]; then
                created=$(grep '"created_at"' "$backup/metadata.json" | sed 's/.*: "\(.*\)".*/\1/')
            fi
            
            if [ "$first" = true ]; then
                first=false
            else
                echo ','
            fi
            
            echo "    {\"name\": \"$name\", \"created_at\": \"$created\"}"
        fi
    done
    
    echo '  ]'
    echo '}'
    exit 0
}

# Execute action
case "$ACTION" in
    backup)
        backup_configs "$BACKUP_NAME"
        ;;
    restore)
        restore_configs "$BACKUP_NAME"
        ;;
    list)
        list_backups
        ;;
    *)
        echo "{\"error\": \"Unknown action: $ACTION\", \"available_actions\": [\"backup\", \"restore\", \"list\"]}"
        exit 1
        ;;
esac
