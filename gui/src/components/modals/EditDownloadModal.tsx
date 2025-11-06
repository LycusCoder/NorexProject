import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  binary: any;
  onSave: (binaryKey: string, updates: any) => Promise<void>;
}

const EditDownloadModal: React.FC<EditDownloadModalProps> = ({ isOpen, onClose, binary, onSave }) => {
  const [url, setUrl] = useState('');
  const [version, setVersion] = useState('');
  const [checksum, setChecksum] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (binary) {
      setUrl(binary.url || '');
      setVersion(binary.version || '');
      setChecksum(binary.checksum || '');
    }
  }, [binary]);

  if (!isOpen || !binary) return null;

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      // Save each field individually
      if (url !== binary.url) {
        await onSave(binary.key, { field: 'url', value: url });
      }
      if (version !== binary.version) {
        await onSave(binary.key, { field: 'version', value: version });
      }
      if (checksum !== binary.checksum) {
        await onSave(binary.key, { field: 'checksum', value: checksum });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
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
        className="w-full max-w-2xl rounded-xl border p-6 shadow-2xl"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: '#E9ECF2' }}>
              Edit Download Configuration
            </h2>
            <p className="text-sm mt-1" style={{ color: '#A8AEBF' }}>
              {binary.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
            style={{ backgroundColor: '#1B1F28' }}
          >
            <X className="w-5 h-5" style={{ color: '#A8AEBF' }} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg mb-4"
            style={{ backgroundColor: '#D95757', color: '#FFFFFF' }}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#E9ECF2' }}>
              Download URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#1B1F28',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#E9ECF2',
              }}
              placeholder="https://..."
            />
          </div>

          {/* Version */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#E9ECF2' }}>
              Version
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#1B1F28',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#E9ECF2',
              }}
              placeholder="1.0.0"
            />
          </div>

          {/* Checksum */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#E9ECF2' }}>
              Checksum
            </label>
            <input
              type="text"
              value={checksum}
              onChange={(e) => setChecksum(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#1B1F28',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#E9ECF2',
              }}
              placeholder="sha256:..."
            />
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDownloadModal;
