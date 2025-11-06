// NOREX V3.6 - Downloads Tab (Redesigned - Modern & Responsive)
import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Loader, Edit, Globe, Settings, AlertCircle } from 'lucide-react';
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
  const [projectRoot, setProjectRoot] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; binary: Binary | null }>({ open: false, binary: null });
  const [mirrorsModal, setMirrorsModal] = useState<{ open: boolean; binary: Binary | null }>({ open: false, binary: null });
  const [settingsModal, setSettingsModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Get project root on mount
  useEffect(() => {
    const initProjectRoot = async () => {
      try {
        const root = await window.electron.getProjectRoot();
        console.log('✅ Project root loaded from electron:', root);
        setProjectRoot(root);
      } catch (err) {
        console.error('❌ Failed to get project root from electron:', err);
        setProjectRoot('/app');
      }
    };
    initProjectRoot();
  }, []);

  // Fetch downloads data
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const scriptPath = `${projectRoot}/scripts/config/get_all_downloads.sh`;
      console.log('📂 Executing script:', scriptPath);
      const result = await window.electron.executeBashScript(scriptPath);
      const data = JSON.parse(result);

      if (data.error) {
        throw new Error(data.error);
      }

      const binaryKeys = Object.keys(data.binaries || {});
      const binaryList = await Promise.all(
        binaryKeys.map(async (key) => {
          const binary = data.binaries[key];
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
    if (projectRoot) {
      console.log('🚀 Fetching downloads with project root:', projectRoot);
      fetchDownloads();
    }
  }, [projectRoot]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTestUrl = async (binary: Binary) => {
    setTestingUrl(binary.key);
    try {
      const result = await window.electron.executeBashScript(
        `${projectRoot}/scripts/config/test_download.sh "${binary.url}" 10`
      );
      const data = JSON.parse(result);

      if (data.success) {
        showToast(`✅ ${binary.name}: ${data.response_time} (HTTP ${data.http_code})`, 'success');
      } else {
        showToast(`❌ ${binary.name}: ${data.error}`, 'error');
      }
    } catch (err: any) {
      showToast(`Failed to test URL: ${err.message}`, 'error');
    } finally {
      setTestingUrl(null);
    }
  };

  const handleTestMirror = async (url: string) => {
    const result = await window.electron.executeBashScript(
      `${projectRoot}/scripts/config/test_download.sh "${url}" 10`
    );
    return JSON.parse(result);
  };

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
      await fetchDownloads();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update configuration');
    }
  };

  const handleSaveGlobalSettings = async (settings: any) => {
    try {
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

  const getStatusIcon = (binary: Binary) => {
    if (binary.downloaded) {
      return <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent-green)' }} />;
    }
    return <Download className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />;
  };

  return (
    <div className="space-y-4" style={{ minHeight: '450px' }}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Download Management
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Manage download sources, test URLs, and configure mirrors
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border animate-slide-in"
          style={{
            backgroundColor: toast.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
            borderColor: 'rgba(255,255,255,0.2)',
            color: '#FFFFFF',
            maxWidth: '400px',
          }}
        >
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Loading Overlay - FIXED: Does not collapse layout */}
      {(!projectRoot || loading) && (
        <div className="absolute inset-0 flex items-center justify-center z-10"
          style={{ 
            backgroundColor: 'rgba(15, 17, 23, 0.8)',
            backdropFilter: 'blur(4px)',
            borderRadius: '12px'
          }}
        >
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: 'var(--accent-purple)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {!projectRoot ? 'Loading project root...' : 'Loading downloads...'}
            </p>
          </div>
        </div>
      )}

      {/* Downloads List */}
      <div className="space-y-3" style={{ opacity: loading ? 0.3 : 1, transition: 'opacity 0.2s' }}>
        {binaries.length === 0 && !loading ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No downloads configured</p>
          </div>
        ) : (
          binaries.map((binary) => (
            <div
              key={binary.key}
              className="p-4 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="mt-1">{getStatusIcon(binary)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {binary.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                      >
                        v{binary.version}
                      </span>
                    </div>
                    <p className="text-xs mb-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                      {binary.url}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Status: {binary.downloaded ? '✅ Downloaded' : '⚪ Not Downloaded'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--accent-purple)' }}>
                        Mirrors: {binary.mirrors.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleTestUrl(binary)}
                    disabled={testingUrl === binary.key}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--accent-blue)', color: '#FFFFFF' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
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
                    style={{ backgroundColor: 'var(--accent-purple)', color: '#FFFFFF' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setMirrorsModal({ open: true, binary })}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-secondary)' }}
                  >
                    <Globe className="w-3 h-3" />
                    Mirrors
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Global Settings Card */}
      <div
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', opacity: loading ? 0.3 : 1 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              ℹ️ Global Download Settings
            </h4>
            <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <p>• Timeout: {globalSettings.timeout || 30}s</p>
              <p>• Retry Count: {globalSettings.retry_count || 3}</p>
              <p>• Verify Checksum: {globalSettings.verify_checksum ? 'Enabled' : 'Disabled'}</p>
              <p>• Skip Existing: {globalSettings.skip_existing ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModal(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent-purple)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
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
