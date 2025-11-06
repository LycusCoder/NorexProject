#!/bin/bash
# NOREX V3.6 - Read Configuration from YAML
# Usage: read_config.sh <config_file> <key_path>
# Example: read_config.sh downloads.yaml binaries.apache.version

set -e

CONFIG_FILE="$1"
KEY_PATH="$2"

# Validate inputs
if [ -z "$CONFIG_FILE" ] || [ -z "$KEY_PATH" ]; then
    echo '{"error": "Usage: read_config.sh <config_file> <key_path>"}'
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

# Check if yq is installed (YAML parser)
if ! command -v yq &> /dev/null; then
    # Fallback: use grep/sed for simple key-value pairs
    # This is basic parsing, works for simple cases
    VALUE=$(grep "$KEY_PATH" "$CONFIG_FILE" | sed 's/.*: //' | tr -d '"' | xargs)
    
    if [ -z "$VALUE" ]; then
        echo "{\"error\": \"Key not found: $KEY_PATH\"}"
        exit 1
    fi
    
    echo "{\"success\": true, \"value\": \"$VALUE\"}"
    exit 0
fi

# Use yq for proper YAML parsing
VALUE=$(yq eval ".${KEY_PATH}" "$CONFIG_FILE")

if [ "$VALUE" = "null" ] || [ -z "$VALUE" ]; then
    echo "{\"error\": \"Key not found: $KEY_PATH\"}"
    exit 1
fi

echo "{\"success\": true, \"value\": \"$VALUE\"}"
exit 0
