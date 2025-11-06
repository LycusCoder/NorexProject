// NOREX V3.6 - Services Tab (Placeholder for Phase 4.3)
import React from 'react';
import { Server, Database, Globe, FileCode } from 'lucide-react';

const ServicesTab: React.FC = () => {
  // Placeholder data - will be dynamic in Phase 4.3
  const services = [
    { name: 'MySQL', icon: Database, port: '3306', enabled: true, autostart: true },
    { name: 'Apache', icon: Server, port: '8080', enabled: true, autostart: true },
    { name: 'phpMyAdmin', icon: Globe, port: '8081', enabled: true, autostart: true },
    { name: 'PHP', icon: FileCode, port: '-', enabled: true, autostart: false },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: '#E9ECF2' }}>
          Service Configuration
        </h3>
        <p className="text-sm" style={{ color: '#A8AEBF' }}>
          Configure service ports, paths, and startup behavior
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: '#0F1117',
                borderColor: 'rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#1B1F28' }}
                >
                  <Icon className="w-5 h-5" style={{ color: '#6A5AEC' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium" style={{ color: '#E9ECF2' }}>
                      {service.name}
                    </span>
                    {service.enabled && (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#3FBF75', color: '#FFFFFF' }}
                      >
                        Enabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs" style={{ color: '#A8AEBF' }}>
                      Port: {service.port}
                    </span>
                    <span className="text-xs" style={{ color: '#A8AEBF' }}>
                      Autostart: {service.autostart ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
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
          );
        })}
      </div>

      {/* Placeholder Notice */}
      <div
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: '#0F1117', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <p className="text-sm" style={{ color: '#A8AEBF' }}>
          ℹ️ <strong>Phase 4.3:</strong> Full service management features will be implemented
          here, including enable/disable toggles, port editing, and path configuration.
        </p>
      </div>
    </div>
  );
};

export default ServicesTab;
