#!/bin/bash
# NOREX V3.6 - Test Download URL
# Usage: test_download.sh <url> [timeout_seconds]
# Example: test_download.sh https://example.com/file.tar.gz 10

set -e

URL="$1"
TIMEOUT="${2:-10}"  # Default 10 seconds

# Validate input
if [ -z "$URL" ]; then
    echo '{"error": "Usage: test_download.sh <url> [timeout]"}'
    exit 1
fi

# Validate URL format
if [[ ! "$URL" =~ ^https?:// ]]; then
    echo "{\"error\": \"Invalid URL format: $URL\"}"
    exit 1
fi

echo "{\"status\": \"testing\", \"url\": \"$URL\", \"timeout\": $TIMEOUT}"

# Test URL with HEAD request (faster, doesn't download)
START_TIME=$(date +%s)

if HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" -m "$TIMEOUT" -L --head "$URL"); then
    END_TIME=$(date +%s)
    RESPONSE_TIME=$((END_TIME - START_TIME))
    
    if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 302 ] || [ "$HTTP_CODE" -eq 301 ]; then
        # Get file size if available
        FILE_SIZE=$(curl -sI -L "$URL" | grep -i Content-Length | tail -1 | awk '{print $2}' | tr -d '\r')
        
        if [ -n "$FILE_SIZE" ]; then
            # Convert to human readable (MB)
            FILE_SIZE_MB=$(echo "scale=2; $FILE_SIZE / 1024 / 1024" | bc)
            echo "{\"success\": true, \"http_code\": $HTTP_CODE, \"response_time\": ${RESPONSE_TIME}s, \"file_size\": \"${FILE_SIZE_MB} MB\", \"message\": \"URL is accessible\"}"
        else
            echo "{\"success\": true, \"http_code\": $HTTP_CODE, \"response_time\": ${RESPONSE_TIME}s, \"message\": \"URL is accessible\"}"
        fi
        exit 0
    else
        echo "{\"success\": false, \"http_code\": $HTTP_CODE, \"response_time\": ${RESPONSE_TIME}s, \"error\": \"HTTP error code: $HTTP_CODE\"}"
        exit 1
    fi
else
    END_TIME=$(date +%s)
    RESPONSE_TIME=$((END_TIME - START_TIME))
    echo "{\"success\": false, \"response_time\": ${RESPONSE_TIME}s, \"error\": \"Failed to connect to URL (timeout or network error)\"}"
    exit 1
fi
