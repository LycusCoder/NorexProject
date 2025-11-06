// NOREX V3.6 - Downloads Tab (Phase 4.2 - Full Implementation)
import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, XCircle, Clock, Edit, Globe, Settings, Loader } from 'lucide-react';
import EditDownloadModal from './modals/EditDownloadModal';
import MirrorsModal from './modals/MirrorsModal';
import GlobalSettingsModal from './modals/GlobalSettingsModal';

interface Binary {
  key: string;
  name: string;
  version: string;
  url: string;
  mirrors: string[];
  checksum: string;
  extract_to: string;
  archive_name: string;
  downloaded: boolean;
}

const DownloadsTab: React.FC = () => {
  const [binaries, setBinaries] = useState<Binary[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [testingUrl, setTestingUrl] = useState<string | null>(null);
  const [projectRoot, setProjectRoot] = useState<string>('/app'); // Default fallback
  const [editModal, setEditModal] = useState<{ open: boolean; binary: Binary | null }>({
    open: false,
    binary: null,
  });
  const [mirrorsModal, setMirrorsModal] = useState<{ open: boolean; binary: Binary | null }>({
    open: false,
    binary: null,
  });
  const [settingsModal, setSettingsModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Get project root on mount
  useEffect(() => {
    const initProjectRoot = async () => {
      try {
        const root = await window.electron.getProjectRoot();
        setProjectRoot(root);
      } catch (err) {
        console.error('Failed to get project root, using default /app:', err);
      }
    };
    initProjectRoot();
  }, []);

  // Fetch downloads data
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      // FIXED: Removed /bin/bash prefix for cross-platform compatibility
      const result = await window.electron.executeBashScript(`${projectRoot}/scripts/config/get_all_downloads.sh`);
      const data = JSON.parse(result);

      if (data.error) {
        throw new Error(data.error);
      }

      // Convert binaries object to array with download status
      const binaryKeys = Object.keys(data.binaries || {});
      const binaryList = await Promise.all(
        binaryKeys.map(async (key) => {
          const binary = data.binaries[key];
          
          // Check if downloaded
          const statusResult = await window.electron.executeBashScript(
            `${projectRoot}/scripts/config/check_downloaded.sh ${key}`
          );
          const status = JSON.parse(statusResult);

          return {
            key,
            name: binary.name,
            version: binary.version,
            url: binary.url,
            mirrors: binary.mirrors || [],
            checksum: binary.checksum,
            extract_to: binary.extract_to,
            archive_name: binary.archive_name,
            downloaded: status.downloaded || false,
          };
        })
      );

      setBinaries(binaryList);
      setGlobalSettings(data.options || {});
    } catch (err: any) {
      showToast('Failed to load downloads: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch downloads only after projectRoot is set
    if (projectRoot) {
      fetchDownloads();
    }
  }, [projectRoot]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Test URL
  const handleTestUrl = async (binary: Binary) => {
    setTestingUrl(binary.key);
    try {
      const result = await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/test_download.sh "${binary.url}" 10`
      );
      const data = JSON.parse(result);

      if (data.success) {
        showToast(
          `✅ ${binary.name}: ${data.response_time} (HTTP ${data.http_code})`,
          'success'
        );
      } else {
        showToast(`❌ ${binary.name}: ${data.error}`, 'error');
      }
    } catch (err: any) {
      showToast(`Failed to test URL: ${err.message}`, 'error');
    } finally {
      setTestingUrl(null);
    }
  };

  // Test mirror URL
  const handleTestMirror = async (url: string) => {
    const result = await window.electron.executeBashScript(
      `${projectRoot}/scripts/config/test_download.sh "${url}" 10`
    );
    return JSON.parse(result);
  };

  // Save download configuration
  const handleSaveDownload = async (binaryKey: string, updates: any) => {
    try {
      const result = await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/update_download.sh ${binaryKey} ${updates.field} "${updates.value}"`
      );
      const data = JSON.parse(result);

      if (data.error) {
        throw new Error(data.error);
      }

      showToast('Configuration updated successfully', 'success');
      await fetchDownloads(); // Refresh data
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update configuration');
    }
  };

  // Save global settings
  const handleSaveGlobalSettings = async (settings: any) => {
    try {
      // Update each setting
      await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/update_global_settings.sh timeout ${settings.timeout}`
      );
      await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/update_global_settings.sh retry_count ${settings.retry_count}`
      );
      await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/update_global_settings.sh verify_checksum ${settings.verify_checksum}`
      );
      await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/update_global_settings.sh skip_existing ${settings.skip_existing}`
      );

      showToast('Global settings updated successfully', 'success');
      await fetchDownloads();
    } catch (err: any) {
      showToast('Failed to save global settings: ' + err.message, 'error');
    }
  };

  // Get status icon
  const getStatusIcon = (binary: Binary) => {
    if (binary.downloaded) {
      return <CheckCircle className="w-5 h-5" style={{ color: '#3FBF75' }} />;
    }
    return <Download className="w-5 h-5" style={{ color: '#A8AEBF' }} />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#6A5AEC' }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: '#E9ECF2' }}>
          Download Management
        </h3>
        <p className="text-sm" style={{ color: '#A8AEBF' }}>
          Manage download sources, test URLs, and configure mirrors
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border animate-slide-in"
          style={{
            backgroundColor: toast.type === 'success' ? '#3FBF75' : '#D95757',
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            maxWidth: '400px',
          }}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Downloads List */}
      <div className="space-y-3">
        {binaries.map((binary) => (
          <div
            key={binary.key}
            className="p-4 rounded-lg border transition-all duration-150"
            style={{
              backgroundColor: '#0F1117',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left: Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="mt-1">{getStatusIcon(binary)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: '#E9ECF2' }}>
                      {binary.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#1B1F28', color: '#A8AEBF' }}
                    >
                      v{binary.version}
                    </span>
                  </div>
                  <p className="text-xs mb-1 truncate" style={{ color: '#A8AEBF' }}>
                    {binary.url}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#A8AEBF' }}>
                      Status: {binary.downloaded ? '✅ Downloaded' : '⚪ Not Downloaded'}
                    </span>
                    <span className="text-xs" style={{ color: '#6A5AEC' }}>
                      Mirrors: {binary.mirrors.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleTestUrl(binary)}
                  disabled={testingUrl === binary.key}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
                  style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3A93D6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4BA3E6')}
                >
                  {testingUrl === binary.key ? (
                    <>
                      <Loader className="w-3 h-3 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test URL'
                  )}
                </button>
                <button
                  onClick={() => setEditModal({ open: true, binary })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
                  style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5A4ADC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6A5AEC')}
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => setMirrorsModal({ open: true, binary })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
                  style={{ backgroundColor: '#1B1F28', color: '#A8AEBF' }}
                >
                  <Globe className="w-3 h-3" />
                  Mirrors
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Settings Card */}
      <div
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#E9ECF2' }}>
              ℹ️ Global Download Settings
            </h4>
            <div className="space-y-1 text-xs" style={{ color: '#A8AEBF' }}>
              <p>• Timeout: {globalSettings.timeout}s</p>
              <p>• Retry Count: {globalSettings.retry_count}</p>
              <p>• Verify Checksum: {globalSettings.verify_checksum ? 'Enabled' : 'Disabled'}</p>
              <p>• Skip Existing: {globalSettings.skip_existing ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModal(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2"
            style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
          >
            <Settings className="w-3 h-3" />
            Edit Settings
          </button>
        </div>
      </div>

      {/* Modals */}
      <EditDownloadModal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, binary: null })}
        binary={editModal.binary}
        onSave={handleSaveDownload}
      />

      <MirrorsModal
        isOpen={mirrorsModal.open}
        onClose={() => setMirrorsModal({ open: false, binary: null })}
        binary={mirrorsModal.binary}
        onTestMirror={handleTestMirror}
      />

      <GlobalSettingsModal
        isOpen={settingsModal}
        onClose={() => setSettingsModal(false)}
        settings={globalSettings}
        onSave={handleSaveGlobalSettings}
      />
    </div>
  );
};

export default DownloadsTab;
