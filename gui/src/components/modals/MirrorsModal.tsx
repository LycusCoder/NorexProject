import React, { useState } from 'react';
import { X, Globe, CheckCircle, XCircle, Loader } from 'lucide-react';

interface MirrorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  binary: any;
  onTestMirror: (url: string) => Promise<any>;
}

const MirrorsModal: React.FC<MirrorsModalProps> = ({ isOpen, onClose, binary, onTestMirror }) => {
  const [testingMirror, setTestingMirror] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({});

  if (!isOpen || !binary) return null;

  const mirrors = binary.mirrors || [];
  const allUrls = [binary.url, ...mirrors];

  const handleTestMirror = async (url: string) => {
    setTestingMirror(url);
    try {
      const result = await onTestMirror(url);
      setTestResults((prev) => ({ ...prev, [url]: result }));
    } catch (err: any) {
      setTestResults((prev) => ({ ...prev, [url]: { success: false, error: err.message } }));
    } finally {
      setTestingMirror(null);
    }
  };

  const getResultIcon = (url: string) => {
    if (testingMirror === url) {
      return <Loader className="w-4 h-4 animate-spin" style={{ color: '#4BA3E6' }} />;
    }
    const result = testResults[url];
    if (!result) return null;
    if (result.success) {
      return <CheckCircle className="w-4 h-4" style={{ color: '#3FBF75' }} />;
    }
    return <XCircle className="w-4 h-4" style={{ color: '#D95757' }} />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl border p-6 shadow-2xl"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: '#E9ECF2' }}>
              Download Mirrors
            </h2>
            <p className="text-sm mt-1" style={{ color: '#A8AEBF' }}>
              {binary.name} - {allUrls.length} source{allUrls.length > 1 ? 's' : ''} available
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

        {/* Mirrors List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allUrls.map((url, index) => {
            const result = testResults[url];
            return (
              <div
                key={index}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#1B1F28', borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#6A5AEC' }} />
                      <span className="text-xs font-medium" style={{ color: '#A8AEBF' }}>
                        {index === 0 ? 'Primary' : `Mirror ${index}`}
                      </span>
                    </div>
                    <p className="text-sm break-all" style={{ color: '#E9ECF2' }}>
                      {url}
                    </p>
                    {result && (
                      <div className="mt-2 text-xs" style={{ color: '#A8AEBF' }}>
                        {result.success ? (
                          <span>
                            ✅ Response: {result.response_time} • HTTP {result.http_code}
                            {result.file_size && ` • Size: ${result.file_size}`}
                          </span>
                        ) : (
                          <span style={{ color: '#D95757' }}>❌ {result.error}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleTestMirror(url)}
                    disabled={testingMirror === url}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex-shrink-0"
                    style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
                  >
                    {getResultIcon(url)}
                    {testingMirror === url ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: '#1B1F28', color: '#A8AEBF' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MirrorsModal;
