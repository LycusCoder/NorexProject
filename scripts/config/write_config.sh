#!/bin/bash
# NOREX V3.6 - Write Configuration to YAML
# Usage: write_config.sh <config_file> <key_path> <value>
# Example: write_config.sh downloads.yaml binaries.apache.version "2.4.63"

set -e

CONFIG_FILE="$1"
KEY_PATH="$2"
VALUE="$3"

# Validate inputs
if [ -z "$CONFIG_FILE" ] || [ -z "$KEY_PATH" ] || [ -z "$VALUE" ]; then
    echo '{"error": "Usage: write_config.sh <config_file> <key_path> <value>"}'
    exit 1
fi

# Determine absolute path
if [[ "$CONFIG_FILE" != /* ]]; then
    CONFIG_FILE="/app/config/$CONFIG_FILE"
fi

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "{\"error\": \"Config file not found: $CONFIG_FILE\"}"
    exit 1
fi

# Backup original file
BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$CONFIG_FILE" "$BACKUP_FILE"

# Check if yq is installed
if ! command -v yq &> /dev/null; then
    # Fallback: use sed for simple key-value replacement
    # WARNING: This is basic and may not work for all YAML structures
    
    # Extract just the key name (last part after dot)
    KEY_NAME=$(echo "$KEY_PATH" | awk -F'.' '{print $NF}')
    
    # Try to replace the value
    if grep -q "${KEY_NAME}:" "$CONFIG_FILE"; then
        sed -i "s|^\([ ]*${KEY_NAME}:\).*|\1 \"${VALUE}\"|" "$CONFIG_FILE"
        echo "{\"success\": true, \"message\": \"Configuration updated (fallback mode)\", \"backup\": \"$BACKUP_FILE\"}"
        exit 0
    else
        # Restore backup on failure
        mv "$BACKUP_FILE" "$CONFIG_FILE"
        echo "{\"error\": \"Key not found: $KEY_PATH\"}"
        exit 1
    fi
fi

# Use yq for proper YAML writing
if yq eval ".${KEY_PATH} = \"${VALUE}\"" -i "$CONFIG_FILE"; then
    echo "{\"success\": true, \"message\": \"Configuration updated\", \"backup\": \"$BACKUP_FILE\"}"
    exit 0
else
    # Restore backup on failure
    mv "$BACKUP_FILE" "$CONFIG_FILE"
    echo "{\"error\": \"Failed to write configuration\"}"
    exit 1
fi
