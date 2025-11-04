# GUI-Docker Integration Fix

## Masalah yang Diperbaiki

### 1. **Container Names Salah**
- **Sebelum**: GUI menggunakan `nour_apache`, `nour_mysql`, `nour_pma`
- **Sesudah**: Fixed ke `norex_apache`, `norex_mysql`, `norex_pma` (sesuai docker-compose.yml)

### 2. **Status Check Tidak Terintegrasi dengan Docker**
- **Sebelum**: GUI menggunakan `scripts/status.sh` yang outputnya sulit di-parse
- **Sesudah**: GUI langsung call Docker API via Tauri command `check_docker_containers()`

### 3. **Auto-Refresh Status**
- Ditambahkan polling setiap 5 detik untuk auto-refresh status containers
- GUI sekarang real-time update ketika services start/stop

## Files yang Diubah

### 1. `/app/gui/src-tauri/src/main.rs`
- ✅ Tambah command `check_docker_containers()` - check status via `docker compose ps --format json`
- ✅ Tambah command `get_docker_logs()` - read logs dari Docker containers
- ✅ Fix unused import warning (remove `Submenu`)

### 2. `/app/gui/src/App.tsx`
- ✅ Fix container names: `nour_*` → `norex_*` di 10+ lokasi
- ✅ Rewrite `checkServiceStatus()` untuk parse Docker JSON output
- ✅ Update semua Docker commands untuk gunakan `norex_*`
- ✅ Auto-polling status setiap 5 detik (sudah ada, tetap dipertahankan)

## Testing Steps

1. **Start Docker services**:
   ```bash
   cd /app
   bash norex.sh start
   ```

2. **Launch GUI**:
   ```bash
   cd /app
   bash norex.sh gui
   ```

3. **Verify Status**:
   - GUI harus menunjukkan "Running Services: 3/3" ketika Docker services running
   - Status Apache, MySQL, phpMyAdmin harus "running" (hijau)
   - Tombol "Test Page" harus menunjukkan status "Online" (hijau)

4. **Test Start/Stop**:
   - Klik "Stop All" di GUI → Status harus berubah ke "0/3" dan "Offline"
   - Klik "Start All" di GUI → Status harus berubah ke "3/3" dan "Online"

5. **Test Context Menu**:
   - Right-click di GUI → Menu muncul
   - Click "Apache" → "Start" → Apache container start
   - Verify logs muncul di Log Viewer

## Technical Details

### Docker Status Check Flow
```
Frontend (App.tsx)
  ↓ invoke('check_docker_containers')
Backend (main.rs)
  ↓ docker compose ps --format json
Docker Engine
  ↓ JSON response
Backend parses
  ↓ return JSON string
Frontend parses & updates UI
```

### Polling Strategy
- Initial check: 500ms after mount
- Auto-refresh: Every 5 seconds
- After actions: 1 second delay (untuk beri waktu Docker update)

## Next Steps
1. Test GUI dengan Docker services
2. Verify logs dapat dibaca dari containers
3. Test context menu integration
4. Verify tray icon double-click show/hide

## Notes
- Auto-polling memastikan GUI selalu sinkron dengan Docker state
- JSON parsing handle berbagai format output dari `docker compose ps`
- Container name matching robust (check Name, Service, Names fields)
