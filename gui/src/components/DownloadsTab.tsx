// NOREX V3.6 - Downloads Tab (Placeholder for Phase 4.2)
import React from 'react';
import { Download, CheckCircle, XCircle, Clock } from 'lucide-react';

const DownloadsTab: React.FC = () => {
  // Placeholder data - will be dynamic in Phase 4.2
  const downloads = [
    { name: 'Apache HTTP Server', version: '2.4.62', status: 'downloaded', size: '9.2 MB' },
    { name: 'MySQL Server', version: '8.4.3', status: 'downloaded', size: '567 MB' },
    { name: 'PHP', version: '8.3.26', status: 'not_downloaded', size: '18.5 MB' },
    { name: 'phpMyAdmin', version: '5.2.1', status: 'not_downloaded', size: '12.1 MB' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'downloaded':
        return <CheckCircle className="w-5 h-5" style={{ color: '#3FBF75' }} />;
      case 'failed':
        return <XCircle className="w-5 h-5" style={{ color: '#D95757' }} />;
      case 'downloading':
        return <Clock className="w-5 h-5 animate-spin" style={{ color: '#4BA3E6' }} />;
      default:
        return <Download className="w-5 h-5" style={{ color: '#A8AEBF' }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'Downloaded';
      case 'failed':
        return 'Failed';
      case 'downloading':
        return 'Downloading...';
      default:
        return 'Not Downloaded';
    }
  };

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

      {/* Downloads List */}
      <div className="space-y-3">
        {downloads.map((download, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border transition-all duration-150"
            style={{
              backgroundColor: '#0F1117',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center space-x-4 flex-1">
              <div>{getStatusIcon(download.status)}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium" style={{ color: '#E9ECF2' }}>
                    {download.name}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#1B1F28', color: '#A8AEBF' }}
                  >
                    v{download.version}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs" style={{ color: '#A8AEBF' }}>
                    Size: {download.size}
                  </span>
                  <span className="text-xs" style={{ color: '#6A5AEC' }}>
                    {getStatusText(download.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150"
                style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3A93D6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4BA3E6')}
              >
                Test URL
              </button>
              <button
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150"
                style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5A4ADC')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6A5AEC')}
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Notice */}
      <div
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <p className="text-sm" style={{ color: '#A8AEBF' }}>
          ℹ️ <strong>Phase 4.2:</strong> Full download management features will be implemented
          here, including URL testing, mirror configuration, and real-time status updates.
        </p>
      </div>
    </div>
  );
};

export default DownloadsTab;
