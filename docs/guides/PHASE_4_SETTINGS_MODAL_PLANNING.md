# 📋 NOREX V3.6 - PHASE 4: SETTINGS MODAL PLANNING

**Status:** Planning Phase
**Target:** Implementasi GUI Settings Modal untuk manage downloads & services
**Started:** November 2025

---

## 🎯 OVERVIEW

Settings Modal adalah interface GUI untuk:
1. ✅ Manage download sources (URLs & mirrors)
2. ✅ Configure services (enable/disable, ports, settings)
3. ✅ Test & verify downloads
4. ✅ View system status & logs
5. ✅ Backup/restore configurations

---

## 🏗️ ARCHITECTURE

### **Component Structure**
```
/app/gui/src/
├── components/
│   ├── SettingsModal.tsx           # Main modal component
│   ├── DownloadsTab.tsx            # Downloads management
│   ├── ServicesTab.tsx             # Services configuration
│   ├── AdvancedTab.tsx             # System settings
│   └── shared/
│       ├── DownloadItem.tsx        # Individual download row
│       ├── ServiceItem.tsx         # Individual service row
│       ├── TestButton.tsx          # Test download link
│       └── StatusBadge.tsx         # Status indicator
└── utils/
    ├── configManager.ts            # Config read/write
    ├── downloadTester.ts           # URL validation
    └── ipcHandlers.ts              # Electron IPC

/app/scripts/config/
├── read_config.sh                  # Read YAML config
├── write_config.sh                 # Write YAML config
├── test_download.sh                # Test download URL
└── backup_config.sh                # Backup/restore
```

---

## 🎨 UI/UX DESIGN

### **Modal Layout**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ Settings                                              ✕     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [📥 Downloads]  [🔧 Services]  [⚡ Advanced]                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  TAB CONTENT HERE                                         │ │
│  │                                                           │ │
│  │                                                           │ │
│  │                                                           │ │
│  │                                                           │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                               [💾 Save]  [❌ Cancel]           │
└─────────────────────────────────────────────────────────────────┘
```

### **Tab 1: Downloads Management**

```
┌─────────────────────────────────────────────────────────────────┐
│  📥 Download Sources                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🌐 Apache HTTP Server 2.4.62                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Primary URL:                                              │ │
│  │ https://archive.apache.org/dist/httpd/httpd-2.4.62.tar.gz│ │
│  │                                          [🧪 Test] [📋]   │ │
│  │                                                           │ │
│  │ Mirror URLs:                                              │ │
│  │ • https://mirror.lyrahosting.com/...   [🧪 Test] [✏️] [🗑]│ │
│  │ • https://dlcdn.apache.org/...         [🧪 Test] [✏️] [🗑]│ │
│  │                                          [➕ Add Mirror]  │ │
│  │                                                           │ │
│  │ Status: ✅ Downloaded (12.5 MB)                           │ │
│  │ Checksum: ✅ Verified                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                           [🔄 Re-download]      │
│                                                                 │
│  🗄️ MySQL Server 8.4.3                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Primary URL:                                              │ │
│  │ https://dev.mysql.com/get/Downloads/...                  │ │
│  │                                          [🧪 Test] [📋]   │ │
│  │                                                           │ │
│  │ Status: ⬇️ Downloading... 45%                             │ │
│  │ Progress: ████████████░░░░░░░░░░░░                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                           [⏸️ Pause]           │
│                                                                 │
│  🐘 PHP 8.3.26                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Status: ❌ Download Failed                                 │ │
│  │ Error: Connection timeout                                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                           [🔄 Retry]           │
│                                                                 │
│  📊 phpMyAdmin 5.2.1                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Status: ⏸️ Paused (2.1 MB / 8.5 MB)                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                           [▶️ Resume]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Tab 2: Services Configuration**

```
┌─────────────────────────────────────────────────────────────────┐
│  🔧 Service Configuration                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🌐 Apache HTTP Server                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Status: ✅ Running                                         │ │
│  │ Enabled: [✓] Auto-start on launch                        │ │
│  │ Port: [8080]                     [Check Port]            │ │
│  │ DocumentRoot: [/app/www]                                 │ │
│  │                                                           │ │
│  │ Advanced Options:                                         │ │
│  │ • ServerName: [localhost]                                │ │
│  │ • MaxClients: [150]                                      │ │
│  │ • Timeout: [300]                                         │ │
│  │                                          [Show Config]   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🗄️ MySQL Server                                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Status: ✅ Running                                         │ │
│  │ Enabled: [✓] Auto-start on launch                        │ │
│  │ Port: [3306]                     [Check Port]            │ │
│  │ DataDir: [/app/bin/mysql/data/]                          │ │
│  │                                                           │ │
│  │ Credentials:                                              │ │
│  │ • Root Password: [********]         [🔄 Change]          │ │
│  │                                                           │ │
│  │ Advanced Options:                                         │ │
│  │ • Max Connections: [151]                                 │ │
│  │ • InnoDB Buffer Pool: [128M]                             │ │
│  │                                          [Show Config]   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🐘 PHP                                                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Status: ⚪ Disabled                                        │ │
│  │ Enabled: [ ] Auto-start on launch                        │ │
│  │ Version: 8.3.26                                          │ │
│  │                                                           │ │
│  │ Extensions Enabled:                                       │ │
│  │ [✓] mysqli  [✓] pdo_mysql  [✓] mbstring                 │ │
│  │ [✓] curl    [✓] json       [ ] redis                    │ │
│  │                                          [Manage Ext]    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📊 phpMyAdmin                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Status: ✅ Running (via Apache)                           │ │
│  │ URL: http://localhost:8080/phpmyadmin                    │ │
│  │ Access: [🔗 Open]                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **Tab 3: Advanced Settings**

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ Advanced Settings                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📂 Project Root                                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Path: /app                                                │ │
│  │                                          [📁 Browse]       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📝 Logging                                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Log Level: [Info ▼]  (Debug, Info, Warning, Error)       │ │
│  │ Log Location: /app/logs/                                 │ │
│  │                                          [📁 Open Logs]   │ │
│  │                                          [🗑 Clear Logs]  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ⚙️ System                                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ [✓] Check for updates on startup                         │ │
│  │ [✓] Auto-restart services on crash                       │ │
│  │ [ ] Enable development mode                              │ │
│  │ [ ] Show verbose output                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  💾 Configuration Backup                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Last Backup: 2025-11-05 10:30:00                         │ │
│  │                                                           │ │
│  │ [💾 Backup Now]  [📂 Restore]  [📥 Export]  [📤 Import]  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ⚠️ Danger Zone                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ [🗑 Reset to Defaults]      [⚠️ Clear All Data]           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### **1. React Components**

#### **SettingsModal.tsx**
```tsx
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'downloads' | 'services' | 'advanced'>('downloads');
  const [config, setConfig] = useState<Config | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    const config = await window.electronAPI.readConfig();
    setConfig(config);
  };

  const saveConfig = async () => {
    await window.electronAPI.writeConfig(config);
    setHasChanges(false);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-header">
        <h2>⚙️ Settings</h2>
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="modal-tabs">
        <button onClick={() => setActiveTab('downloads')}>📥 Downloads</button>
        <button onClick={() => setActiveTab('services')}>🔧 Services</button>
        <button onClick={() => setActiveTab('advanced')}>⚡ Advanced</button>
      </div>

      <div className="modal-content">
        {activeTab === 'downloads' && <DownloadsTab config={config} onChange={setConfig} />}
        {activeTab === 'services' && <ServicesTab config={config} onChange={setConfig} />}
        {activeTab === 'advanced' && <AdvancedTab config={config} onChange={setConfig} />}
      </div>

      <div className="modal-footer">
        <button onClick={onClose}>❌ Cancel</button>
        <button onClick={saveConfig} disabled={!hasChanges}>💾 Save</button>
      </div>
    </div>
  );
};
```

#### **DownloadsTab.tsx**
```tsx
interface DownloadsTabProps {
  config: Config;
  onChange: (config: Config) => void;
}

const DownloadsTab: React.FC<DownloadsTabProps> = ({ config, onChange }) => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const testDownloadUrl = async (binary: string, url: string) => {
    const result = await window.electronAPI.testDownload(url);
    setTestResults(prev => ({ ...prev, [binary]: result }));
  };

  const reDownload = async (binary: string) => {
    await window.electronAPI.reDownload(binary);
  };

  return (
    <div className="downloads-tab">
      {Object.entries(config.binaries).map(([key, binary]) => (
        <DownloadItem
          key={key}
          binary={binary}
          testResult={testResults[key]}
          onTest={() => testDownloadUrl(key, binary.url)}
          onReDownload={() => reDownload(key)}
          onChange={(updated) => {
            config.binaries[key] = updated;
            onChange(config);
          }}
        />
      ))}
    </div>
  );
};
```

### **2. Electron IPC Handlers**

#### **main.js additions**
```javascript
const { ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read config
ipcMain.handle('read-config', async () => {
  return new Promise((resolve, reject) => {
    exec(`bash ${PROJECT_ROOT}/scripts/config/read_config.sh`, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
});

// Write config
ipcMain.handle('write-config', async (event, config) => {
  return new Promise((resolve, reject) => {
    const configJson = JSON.stringify(config);
    exec(
      `bash ${PROJECT_ROOT}/scripts/config/write_config.sh '${configJson}'`,
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
});

// Test download URL
ipcMain.handle('test-download', async (event, url) => {
  return new Promise((resolve, reject) => {
    exec(
      `bash ${PROJECT_ROOT}/scripts/config/test_download.sh '${url}'`,
      (error, stdout) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true, output: stdout });
        }
      }
    );
  });
});

// Re-download binary
ipcMain.handle('re-download', async (event, binary) => {
  return new Promise((resolve, reject) => {
    exec(
      `bash ${PROJECT_ROOT}/scripts/verify_setup.sh --force --binary=${binary}`,
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
});

// Backup config
ipcMain.handle('backup-config', async () => {
  return new Promise((resolve, reject) => {
    exec(`bash ${PROJECT_ROOT}/scripts/config/backup_config.sh`, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
});

// Restore config
ipcMain.handle('restore-config', async (event, backupPath) => {
  return new Promise((resolve, reject) => {
    exec(
      `bash ${PROJECT_ROOT}/scripts/config/backup_config.sh --restore '${backupPath}'`,
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
});
```

#### **preload.js additions**
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  // ... existing APIs
  
  readConfig: () => ipcRenderer.invoke('read-config'),
  writeConfig: (config) => ipcRenderer.invoke('write-config', config),
  testDownload: (url) => ipcRenderer.invoke('test-download', url),
  reDownload: (binary) => ipcRenderer.invoke('re-download', binary),
  backupConfig: () => ipcRenderer.invoke('backup-config'),
  restoreConfig: (backupPath) => ipcRenderer.invoke('restore-config', backupPath)
});
```

### **3. Bash Utilities**

#### **scripts/config/read_config.sh**
```bash
#!/bin/bash
# Read YAML config and convert to JSON

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"
source "$PROJECT_ROOT/scripts/project_root.sh"

# Parse downloads.yaml and services.yaml
# Combine into single JSON object
# Output to stdout

# For now, use yq or python for YAML parsing
# Fallback: manual parsing with awk/sed

if command -v yq &> /dev/null; then
    yq eval -o=json "$PROJECT_ROOT/config/downloads.yaml"
else
    # Manual parsing fallback
    python3 -c "
import yaml, json, sys
with open('$PROJECT_ROOT/config/downloads.yaml', 'r') as f:
    print(json.dumps(yaml.safe_load(f)))
"
fi
```

#### **scripts/config/write_config.sh**
```bash
#!/bin/bash
# Write JSON config back to YAML

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"
source "$PROJECT_ROOT/scripts/project_root.sh"

CONFIG_JSON="$1"

# Backup original
cp "$PROJECT_ROOT/config/downloads.yaml" "$PROJECT_ROOT/config/downloads.yaml.bak"

# Convert JSON back to YAML and write
if command -v yq &> /dev/null; then
    echo "$CONFIG_JSON" | yq eval -P - > "$PROJECT_ROOT/config/downloads.yaml"
else
    python3 -c "
import yaml, json, sys
config = json.loads('$CONFIG_JSON')
with open('$PROJECT_ROOT/config/downloads.yaml', 'w') as f:
    yaml.dump(config, f, default_flow_style=False)
"
fi

echo "✅ Config updated"
```

#### **scripts/config/test_download.sh**
```bash
#!/bin/bash
# Test if download URL is accessible

URL="$1"

if [ -z "$URL" ]; then
    echo "❌ No URL provided"
    exit 1
fi

# Test with HEAD request
if curl -I -L --max-time 10 -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
    echo "✅ URL accessible (HTTP 200)"
    exit 0
else
    echo "❌ URL not accessible"
    exit 1
fi
```

#### **scripts/config/backup_config.sh**
```bash
#!/bin/bash
# Backup/restore configuration files

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd ../.. && pwd)"
source "$PROJECT_ROOT/scripts/project_root.sh"

BACKUP_DIR="$PROJECT_ROOT/config/backups"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

mkdir -p "$BACKUP_DIR"

if [ "$1" = "--restore" ]; then
    # Restore from backup
    BACKUP_FILE="$2"
    tar -xzf "$BACKUP_FILE" -C "$PROJECT_ROOT/config/"
    echo "✅ Config restored from $BACKUP_FILE"
else
    # Create backup
    BACKUP_FILE="$BACKUP_DIR/config_backup_$TIMESTAMP.tar.gz"
    tar -czf "$BACKUP_FILE" -C "$PROJECT_ROOT/config/" downloads.yaml services.yaml
    echo "✅ Config backed up to $BACKUP_FILE"
fi
```

---

## 📦 DEPENDENCIES

### **NPM Packages (GUI)**
```json
{
  "dependencies": {
    "yaml": "^2.3.4",           // YAML parsing
    "react-tabs": "^6.0.2",      // Tab component
    "react-modal": "^3.16.1"     // Modal component
  }
}
```

### **System Requirements**
- `yq` or `python3` with `pyyaml` - for YAML parsing
- `curl` or `wget` - for download testing
- `tar`, `gzip` - for backup/restore

---

## 🚀 IMPLEMENTATION PHASES

### **Phase 4.1: Core Components** ⏳
- [ ] Create SettingsModal.tsx
- [ ] Create DownloadsTab.tsx
- [ ] Create ServicesTab.tsx
- [ ] Create AdvancedTab.tsx
- [ ] Add shared components (DownloadItem, ServiceItem, etc.)

### **Phase 4.2: IPC Integration** ⏳
- [ ] Add IPC handlers to main.js
- [ ] Update preload.js with new APIs
- [ ] Test Electron ↔ React communication

### **Phase 4.3: Bash Utilities** ⏳
- [ ] Create read_config.sh
- [ ] Create write_config.sh
- [ ] Create test_download.sh
- [ ] Create backup_config.sh
- [ ] Test all bash scripts

### **Phase 4.4: UI/UX Polish** ⏳
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add animations
- [ ] Add validation
- [ ] Responsive design

### **Phase 4.5: Testing** ⏳
- [ ] Unit tests for components
- [ ] Integration tests for IPC
- [ ] E2E tests for full workflow
- [ ] Performance optimization

---

## 📝 FEATURES CHECKLIST

### **Downloads Tab**
- [ ] View current download sources
- [ ] Edit primary URL
- [ ] Add/remove/edit mirror URLs
- [ ] Test download links (HEAD request)
- [ ] View download status (not downloaded, downloading, completed, failed)
- [ ] View download progress bar
- [ ] Re-download button
- [ ] Pause/resume downloads
- [ ] Copy URL to clipboard
- [ ] View checksum & verify

### **Services Tab**
- [ ] Enable/disable services
- [ ] Auto-start on launch toggle
- [ ] Edit service ports
- [ ] Check port availability
- [ ] View/edit service paths (DocumentRoot, DataDir)
- [ ] View/edit advanced options
- [ ] Change MySQL root password
- [ ] Manage PHP extensions
- [ ] Show service config files
- [ ] Quick links to services (Open in browser)

### **Advanced Tab**
- [ ] View/edit project root path
- [ ] Browse folder dialog
- [ ] Change log level
- [ ] Open logs folder
- [ ] Clear logs
- [ ] Enable/disable auto-updates
- [ ] Enable/disable auto-restart
- [ ] Development mode toggle
- [ ] Verbose output toggle
- [ ] Backup configuration
- [ ] Restore configuration
- [ ] Export configuration
- [ ] Import configuration
- [ ] Reset to defaults
- [ ] Clear all data

---

## ⚡ PERFORMANCE CONSIDERATIONS

1. **Lazy Loading:** Load tabs only when clicked (React.lazy)
2. **Debounced Input:** Debounce URL edit inputs (500ms)
3. **Cached Status:** Cache download status checks (5 sec)
4. **Async Operations:** All bash scripts run async, non-blocking
5. **Progress Updates:** Use IPC streaming for download progress

---

## 🔒 SECURITY CONSIDERATIONS

1. **Input Validation:** Validate URLs before saving (regex, protocol check)
2. **Path Sanitization:** Sanitize file paths to prevent traversal
3. **Command Injection:** Escape all bash script parameters
4. **Permission Check:** Verify write permissions before config save
5. **Backup Verification:** Verify backup integrity before restore

---

## 🧪 TESTING STRATEGY

### **Unit Tests**
- Component rendering
- State management
- Input validation
- URL parsing

### **Integration Tests**
- IPC communication
- Config read/write
- Download testing
- Service configuration

### **E2E Tests**
- Open settings modal
- Edit download URL
- Test download link
- Save configuration
- Verify changes persist

---

## 📚 DOCUMENTATION

### **User Documentation**
- How to open Settings
- How to edit download sources
- How to add mirror servers
- How to test download links
- How to change service ports
- How to backup/restore config

### **Developer Documentation**
- Component API reference
- IPC handler specifications
- Bash script usage
- Config file format
- Extension points

---

## 🎯 SUCCESS CRITERIA

1. ✅ User dapat edit download URLs dari GUI
2. ✅ User dapat test download links sebelum save
3. ✅ User dapat add/remove mirror servers
4. ✅ User dapat enable/disable services
5. ✅ User dapat change service ports
6. ✅ User dapat backup/restore configurations
7. ✅ Changes persist setelah app restart
8. ✅ Error handling yang baik (user-friendly messages)
9. ✅ Performance: Settings modal load dalam <500ms
10. ✅ No breaking changes ke existing functionality

---

## 🚧 KNOWN LIMITATIONS

1. YAML parsing requires `yq` or `python3` (fallback)
2. Download progress requires bash streaming (kompleks)
3. Port checking mungkin false positive jika firewall aktif
4. Windows/Mac compatibility belum tested (Linux first)

---

## 📅 ESTIMATED TIMELINE

- **Phase 4.1:** Core Components - 2 days
- **Phase 4.2:** IPC Integration - 1 day
- **Phase 4.3:** Bash Utilities - 1 day
- **Phase 4.4:** UI/UX Polish - 1 day
- **Phase 4.5:** Testing - 1 day

**Total:** ~6 days untuk full implementation

---

## 🔄 FUTURE ENHANCEMENTS

1. **Download Scheduler:** Schedule downloads for off-peak hours
2. **Bandwidth Limiter:** Limit download speed
3. **Mirror Auto-Select:** Auto-select fastest mirror
4. **Version Manager:** Manage multiple binary versions
5. **Service Templates:** Pre-configured service templates
6. **Plugin System:** Allow custom services via plugins
7. **Cloud Sync:** Sync configs across devices
8. **Docker Integration:** Optional Docker mode switcher

---

## 📞 SUPPORT & FEEDBACK

**Issues/Questions:**
- Open GitHub issue
- Tag with `phase-4` label

**Feature Requests:**
- Discuss in planning document
- Vote on priority

---

**Last Updated:** November 2025
**Planning Version:** 1.0
**Status:** Ready for Implementation 🚀
