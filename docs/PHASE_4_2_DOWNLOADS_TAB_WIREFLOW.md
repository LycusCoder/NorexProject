# PHASE 4.2 - Downloads Tab Wireflow & Design

## 📋 Overview
Implementasi lengkap Downloads Tab dengan fitur manajemen download sources, testing URLs, dan status monitoring.

---

## 🎨 UI/UX Wireflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SETTINGS MODAL                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  [⚡] Settings                                      [X]     │    │
│  │  Manage downloads, services, and advanced options          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ [📥 Downloads] [🔧 Services] [⚡ Advanced]  ← TABS         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ╔═══════════════════════════════════════════════════════════╗    │
│  ║          📥 DOWNLOADS TAB CONTENT                          ║    │
│  ╠═══════════════════════════════════════════════════════════╣    │
│  ║                                                             ║    │
│  ║  Download Management                                        ║    │
│  ║  Manage download sources, test URLs, and configure mirrors ║    │
│  ║                                                             ║    │
│  ║  ┌─────────────────────────────────────────────────────┐  ║    │
│  ║  │ ✅  Apache HTTP Server              v2.4.62         │  ║    │
│  ║  │     Size: 9.2 MB | Status: Downloaded              │  ║    │
│  ║  │     URL: https://archive.apache.org/dist/...        │  ║    │
│  ║  │     Mirrors: 2 available                            │  ║    │
│  ║  │     [Test URL] [Edit] [Download] [View Mirrors]     │  ║    │
│  ║  └─────────────────────────────────────────────────────┘  ║    │
│  ║                                                             ║    │
│  ║  ┌─────────────────────────────────────────────────────┐  ║    │
│  ║  │ ✅  MySQL Server                    v8.4.3          │  ║    │
│  ║  │     Size: 567 MB | Status: Downloaded              │  ║    │
│  ║  │     URL: https://dev.mysql.com/get/Downloads/...    │  ║    │
│  ║  │     Mirrors: 1 available                            │  ║    │
│  ║  │     [Test URL] [Edit] [Download] [View Mirrors]     │  ║    │
│  ║  └─────────────────────────────────────────────────────┘  ║    │
│  ║                                                             ║    │
│  ║  ┌─────────────────────────────────────────────────────┐  ║    │
│  ║  │ ⚪  PHP                              v8.3.26         │  ║    │
│  ║  │     Size: 18.5 MB | Status: Not Downloaded         │  ║    │
│  ║  │     URL: https://www.php.net/distributions/...      │  ║    │
│  ║  │     Mirrors: 1 available                            │  ║    │
│  ║  │     [Test URL] [Edit] [Download] [View Mirrors]     │  ║    │
│  ║  └─────────────────────────────────────────────────────┘  ║    │
│  ║                                                             ║    │
│  ║  ┌─────────────────────────────────────────────────────┐  ║    │
│  ║  │ ⚪  phpMyAdmin                       v5.2.1          │  ║    │
│  ║  │     Size: 12.1 MB | Status: Not Downloaded         │  ║    │
│  ║  │     URL: https://files.phpmyadmin.net/...           │  ║    │
│  ║  │     Mirrors: 1 available                            │  ║    │
│  ║  │     [Test URL] [Edit] [Download] [View Mirrors]     │  ║    │
│  ║  └─────────────────────────────────────────────────────┘  ║    │
│  ║                                                             ║    │
│  ║  ┌─────────────────────────────────────────────────────┐  ║    │
│  ║  │ ℹ️  Global Download Settings                         │  ║    │
│  ║  │  • Timeout: 300s                                     │  ║    │
│  ║  │  • Retry Count: 3                                    │  ║    │
│  ║  │  • Verify Checksum: Disabled                         │  ║    │
│  ║  │  • Skip Existing: Enabled                            │  ║    │
│  ║  │                              [Edit Global Settings]  │  ║    │
│  ║  └─────────────────────────────────────────────────────┘  ║    │
│  ║                                                             ║    │
│  ╚═════════════════════════════════════════════════════════════╝    │
│                                                                       │
│  [Close]                                                             │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow Diagram

```
START
  │
  ├─→ User clicks Settings button
  │   └─→ Settings Modal opens
  │       └─→ Downloads Tab active by default
  │
  ├─→ SCENARIO 1: Test Download URL
  │   │
  │   ├─→ User clicks "Test URL" button
  │   │   └─→ Show loading indicator
  │   │       └─→ Call bash script: test_download.sh
  │   │           ├─→ SUCCESS: Show ✅ with response time
  │   │           └─→ FAIL: Show ❌ with error message
  │   │
  │   └─→ Display result in toast/notification
  │
  ├─→ SCENARIO 2: Edit Download Configuration
  │   │
  │   ├─→ User clicks "Edit" button
  │   │   └─→ Show edit modal with fields:
  │   │       ├─ URL (text input)
  │   │       ├─ Version (text input)
  │   │       ├─ Checksum (text input)
  │   │       └─ Mirrors (list editor)
  │   │
  │   ├─→ User edits fields
  │   │   └─→ Click "Save"
  │   │       └─→ Call bash script: write_config.sh
  │   │           ├─→ SUCCESS: Update UI, show success toast
  │   │           └─→ FAIL: Show error, restore original values
  │   │
  │   └─→ Modal closes, main tab refreshes
  │
  ├─→ SCENARIO 3: Download Binary
  │   │
  │   ├─→ User clicks "Download" button
  │   │   └─→ Show progress indicator (%)
  │   │       └─→ Call download script (to be created)
  │   │           ├─→ IN PROGRESS: Update progress bar
  │   │           ├─→ SUCCESS: Show ✅, update status
  │   │           └─→ FAIL: Show ❌, keep as "Not Downloaded"
  │   │
  │   └─→ Enable "Test URL" and "Edit" after completion
  │
  ├─→ SCENARIO 4: View Mirrors
  │   │
  │   ├─→ User clicks "View Mirrors"
  │   │   └─→ Show expandable list of mirror URLs
  │   │       └─→ Each mirror has [Test] button
  │   │           └─→ Same test flow as main URL
  │   │
  │   └─→ User can select preferred mirror (saved to config)
  │
  └─→ SCENARIO 5: Edit Global Settings
      │
      ├─→ User clicks "Edit Global Settings"
      │   └─→ Show modal with fields:
      │       ├─ Timeout (number input)
      │       ├─ Retry Count (number input)
      │       ├─ Verify Checksum (toggle)
      │       └─ Skip Existing (toggle)
      │
      ├─→ User saves changes
      │   └─→ Call write_config.sh for options section
      │
      └─→ Update UI with new values

END
```

---

## 📦 Component Structure

```
DownloadsTab.tsx
├── DownloadItem (repeated for each binary)
│   ├── Status Icon (✅ / ⚪ / ⏳ / ❌)
│   ├── Name & Version
│   ├── Size & Status Text
│   ├── URL Display (truncated)
│   ├── Mirror Count
│   └── Action Buttons
│       ├── Test URL
│       ├── Edit
│       ├── Download
│       └── View Mirrors
│
├── GlobalSettingsCard
│   ├── Current Settings Display
│   └── Edit Button
│
└── Modals
    ├── EditDownloadModal
    ├── MirrorsModal
    └── GlobalSettingsModal
```

---

## 🎨 Visual States

### Status Indicators
- ✅ **Downloaded** (Green #3FBF75)
- ⚪ **Not Downloaded** (Gray #A8AEBF)
- ⏳ **Downloading...** (Blue #4BA3E6 + spinner)
- ❌ **Failed** (Red #D95757)

### Buttons States
- **Test URL**: Blue (#4BA3E6)
- **Edit**: Purple (#6A5AEC)
- **Download**: Green (#3FBF75)
- **View Mirrors**: Gray (#1B1F28)

### Hover Effects
- Darken by 10-15%
- Smooth transition (150ms)

---

## 🔧 Implementation Tasks (Phase 4.2)

### Frontend (React/TypeScript)
- [ ] Fetch data from downloads.yaml via bash script
- [ ] Implement DownloadItem component with all states
- [ ] Create EditDownloadModal component
- [ ] Create MirrorsModal component
- [ ] Create GlobalSettingsModal component
- [ ] Implement URL testing with real-time feedback
- [ ] Add toast notifications for actions
- [ ] Handle loading/error states

### Backend (Bash Scripts)
- [ ] Enhance read_config.sh for nested YAML reading
- [ ] Test write_config.sh with real config updates
- [ ] Add download_binary.sh script (if needed)
- [ ] Implement checksum verification

### Integration
- [ ] Connect UI buttons to bash scripts via Electron IPC
- [ ] Handle async script execution
- [ ] Implement proper error handling
- [ ] Add confirmation dialogs for destructive actions

---

## 🧪 Testing Checklist
- [ ] Test URL button shows correct response
- [ ] Edit modal saves changes to YAML
- [ ] Download progress updates correctly
- [ ] Mirrors modal displays all mirrors
- [ ] Global settings persist after save
- [ ] Error states display properly
- [ ] All buttons disabled during operations
- [ ] Keyboard navigation works (Tab, Enter, Esc)

---

## 🎯 Success Criteria
✅ User can view all available downloads from downloads.yaml
✅ User can test URLs and see response time/status
✅ User can edit download configurations
✅ User can manage mirrors and select preferred source
✅ User can configure global download settings
✅ All changes persist to YAML files
✅ UI provides clear feedback for all actions

---

**Ready for implementation?** Tunggu konfirmasi untuk mulai Phase 4.2! 🚀
