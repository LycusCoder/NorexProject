// NorexProject v3.6 - Dashboard Interface (Binary-based Runtime)
import React, { useState, useEffect } from 'react';
import { Minimize, X, Settings, Zap, RotateCw, Power, Terminal, Database, Globe, ChevronDown } from 'lucide-react';

interface Service {
  name: string;
  version: string;
  port: string;
  status: 'running' | 'stopped';
  icon: string;
}

const App: React.FC = () => {
  const [services, setServices] = useState<Service[]>([
    { name: 'Apache', version: '2.4.62', port: '8080', status: 'stopped', icon: '✔' },
    { name: 'MySQL', version: '8.4.3', port: '3306', status: 'stopped', icon: '✔' },
    { name: 'phpMyAdmin', version: '5.2.1', port: '8080/phpmyadmin', status: 'stopped', icon: '✔' },
  ]);

  const [servicesStatus, setServicesStatus] = useState<'stopped' | 'starting' | 'running' | 'stopping'>('stopped');
  const [activeTime, setActiveTime] = useState('00:00:00');
  const [ipAddress] = useState('192.168.1.141');
  const [projectRoot] = useState('/app/www');
  const [projectDomain] = useState('localhost:8080');
  const [showOnlyRunning, setShowOnlyRunning] = useState(true);

  // Check services status on mount
  useEffect(() => {
    checkServicesStatus();
    const interval = setInterval(checkServicesStatus, 5000); // Check every 5s
    return () => clearInterval(interval);
  }, []);

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

  // Check services status dynamically
  const checkServicesStatus = async () => {
    try {
      const result = await window.electron.executeBashScript('/bin/bash scripts/status_services.sh');
      
      // Handle error responses (JSON format)
      let statusOutput = result;
      try {
        const parsed = JSON.parse(result);
        if (parsed.error) {
          // Service check failed, all services stopped
          setServices(services.map(s => ({ ...s, status: 'stopped', icon: '─' })));
          setServicesStatus('stopped');
          return;
        }
      } catch (e) {
        // Not JSON, continue with normal parsing
      }
      
      // Parse status from output
      const updatedServices = services.map(service => {
        const isRunning = statusOutput.includes(`${service.name}`) && 
                         (statusOutput.includes('running') || statusOutput.includes('✅'));
        return {
          ...service,
          status: isRunning ? 'running' as const : 'stopped' as const,
          icon: isRunning ? '✔' : '─'
        };
      });
      
      setServices(updatedServices);
      
      // Update overall status
      const anyRunning = updatedServices.some(s => s.status === 'running');
      const allRunning = updatedServices.every(s => s.status === 'running');
      
      if (allRunning) {
        setServicesStatus('running');
      } else if (anyRunning) {
        setServicesStatus('running'); // Partial running
      } else {
        setServicesStatus('stopped');
      }
    } catch (error) {
      console.error('Failed to check services status:', error);
      // On error, assume all services stopped
      setServices(services.map(s => ({ ...s, status: 'stopped', icon: '─' })));
      setServicesStatus('stopped');
    }
  };

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

  const handleStartServices = async () => {
    setServicesStatus('starting');
    try {
      await window.electron.executeBashScript('/bin/bash scripts/start_services.sh');
      setTimeout(checkServicesStatus, 2000); // Check status after 2s
      console.log('Services started successfully');
    } catch (error) {
      console.error('Failed to start services:', error);
      alert('Failed to start services. Check logs for details.');
      setServicesStatus('stopped');
    }
  };

  const handleStopServices = async () => {
    setServicesStatus('stopping');
    try {
      await window.electron.executeBashScript('/bin/bash scripts/stop_services.sh');
      setTimeout(checkServicesStatus, 1000); // Check status after 1s
      console.log('Services stopped successfully');
    } catch (error) {
      console.error('Failed to stop services:', error);
      alert('Failed to stop services. Check logs for details.');
      setServicesStatus('running');
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden" style={{ backgroundColor: '#0F1117', borderRadius: '12px' }}>
      {/* Main Window Container - Premium Dark */}
      <div className="w-full h-full flex flex-col text-gray-100 overflow-hidden" style={{ backgroundColor: '#161920', borderRadius: '12px' }}>
        
        {/* Custom Title Bar with Logo and Settings */}
        <div 
          className="flex items-center justify-between px-4 py-3 select-none border-b"
          style={{ 
            WebkitAppRegion: 'drag',
            backgroundColor: '#0F1117',
            borderBottomColor: 'rgba(255,255,255,0.05)',
            borderRadius: '12px 12px 0 0'
          } as any}
        >
          <div className="flex items-center space-x-3 pointer-events-none">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{
              background: 'linear-gradient(120deg, #B06EFF 0%, #6A5AEC 100%)'
            }}>
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>
              Norex v3.6
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 pointer-events-auto" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button 
              onClick={() => window.electron.openSettingsWindow()}
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

        {/* Services Overview Section - FIXED HEADER, SCROLLABLE LIST */}
        <div className="px-4 py-3 border-b flex flex-col flex-1 overflow-hidden" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h2 className="text-sm font-semibold" style={{ color: '#E9ECF2' }}>Services Overview</h2>
            <button 
              onClick={() => setShowOnlyRunning(!showOnlyRunning)}
              className="text-xs px-2 py-1 rounded transition-all"
              style={{ 
                backgroundColor: showOnlyRunning ? '#6A5AEC' : '#1B1F28',
                color: showOnlyRunning ? '#FFFFFF' : '#A8AEBF'
              }}
            >
              {showOnlyRunning ? 'Running Only' : 'Show All'}
            </button>
          </div>
          
          <div className="space-y-2 overflow-y-auto flex-1">
            {services.filter(s => !showOnlyRunning || s.status === 'running').map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between px-3 py-2 transition-all duration-150 border"
                style={{
                  backgroundColor: '#0F1117',
                  borderColor: 'rgba(255,255,255,0.05)',
                  opacity: service.status === 'stopped' ? 0.55 : 1,
                  borderRadius: '12px'
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
                  {service.name === 'MySQL' && service.status === 'running' && (
                    <button 
                      onClick={() => handleServiceAction(service.name, 'cli')}
                      className="px-3 py-1 text-xs transition-all duration-150"
                      style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF', borderRadius: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5A4ADC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6A5AEC'}
                    >
                      Open CLI
                    </button>
                  )}
                  {(service.name === 'Apache' || service.name === 'MySQL') && service.status === 'running' && (
                    <button 
                      onClick={() => handleServiceAction(service.name, 'reload')}
                      className="px-3 py-1 text-xs transition-all duration-150"
                      style={{ backgroundColor: '#4BA3E6', color: '#FFFFFF', borderRadius: '8px' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3A93D6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4BA3E6'}
                    >
                      Reload
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
          <div className="px-3 py-2 space-y-1 border" style={{ 
            backgroundColor: '#0F1117',
            borderColor: 'rgba(255,255,255,0.05)',
            borderRadius: '12px'
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
            {servicesStatus === 'stopped' && (
              <button 
                onClick={handleStartServices}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs transition-all duration-150"
                style={{ backgroundColor: '#3FBF75', color: '#FFFFFF', borderRadius: '10px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2FAF65'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3FBF75'}
              >
                <Power className="w-4 h-4" />
                <span>Start Services</span>
              </button>
            )}
            
            {servicesStatus === 'starting' && (
              <button 
                disabled
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs"
                style={{ backgroundColor: '#4A5568', color: '#FFFFFF', borderRadius: '10px', opacity: 0.7, cursor: 'not-allowed' }}
              >
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Starting...</span>
              </button>
            )}
            
            {servicesStatus === 'running' && (
              <button 
                onClick={handleStopServices}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs transition-all duration-150"
                style={{ backgroundColor: '#D95757', color: '#FFFFFF', borderRadius: '10px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C94747'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#D95757'}
              >
                <Power className="w-4 h-4" />
                <span>Stop Services</span>
              </button>
            )}
            
            {servicesStatus === 'stopping' && (
              <button 
                disabled
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs"
                style={{ backgroundColor: '#4A5568', color: '#FFFFFF', borderRadius: '10px', opacity: 0.7, cursor: 'not-allowed' }}
              >
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Stopping...</span>
              </button>
            )}
            
            <button 
              onClick={handleOpenBrowser}
              disabled={servicesStatus !== 'running'}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs transition-all duration-150"
              style={{ 
                backgroundColor: servicesStatus === 'running' ? '#4BA3E6' : '#4A5568', 
                color: '#FFFFFF', 
                borderRadius: '10px',
                opacity: servicesStatus === 'running' ? 1 : 0.5,
                cursor: servicesStatus === 'running' ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => servicesStatus === 'running' && (e.currentTarget.style.backgroundColor = '#3A93D6')}
              onMouseLeave={(e) => servicesStatus === 'running' && (e.currentTarget.style.backgroundColor = '#4BA3E6')}
            >
              <Globe className="w-4 h-4" />
              <span>Open in Browser</span>
            </button>
            
            <button 
              onClick={handleOpenDatabase}
              disabled={servicesStatus !== 'running'}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs transition-all duration-150"
              style={{ 
                backgroundColor: servicesStatus === 'running' ? '#E89B4B' : '#4A5568', 
                color: '#FFFFFF', 
                borderRadius: '10px',
                opacity: servicesStatus === 'running' ? 1 : 0.5,
                cursor: servicesStatus === 'running' ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => servicesStatus === 'running' && (e.currentTarget.style.backgroundColor = '#D88B3B')}
              onMouseLeave={(e) => servicesStatus === 'running' && (e.currentTarget.style.backgroundColor = '#E89B4B')}
            >
              <Database className="w-4 h-4" />
              <span>Database Panel</span>
            </button>
            
            <button 
              onClick={handleOpenTerminal}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-xs transition-all duration-150"
              style={{ backgroundColor: '#6A5AEC', color: '#FFFFFF', borderRadius: '10px' }}
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
