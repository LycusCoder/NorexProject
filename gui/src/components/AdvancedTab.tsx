// NOREX V3.6 - Advanced Tab (Placeholder for Phase 4.4)
import React from 'react';
import { Save, RotateCcw, FileText, Settings } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: '#E9ECF2' }}>
          Advanced Settings
        </h3>
        <p className="text-sm" style={{ color: '#A8AEBF' }}>
          Backup/restore configurations, view logs, and manage system settings
        </p>
      </div>

      {/* Backup & Restore Section */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Save className="w-5 h-5" style={{ color: '#6A5AEC' }} />
          <h4 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>
            Backup & Restore
          </h4>
        </div>
        <p className="text-xs mb-4" style={{ color: '#A8AEBF' }}>
          Create backups of your configuration files or restore from previous backups
        </p>
        <div className="flex items-center space-x-2">
          <button
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
            style={{ backgroundColor: '#3FBF75', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2FAF65')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3FBF75')}
          >
            Create Backup
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
            style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3A93D6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4BA3E6')}
          >
            Restore Backup
          </button>
        </div>
      </div>

      {/* Log Management Section */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <FileText className="w-5 h-5" style={{ color: '#6A5AEC' }} />
          <h4 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>
            Log Management
          </h4>
        </div>
        <p className="text-xs mb-4" style={{ color: '#A8AEBF' }}>
          View and manage system logs for debugging and monitoring
        </p>
        <div className="flex items-center space-x-2">
          <button
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
            style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5A4ADC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6A5AEC')}
          >
            View Logs
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
            style={{ backgroundColor: '#D95757', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C94747')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D95757')}
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* System Settings Section */}
      <div
        className="p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Settings className="w-5 h-5" style={{ color: '#6A5AEC' }} />
          <h4 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>
            System Settings
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#E9ECF2' }}>
                Auto-update on startup
              </p>
              <p className="text-xs" style={{ color: '#A8AEBF' }}>
                Check for updates when application starts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: '#6A5AEC' }}
              ></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#E9ECF2' }}>
                Minimize to tray
              </p>
              <p className="text-xs" style={{ color: '#A8AEBF' }}>
                Keep application running in system tray
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: '#4A5568' }}
              ></div>
            </label>
          </div>
        </div>
      </div>

      {/* Placeholder Notice */}
      <div
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <p className="text-sm" style={{ color: '#A8AEBF' }}>
          ℹ️ <strong>Phase 4.4:</strong> Full advanced features will be implemented here,
          including functional backup/restore, log viewer, and system preferences.
        </p>
      </div>
    </div>
  );
};

export default AdvancedTab;
