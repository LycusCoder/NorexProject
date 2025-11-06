// NOREX V3.6 - Advanced Tab (Redesigned - Modern & Organized)
import React, { useState } from 'react';
import { Save, RotateCcw, FileText, Settings, Shield, Bell, Palette } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [minimizeToTray, setMinimizeToTray] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const [enableBackupReminder, setEnableBackupReminder] = useState(true);

  return (
    <div className="space-y-4" style={{ minHeight: '450px' }}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Advanced Settings
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Backup/restore configurations, view logs, and manage system settings
        </p>
      </div>

      {/* Backup & Restore Section */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-hover)' }}
          >
            <Save className="w-4 h-4" style={{ color: 'var(--accent-green)' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Backup & Restore
            </h4>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Manage configuration backups
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 justify-center"
            style={{ backgroundColor: 'var(--accent-green)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Save className="w-4 h-4" />
            Create Backup
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 justify-center"
            style={{ backgroundColor: 'var(--accent-blue)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <RotateCcw className="w-4 h-4" />
            Restore
          </button>
        </div>
      </div>

      {/* Log Management Section */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-hover)' }}
          >
            <FileText className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Log Management
            </h4>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              View and manage system logs
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 justify-center"
            style={{ backgroundColor: 'var(--accent-purple)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <FileText className="w-4 h-4" />
            View Logs
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 justify-center"
            style={{ backgroundColor: 'var(--accent-red)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <RotateCcw className="w-4 h-4" />
            Clear Logs
          </button>
        </div>
      </div>

      {/* System Preferences */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--bg-hover)' }}
          >
            <Settings className="w-4 h-4" style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              System Preferences
            </h4>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Configure application behavior
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {/* Auto-update Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Auto-update on startup
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Check for updates when application starts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={autoUpdate}
                onChange={() => setAutoUpdate(!autoUpdate)}
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: autoUpdate ? 'var(--accent-purple)' : 'var(--bg-hover)' }}
              ></div>
            </label>
          </div>

          {/* Minimize to Tray Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Minimize to tray
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Keep application running in system tray
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={minimizeToTray}
                onChange={() => setMinimizeToTray(!minimizeToTray)}
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: minimizeToTray ? 'var(--accent-purple)' : 'var(--bg-hover)' }}
              ></div>
            </label>
          </div>

          {/* Show Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Show notifications
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Display system notifications for important events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={showNotifications}
                onChange={() => setShowNotifications(!showNotifications)}
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: showNotifications ? 'var(--accent-purple)' : 'var(--bg-hover)' }}
              ></div>
            </label>
          </div>

          {/* Backup Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Backup reminders
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Remind to backup configurations weekly
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={enableBackupReminder}
                onChange={() => setEnableBackupReminder(!enableBackupReminder)}
              />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: enableBackupReminder ? 'var(--accent-purple)' : 'var(--bg-hover)' }}
              ></div>
            </label>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        className="mt-4 p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          ℹ️ About Norex v3.6
        </h4>
        <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <p>• Version: 3.6.0</p>
          <p>• Build Date: 2025-01-15</p>
          <p>• Runtime: Electron + React</p>
          <p>• License: Proprietary</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTab;
