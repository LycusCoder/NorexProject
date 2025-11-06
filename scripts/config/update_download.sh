#!/bin/bash
# NOREX V3.6 - Update Download Configuration
# Usage: update_download.sh <binary_key> <field> <value>
# Example: update_download.sh apache url "https://new-url.com/file.tar.gz"

set -e

# Load project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../project_root.sh"

BINARY_KEY="$1"
FIELD="$2"
VALUE="$3"

CONFIG_FILE="${PROJECT_ROOT}/config/downloads.yaml"

# Validate inputs
if [ -z "$BINARY_KEY" ] || [ -z "$FIELD" ] || [ -z "$VALUE" ]; then
    echo '{"error": "Usage: update_download.sh <binary_key> <field> <value>"}'
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

# Build yq path
YQ_PATH=".binaries.${BINARY_KEY}.${FIELD}"

# Check if binary exists
if ! yq eval "$YQ_PATH" "$CONFIG_FILE" &>/dev/null; then
    rm "$BACKUP_FILE"
    echo "{\"error\": \"Binary or field not found: $BINARY_KEY.$FIELD\"}"
    exit 1
fi

# Update value
if yq eval "${YQ_PATH} = \"${VALUE}\"" -i "$CONFIG_FILE"; then
    echo "{\"success\": true, \"message\": \"Updated ${BINARY_KEY}.${FIELD}\", \"backup\": \"$BACKUP_FILE\"}"
    exit 0
else
    # Restore backup on failure
    mv "$BACKUP_FILE" "$CONFIG_FILE"
    echo '{"error": "Failed to update configuration"}'
    exit 1
fi
