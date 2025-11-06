#!/bin/bash
# NOREX V3.6 - Check if Binary is Downloaded
# Usage: check_downloaded.sh <binary_key>
# Returns: {"downloaded": true/false, "path": "/path/to/file"}

set -e

# Load project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../project_root.sh"

BINARY_KEY="$1"
CONFIG_FILE="${PROJECT_ROOT}/config/downloads.yaml"

# Validate input
if [ -z "$BINARY_KEY" ]; then
    echo '{"error": "Usage: check_downloaded.sh <binary_key>"}'
    exit 1
fi

# Check if yq is installed
if ! command -v yq &> /dev/null; then
    echo '{"error": "yq not installed"}'
    exit 1
fi

# Get archive_name and extract_to from YAML
ARCHIVE_NAME=$(yq eval ".binaries.${BINARY_KEY}.archive_name" "$CONFIG_FILE" 2>/dev/null)
EXTRACT_TO=$(yq eval ".binaries.${BINARY_KEY}.extract_to" "$CONFIG_FILE" 2>/dev/null)

if [ "$ARCHIVE_NAME" = "null" ] || [ "$EXTRACT_TO" = "null" ]; then
    echo "{\"error\": \"Binary not found: $BINARY_KEY\"}"
    exit 1
fi

# Build expected path (relative to PROJECT_ROOT)
EXPECTED_PATH="${PROJECT_ROOT}/${EXTRACT_TO}${ARCHIVE_NAME}"

# Check if directory exists
if [ -d "$EXPECTED_PATH" ]; then
    echo "{\"downloaded\": true, \"path\": \"$EXPECTED_PATH\"}"
    exit 0
else
    echo "{\"downloaded\": false, \"path\": \"$EXPECTED_PATH\"}"
    exit 0
fi
