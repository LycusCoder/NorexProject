#!/bin/bash
echo "🚀 Starting NourProject services (Apache & MySQL)..."
# -d: detached mode (jalan di background)
docker compose up -d
echo "✅ Services running! Access at http://localhost:8080"
