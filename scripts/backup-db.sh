#!/bin/bash
# NorexProject - Database Backup Script
# Usage: bash scripts/backup-db.sh

BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/norex_db_$DATE.sql"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  💾 NorexProject - Database Backup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

echo "🔄 Creating backup..."
docker exec norex_mysql mysqldump -u root -p041201 norex_db > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created: $BACKUP_FILE"
    echo "   Size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

echo ""
echo "📊 Recent backups:"
ls -lh "$BACKUP_DIR" | tail -5
echo ""