#!/bin/bash
################################################################################
# NOREX V3.6 - Project Root Locator
# Provides universal PROJECT_ROOT variable for all scripts
################################################################################

# Get absolute path to project root
# This script assumes it's located in /scripts/ directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Export for child processes
export PROJECT_ROOT

# Verify structure
if [ ! -d "$PROJECT_ROOT/scripts" ]; then
    echo "❌ ERROR: PROJECT_ROOT structure invalid!" >&2
    echo "   Expected: $PROJECT_ROOT/scripts/" >&2
    exit 1
fi

# Success (silent - only export)
