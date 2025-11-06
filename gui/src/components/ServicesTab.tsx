// NOREX V3.6 - Services Tab (Redesigned - Modern & Functional)
import React, { useState } from 'react';
import { Server, Database, Globe, FileCode, Power, Settings as SettingsIcon } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  icon: any;
  port: string;
  enabled: boolean;
  autostart: boolean;
  description: string;
}

const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    { 
      id: 'mysql',
      name: 'MySQL', 
      icon: Database, 
      port: '3306', 
      enabled: true, 
      autostart: true,
      description: 'MySQL Database Server'
    },
    { 
      id: 'apache',
      name: 'Apache', 
      icon: Server, 
      port: '8080', 
      enabled: true, 
      autostart: true,
      description: 'Apache HTTP Server'
    },
    { 
      id: 'phpmyadmin',
      name: 'phpMyAdmin', 
      icon: Globe, 
      port: '8081', 
      enabled: true, 
      autostart: true,
      description: 'Database Management Interface'
    },
    { 
      id: 'php',
      name: 'PHP', 
      icon: FileCode, 
      port: '-', 
      enabled: true, 
      autostart: false,
      description: 'PHP Runtime Environment'
    },
  ]);

  const handleToggleEnabled = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const handleToggleAutostart = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, autostart: !s.autostart } : s
    ));
  };

  return (
    <div className="space-y-4" style={{ minHeight: '450px' }}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Service Configuration
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure service ports, paths, and startup behavior
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="p-4 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                opacity: service.enabled ? 1 : 0.6,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Icon + Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--bg-hover)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent-purple)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {service.name}
                      </span>
                      {service.enabled && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--accent-green)', color: '#FFFFFF' }}
                        >
                          Enabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {service.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Port: <span style={{ color: 'var(--text-primary)' }}>{service.port}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex flex-col gap-3">
                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Enabled</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={service.enabled}
                        onChange={() => handleToggleEnabled(service.id)}
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ backgroundColor: service.enabled ? 'var(--accent-purple)' : 'var(--bg-hover)' }}
                      ></div>
                    </label>
                  </div>

                  {/* Autostart Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Autostart</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={service.autostart}
                        onChange={() => handleToggleAutostart(service.id)}
                      />
                      <div
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{ backgroundColor: service.autostart ? 'var(--accent-green)' : 'var(--bg-hover)' }}
                      ></div>
                    </label>
                  </div>

                  {/* Configure Button */}
                  <button
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 justify-center"
                    style={{ backgroundColor: 'var(--accent-blue)', color: '#FFFFFF' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <SettingsIcon className="w-3 h-3" />
                    Configure
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          🚀 Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 justify-center"
            style={{ backgroundColor: 'var(--accent-green)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Power className="w-4 h-4" />
            Start All
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2 justify-center"
            style={{ backgroundColor: 'var(--accent-red)', color: '#FFFFFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Power className="w-4 h-4" />
            Stop All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesTab;
