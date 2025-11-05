// NorexProject v3.0 - Dashboard Interface
import React, { useState, useEffect } from 'react';
import { Minimize, X, Settings, Zap, RotateCw, Power, Terminal, Database, Globe, ChevronDown } from 'lucide-react';

interface Service {
  name: string;
  version: string;
  port: string;
  status: 'running' | 'stopped' | 'locked';
  icon: string;
}

const App: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    { name: 'Apache', version: '2.4.62', port: '80/443', status: 'running', icon: '✔' },
    { name: 'MySQL', version: '8.4.3', port: '3306', status: 'running', icon: '✔' },
    { name: 'Redis', version: '5.0.14.1', port: '6379', status: 'running', icon: '✔' },
    { name: 'Nginx', version: '1.22.0', port: '8080/8443', status: 'locked', icon: '🔒' },
    { name: 'PostgreSQL', version: '15.10', port: '5432', status: 'stopped', icon: '─' },
    { name: 'Memcached', version: '1.6.8', port: '11211', status: 'stopped', icon: '─' },
  ]);

  const [activeTime, setActiveTime] = useState('00:00:00');
  const [ipAddress] = useState('192.168.1.141');
  const [projectRoot] = useState('/app/www/myproject');
  const [projectDomain] = useState('myproject.local');

  // Active time counter
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      setActiveTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMinimize = () => {
    window.electron.minimize();
  };

  const handleClose = () => {
    window.electron.close();
  };

  const handleServiceAction = (serviceName: string, action: string) => {
    console.log(`${action} ${serviceName}`);
    // Add actual service control logic here
  };

  const handleOpenBrowser = () => {
    console.log('Opening in browser...');
  };

  const handleOpenDatabase = () => {
    console.log('Opening database panel...');
  };

  const handleOpenTerminal = () => {
    console.log('Opening terminal...');
  };

  return (
    <div className="w-full h-screen overflow-hidden" style={{ backgroundColor: '#0F1117' }}>
      {/* Main Window Container - Premium Dark */}
      <div className="w-full h-full flex flex-col text-gray-100 overflow-hidden" style={{ backgroundColor: '#161920' }}>
        
        {/* Custom Title Bar with Logo and Settings */}
        <div 
          className="flex items-center justify-between px-4 py-3 select-none border-b"
          style={{ 
            WebkitAppRegion: 'drag',
            backgroundColor: '#0F1117',
            borderBottomColor: 'rgba(255,255,255,0.05)'
          } as any}
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{
              background: 'linear-gradient(120deg, #B06EFF 0%, #6A5AEC 100%)'
            }}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>
              Norex
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 pointer-events-auto" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: '#A8AEBF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1B1F28'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleMinimize} 
              title="Minimize" 
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: '#A8AEBF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1B1F28'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Minimize className="w-4 h-4" />
            </button>
            <button 
              onClick={handleClose} 
              title="Close" 
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-150"
              style={{ color: '#A8AEBF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D95757';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#A8AEBF';
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services Overview Section - SCROLLABLE */}
        <div className="px-4 py-3 border-b flex-1 overflow-y-auto" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>Services Overview</h2>
            <ChevronDown className="w-4 h-4" style={{ color: '#A8AEBF' }} />
          </div>
          
          <div className="space-y-2">
            {services.map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-150 border"
                style={{
                  backgroundColor: '#0F1117',
                  borderColor: 'rgba(255,255,255,0.05)',
                  opacity: service.status === 'stopped' ? 0.55 : 1
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1B1F28'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F1117'}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg w-6 text-center">{service.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium" style={{ color: '#E9ECF2' }}>
                      {service.name} {service.version}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: '#A8AEBF' }}>
                    Port: {service.port}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {service.status === 'running' && (
                    <>
                      <button 
                        onClick={() => handleServiceAction(service.name, 'reload')}
                        className="px-3 py-1 text-xs rounded transition-all duration-150"
                        style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A93D6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4BA3E6'}
                      >
                        Reload
                      </button>
                      <button 
                        onClick={() => handleServiceAction(service.name, 'stop')}
                        className="px-3 py-1 text-xs rounded transition-all duration-150"
                        style={{ backgroundColor: '#D95757', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C94747'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D95757'}
                      >
                        Stop
                      </button>
                    </>
                  )}
                  {service.status === 'stopped' && (
                    <button 
                      onClick={() => handleServiceAction(service.name, 'start')}
                      className="px-3 py-1 text-xs rounded transition-all duration-150"
                      style={{ backgroundColor: '#3FBF75', color: '#FFFFFF' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2FAF65'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3FBF75'}
                    >
                      Start
                    </button>
                  )}
                  {service.status === 'locked' && (
                    <>
                      <button 
                        onClick={() => handleServiceAction(service.name, 'reload')}
                        className="px-3 py-1 text-xs rounded transition-all duration-150"
                        style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A93D6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4BA3E6'}
                      >
                        Reload
                      </button>
                      <button 
                        onClick={() => handleServiceAction(service.name, 'stop')}
                        className="px-3 py-1 text-xs rounded transition-all duration-150"
                        style={{ backgroundColor: '#D95757', color: '#FFFFFF' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C94747'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D95757'}
                      >
                        Stop
                      </button>
                    </>
                  )}
                  {service.name === 'MySQL' && (
                    <button 
                      onClick={() => handleServiceAction(service.name, 'cli')}
                      className="px-3 py-1 text-xs rounded transition-all duration-150"
                      style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A4ADC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6A5AEC'}
                    >
                      Open CLI
                    </button>
                  )}
                  {service.name === 'Redis' && (
                    <button 
                      onClick={() => handleServiceAction(service.name, 'monitor')}
                      className="px-3 py-1 text-xs rounded transition-all duration-150"
                      style={{ backgroundColor: '#E89B4B', color: '#FFFFFF' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D88B3B'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E89B4B'}
                    >
                      Monitor
                    </button>
                  )}
                  {service.name === 'PostgreSQL' && (
                    <button 
                      onClick={() => handleServiceAction(service.name, 'restart')}
                      className="px-3 py-1 text-xs rounded transition-all duration-150"
                      style={{ backgroundColor: '#4A5568', color: '#FFFFFF' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A4558'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A5568'}
                    >
                      Restart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Project Section */}
        <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#E9ECF2' }}>Current Project</h2>
          <div className="rounded-lg px-3 py-2 space-y-1 border" style={{ 
            backgroundColor: '#0F1117',
            borderColor: 'rgba(255,255,255,0.05)'
          }}>
            <div className="flex items-center text-xs">
              <span style={{ color: '#A8AEBF' }} className="w-28">Project Root:</span>
              <span style={{ color: '#E9ECF2' }} className="font-mono">{projectRoot}</span>
            </div>
            <div className="flex items-center text-xs">
              <span style={{ color: '#A8AEBF' }} className="w-28">Domain:</span>
              <span style={{ color: '#E9ECF2' }} className="font-mono">{projectDomain}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-3">
            <button 
              onClick={handleOpenBrowser}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all duration-150"
              style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A93D6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4BA3E6'}
            >
              <Globe className="w-4 h-4" />
              <span>Open in Browser</span>
            </button>
            <button 
              onClick={handleOpenDatabase}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all duration-150"
              style={{ backgroundColor: '#3FBF75', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2FAF65'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3FBF75'}
            >
              <Database className="w-4 h-4" />
              <span>Open Database Panel</span>
            </button>
            <button 
              onClick={handleOpenTerminal}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all duration-150"
              style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A4ADC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6A5AEC'}
            >
              <Terminal className="w-4 h-4" />
              <span>Open Terminal</span>
            </button>
          </div>
        </div>

        {/* Footer Runtime Info */}
        <div className="px-4 py-2 border-t flex-shrink-0" style={{ 
          backgroundColor: '#0F1117',
          borderTopColor: 'rgba(255,255,255,0.05)'
        }}>
          <div className="flex items-center justify-between text-xs" style={{ color: '#A8AEBF' }}>
            <div className="flex items-center space-x-4">
              <span>IP: <span style={{ color: '#E9ECF2' }} className="font-mono">{ipAddress}</span></span>
              <span>Active Time: <span style={{ color: '#E9ECF2' }} className="font-mono">{activeTime}</span></span>
            </div>
            <span style={{ color: '#6B7280' }}>Footer Runtime Info</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
