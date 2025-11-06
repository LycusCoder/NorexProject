import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: any;
  onSave: (settings: any) => Promise<void>;
}

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [timeout, setTimeout] = useState(300);
  const [retryCount, setRetryCount] = useState(3);
  const [verifyChecksum, setVerifyChecksum] = useState(false);
  const [skipExisting, setSkipExisting] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setTimeout(settings.timeout || 300);
      setRetryCount(settings.retry_count || 3);
      setVerifyChecksum(settings.verify_checksum || false);
      setSkipExisting(settings.skip_existing !== false);
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        timeout,
        retry_count: retryCount,
        verify_checksum: verifyChecksum,
        skip_existing: skipExisting,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border p-6 shadow-2xl"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#E9ECF2' }}>
                Global Download Settings
              </h2>
              <p className="text-sm mt-1" style={{ color: '#A8AEBF' }}>
                Configure default download behavior
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
            style={{ backgroundColor: '#1B1F28' }}
          >
            <X className="w-5 h-5" style={{ color: '#A8AEBF' }} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Timeout */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#E9ECF2' }}>
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value) || 300)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#1B1F28',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#E9ECF2',
              }}
              min="10"
              max="3600"
            />
          </div>

          {/* Retry Count */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#E9ECF2' }}>
              Retry Count
            </label>
            <input
              type="number"
              value={retryCount}
              onChange={(e) => setRetryCount(parseInt(e.target.value) || 3)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#1B1F28',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#E9ECF2',
              }}
              min="1"
              max="10"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {/* Verify Checksum */}
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1B1F28' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#E9ECF2' }}>
                  Verify Checksum
                </p>
                <p className="text-xs mt-1" style={{ color: '#A8AEBF' }}>
                  Validate file integrity after download
                </p>
              </div>
              <button
                onClick={() => setVerifyChecksum(!verifyChecksum)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: verifyChecksum ? '#3FBF75' : '#2A2E39' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{ transform: verifyChecksum ? 'translateX(24px)' : 'translateX(4px)' }}
                />
              </button>
            </div>

            {/* Skip Existing */}
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#1B1F28' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#E9ECF2' }}>
                  Skip Existing Files
                </p>
                <p className="text-xs mt-1" style={{ color: '#A8AEBF' }}>
                  Don't re-download if file exists
                </p>
              </div>
              <button
                onClick={() => setSkipExisting(!skipExisting)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ backgroundColor: skipExisting ? '#3FBF75' : '#2A2E39' }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  style={{ transform: skipExisting ? 'translateX(24px)' : 'translateX(4px)' }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: '#1B1F28', color: '#A8AEBF' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsModal;
