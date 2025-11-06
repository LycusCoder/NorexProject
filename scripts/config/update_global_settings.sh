#!/bin/bash
# NOREX V3.6 - Update Global Download Settings
# Usage: update_global_settings.sh <field> <value>
# Example: update_global_settings.sh timeout 600

set -e

# Load project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../project_root.sh"

FIELD="$1"
VALUE="$2"

CONFIG_FILE="${PROJECT_ROOT}/config/downloads.yaml"

# Validate inputs
if [ -z "$FIELD" ] || [ -z "$VALUE" ]; then
    echo '{"error": "Usage: update_global_settings.sh <field> <value>"}'
    exit 1
fi

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo '{"error": "downloads.yaml not found at '$CONFIG_FILE'"}'
    exit 1
fi

# Check if yq is installed
if ! command -v yq &> /dev/null; then
    echo '{"error": "yq not installed"}'
    exit 1
fi

# Backup original file
BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$CONFIG_FILE" "$BACKUP_FILE"

# Build yq path for options section
YQ_PATH=".options.${FIELD}"

# Update value (handle boolean conversion)
if [ "$VALUE" = "true" ] || [ "$VALUE" = "false" ]; then
    # Boolean value
    if yq eval "${YQ_PATH} = ${VALUE}" -i "$CONFIG_FILE"; then
        echo "{\"success\": true, \"message\": \"Updated options.${FIELD}\", \"backup\": \"$BACKUP_FILE\"}"
        exit 0
    fi
else
    # String or number value
    if yq eval "${YQ_PATH} = ${VALUE}" -i "$CONFIG_FILE"; then
        echo "{\"success\": true, \"message\": \"Updated options.${FIELD}\", \"backup\": \"$BACKUP_FILE\"}"
        exit 0
    fi
fi

# Restore backup on failure
mv "$BACKUP_FILE" "$CONFIG_FILE"
echo '{"error": "Failed to update global settings"}'
exit 1
