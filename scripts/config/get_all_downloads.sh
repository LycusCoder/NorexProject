#!/bin/bash
# NOREX V3.6 - Get All Downloads from downloads.yaml
# Returns complete downloads.yaml as JSON

set -e

# Load project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../project_root.sh"

CONFIG_FILE="${PROJECT_ROOT}/config/downloads.yaml"

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

# Convert YAML to JSON
YAML_JSON=$(yq eval -o=json "$CONFIG_FILE" 2>/dev/null)

if [ $? -ne 0 ] || [ -z "$YAML_JSON" ]; then
    echo '{"error": "Failed to parse downloads.yaml"}'
    exit 1
fi

# Return as JSON
echo "$YAML_JSON"
exit 0
