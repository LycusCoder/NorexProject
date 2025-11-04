// /gui/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Power, Globe, Terminal, FolderOpen, Settings, RefreshCw, CheckCircle, AlertTriangle, Activity, Zap, Users, ExternalLink, Minimize, X, Server, Database, Menu, FileText, ChevronRight } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { open as openBrowser } from '@tauri-apps/plugin-shell';
import { Menu as TauriMenu, Submenu as TauriSubmenu } from '@tauri-apps/api/menu';

// Import modal components
import SettingsModal from './components/SettingsModal';
import LogsModal from './components/LogsModal';

// Get window instance for Tauri v2
const appWindow = getCurrentWindow();

// Interface untuk layanan (disesuaikan dengan Docker Compose)
interface Service {
  name: 'Apache' | 'MySQL' | 'phpMyAdmin';
  container: 'norex_apache' | 'norex_mysql' | 'norex_pma';
  version: string;
  status: 'running' | 'stopped' | 'checking' | 'error';
  port: string;
  icon: React.ReactNode;
}

// Initial state - HANYA 3 LAYANAN UTAMA (FIX: norex_* bukan nour_*)
const initialServices: Service[] = [
  { 
    name: 'Apache', 
    container: 'norex_apache',
    version: '8.2.x', 
    status: 'checking', 
    port: '8080', 
    icon: <Server className="text-blue-500" size={20} />, 
  },
  { 
    name: 'MySQL', 
    container: 'norex_mysql',
    version: '8.0.x', 
    status: 'checking', 
    port: '3306', 
    icon: <Database className="text-purple-500" size={20} />, 
  },
  { 
    name: 'phpMyAdmin', 
    container: 'norex_pma',
    version: '5.2.x', 
    status: 'checking', 
    port: '8081', 
    icon: <Settings className="text-orange-500" size={20} />, 
  },
];

// Context Menu Component - ENHANCED VERSION untuk GUI
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { 
      label: '🖥️ Buka Panel Kontrol', 
      action: 'show_window', 
      icon: <Menu className="w-4 h-4" />,
      type: 'item'
    },
    { type: 'divider' },
    { 
      label: '▶️ Start All Services', 
      action: 'start_all', 
      icon: <Power className="w-4 h-4 text-green-500" />,
      type: 'item'
    },
    { 
      label: '⏹️ Stop All Services', 
      action: 'stop_all', 
      icon: <Power className="w-4 h-4 text-red-500" />,
      type: 'item'
    },
    { type: 'divider' },
    { 
      label: '🌐 Apache', 
      action: 'apache',
      icon: <Server className="w-4 h-4 text-blue-500" />,
      type: 'submenu',
      submenu: [
        { label: '▶️ Start', action: 'apache_start' },
        { label: '⏹️ Stop', action: 'apache_stop' },
        { label: '🔄 Restart', action: 'apache_restart' },
      ]
    },
    { 
      label: '🔷 Nginx', 
      action: 'nginx',
      icon: <Server className="w-4 h-4 text-green-500" />,
      type: 'submenu',
      submenu: [
        { label: '▶️ Start', action: 'nginx_start' },
        { label: '⏹️ Stop', action: 'nginx_stop' },
        { label: '🔄 Restart', action: 'nginx_restart' },
      ]
    },
    { 
      label: '🗄️ MySQL', 
      action: 'mysql',
      icon: <Database className="w-4 h-4 text-purple-500" />,
      type: 'submenu',
      submenu: [
        { label: '▶️ Start', action: 'mysql_start' },
        { label: '⏹️ Stop', action: 'mysql_stop' },
        { label: '🔄 Restart', action: 'mysql_restart' },
      ]
    },
    { 
      label: '🐘 PHP', 
      action: 'php',
      icon: <Terminal className="w-4 h-4 text-indigo-500" />,
      type: 'submenu',
      submenu: [
        { label: 'ℹ️ PHP Info', action: 'php_info' },
      ]
    },
    { type: 'divider' },
    { 
      label: '📁 Buka Folder www', 
      action: 'open_www', 
      icon: <FolderOpen className="w-4 h-4 text-yellow-500" />,
      type: 'item'
    },
    { 
      label: '📄 Buka Folder logs', 
      action: 'open_logs', 
      icon: <FileText className="w-4 h-4 text-orange-500" />,
      type: 'item'
    },
    { type: 'divider' },
    { 
      label: '❌ Keluar', 
      action: 'quit', 
      icon: <X className="w-4 h-4 text-red-500" />,
      type: 'item'
    },
  ];

  // Calculate position to prevent overflow
  const adjustPosition = () => {
    const menuWidth = 220;
    const menuHeight = 500; // Approximate height
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    // Adjust X position if menu would overflow right
    if (x + menuWidth > windowWidth) {
      adjustedX = windowWidth - menuWidth - 10;
    }
    
    // Adjust Y position if menu would overflow bottom
    if (y + menuHeight > windowHeight) {
      adjustedY = windowHeight - menuHeight - 10;
    }
    
    return { x: adjustedX, y: adjustedY };
  };
  
  const position = adjustPosition();

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[220px]"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={index} className="my-1 border-t border-gray-200 dark:border-gray-700" />;
        }
        
        if (item.type === 'submenu') {
          return (
            <div key={index} className="relative">
              <button
                onClick={() => setExpandedSubmenu(expandedSubmenu === item.action ? null : item.action)}
                onMouseEnter={() => setExpandedSubmenu(item.action)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-gray-700 dark:text-gray-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                <ChevronRight className="w-3 h-3" />
              </button>
              
              {/* Submenu */}
              {expandedSubmenu === item.action && item.submenu && (
                <div className="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[150px] z-[10000]">
                  {item.submenu.map((subitem, subindex) => (
                    <button
                      key={subindex}
                      onClick={() => {
                        onAction(subitem.action);
                        onClose();
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {subitem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }
        
        return (
          <button
            key={index}
            onClick={() => {
              onAction(item.action);
              onClose();
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

const App: React.FC = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(false); // Global status
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  // Context menu untuk GUI aplikasi - GUNAKAN NATIVE TAURI MENU
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  
  // Enable context menu di aplikasi GUI dengan native Tauri menu
  useEffect(() => {
    const handleContextMenu = async (e: MouseEvent) => {
      e.preventDefault();
      
      // Log for debugging
      console.log('[APP] Context menu triggered at', e.clientX, e.clientY);
      logMessage('🖱️ Context menu opened');
      
      try {
        // Build native context menu dengan Tauri API
        const { MenuItem } = await import('@tauri-apps/api/menu');
        
        // Create menu items
        const startAllItem = await MenuItem.new({ text: '▶️ Start All Services', action: 'start_all' });
        const stopAllItem = await MenuItem.new({ text: '⏹️ Stop All Services', action: 'stop_all' });
        
        // Apache submenu
        const apacheStartItem = await MenuItem.new({ text: '▶️ Start', action: 'apache_start' });
        const apacheStopItem = await MenuItem.new({ text: '⏹️ Stop', action: 'apache_stop' });
        const apacheRestartItem = await MenuItem.new({ text: '🔄 Restart', action: 'apache_restart' });
        const apacheSubmenu = await TauriSubmenu.new({
          text: '🌐 Apache',
          items: [apacheStartItem, apacheStopItem, apacheRestartItem]
        });
        
        // MySQL submenu  
        const mysqlStartItem = await MenuItem.new({ text: '▶️ Start', action: 'mysql_start' });
        const mysqlStopItem = await MenuItem.new({ text: '⏹️ Stop', action: 'mysql_stop' });
        const mysqlRestartItem = await MenuItem.new({ text: '🔄 Restart', action: 'mysql_restart' });
        const mysqlSubmenu = await TauriSubmenu.new({
          text: '🗄️ MySQL',
          items: [mysqlStartItem, mysqlStopItem, mysqlRestartItem]
        });
        
        const openWwwItem = await MenuItem.new({ text: '📁 Buka Folder www', action: 'open_www' });
        const openLogsItem = await MenuItem.new({ text: '📄 Buka Folder logs', action: 'open_logs' });
        const quitItem = await MenuItem.new({ text: '❌ Keluar', action: 'quit' });
        
        // Create menu
        const menu = await TauriMenu.new({
          items: [
            startAllItem,
            stopAllItem,
            apacheSubmenu,
            mysqlSubmenu,
            openWwwItem,
            openLogsItem,
            quitItem
          ]
        });
        
        // Show menu at cursor position - NATIVE MENU BISA KELUAR DARI WINDOW!
        await menu.popup();
        
      } catch (error) {
        console.error('[APP] Failed to show context menu:', error);
        logMessage(`❌ Context menu error: ${error}`);
      }
      
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const logMessage = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${msg}`;
    console.log('[APP LOG]', logEntry);
    setLog(prev => [...prev, logEntry].slice(-50)); // Simpan 50 baris terakhir
    
    // Kirim log ke backend untuk disimpan di file
    invoke('write_log_message', { message: logEntry }).catch(err => {
      console.error('Failed to write log:', err);
    });
  };

  // -----------------------------------------------------
  // 1. TAHAP INTEGRASI TAURI & BASH SCRIPTS
  // -----------------------------------------------------

  const execute = async (script: string, args: string = '') => {
    // Build command - script bisa berupa path (scripts/status.sh) atau docker command
    let command: string;
    
    if (script === 'docker') {
      // Docker command - args sudah lengkap (e.g., "start norex_apache")
      command = `docker ${args}`;
    } else {
      // Bash script command
      command = args ? `bash ${script} ${args}` : `bash ${script}`;
    }
    
    console.log(`[APP] 🚀 Executing: ${command}`);
    logMessage(`\n🚀 Executing: ${command}`);
    
    // Perhatikan: Kita panggil command Rust: execute_bash_script
    try {
      const output: string = await invoke('execute_bash_script', { command });
      console.log(`[APP] ✅ Command successful:`, output);
      logMessage(`✅ ${script} successful.`);
      output.split('\n').forEach(line => {
        if (line.trim()) logMessage(line.trim());
      });
      return output;
    } catch (error) {
      console.error(`[APP] ❌ Command GAGAL:`, error);
      logMessage(`❌ Command GAGAL: ${script}`);
      logMessage(String(error).split('\n').join(' | '));
      return null;
    } finally {
      // Selalu refresh status setelah operasi
      console.log('[APP] Refreshing service status after command...');
      setTimeout(() => checkServiceStatus(), 1000); // Delay 1 detik untuk memberi waktu Docker update
    }
  };

  const checkServiceStatus = async () => {
    // Check Docker container status menggunakan command baru
    try {
      console.log('[APP] Checking Docker container status...');
      
      // Call Tauri command untuk get Docker status
      const dockerStatus: string = await invoke('check_docker_containers');
      console.log('[APP] Docker status response:', dockerStatus);

      if (dockerStatus && dockerStatus !== '[]') {
        // Parse JSON response dari docker compose ps
        let containers: any[] = [];
        try {
          // Docker compose ps --format json returns newline-delimited JSON
          const lines = dockerStatus.trim().split('\n').filter(line => line.trim());
          containers = lines.map(line => JSON.parse(line));
        } catch (parseError) {
          console.error('[APP] Failed to parse Docker status JSON:', parseError);
          // Try as single JSON array
          try {
            containers = JSON.parse(dockerStatus);
          } catch (e) {
            console.error('[APP] Failed to parse as array:', e);
            containers = [];
          }
        }
        
        console.log('[APP] Parsed containers:', containers);

        setServices(prev => 
          prev.map(service => {
            // Find matching container
            const container = containers.find(c => 
              c.Name === service.container || 
              c.Service === service.name.toLowerCase() ||
              (c.Names && c.Names.includes(service.container))
            );
            
            let newStatus: 'running' | 'stopped' | 'checking' | 'error' = 'stopped';
            
            if (container) {
              // Check State or Status field
              const state = container.State || container.Status || '';
              if (state.toLowerCase().includes('running') || state.toLowerCase().includes('up')) {
                newStatus = 'running';
                console.log(`[APP] ✅ ${service.name} (${service.container}) is RUNNING`);
              } else if (state.toLowerCase().includes('exited') || state.toLowerCase().includes('stopped')) {
                newStatus = 'stopped';
                console.log(`[APP] ⏹️  ${service.name} (${service.container}) is STOPPED`);
              } else {
                newStatus = 'error';
                console.log(`[APP] ❌ ${service.name} (${service.container}) has UNKNOWN STATE: ${state}`);
              }
            } else {
              console.log(`[APP] ⚠️  ${service.name} (${service.container}) NOT FOUND in Docker`);
              newStatus = 'stopped';
            }
            
            return { ...service, status: newStatus };
          })
        );
        
        // Update global online status
        setTimeout(() => {
          setServices(currentServices => {
            const anyRunning = currentServices.some(s => s.status === 'running');
            setIsOnline(anyRunning);
            console.log('[APP] 🌐 Global status - Online:', anyRunning, 'Running services:', currentServices.filter(s => s.status === 'running').length);
            return currentServices;
          });
        }, 100);
      } else {
        console.log('[APP] ⚠️  No Docker containers found, setting all to stopped');
        setServices(prev => 
          prev.map(service => ({ ...service, status: 'stopped' }))
        );
        setIsOnline(false);
      }
    } catch (error) {
      console.error('[APP] ❌ Error checking Docker status:', error);
      logMessage(`❌ Error checking Docker status: ${error}`);
      // Set semua services ke stopped (bukan error, karena mungkin Docker belum running)
      setServices(prev => 
        prev.map(service => ({ ...service, status: 'stopped' }))
      );
      setIsOnline(false);
    }
  };

  const handleStartAll = () => execute('scripts/start.sh');
  const handleStopAll = () => execute('scripts/stop.sh');
  const handleRestartAll = () => {
    logMessage('🔄 Restarting all services...');
    execute('scripts/stop.sh')
      .then(() => execute('scripts/start.sh'));
  };

  const openUrl = (url: string) => {
    openBrowser(url);
    logMessage(`🌐 Opening: ${url}`);
  };

  const openRootFolder = () => {
    // Memanggil command Rust untuk membuka folder root (harus diizinkan di tauri.conf.json)
    invoke('execute_bash_script', { command: 'explorer . || xdg-open . || open .' })
        .then(() => logMessage('📁 Membuka folder root proyek.'))
        .catch(() => logMessage('❌ Gagal membuka folder root.'));
  };

  // Context Menu Action Handler
  const handleContextMenuAction = (action: string) => {
    logMessage(`🔧 Action: ${action}`);
    console.log(`[APP] Context menu action: ${action}`);
    
    switch (action) {
      case 'show_window':
        logMessage('🖥️ Window already visible');
        break;
      case 'start_all':
        handleStartAll();
        break;
      case 'stop_all':
        handleStopAll();
        break;
      case 'apache_start':
        execute('docker', 'start norex_apache').then(() => {
          logMessage('✅ Apache started');
        });
        break;
      case 'apache_stop':
        execute('docker', 'stop norex_apache').then(() => {
          logMessage('✅ Apache stopped');
        });
        break;
      case 'apache_restart':
        execute('docker', 'restart norex_apache').then(() => {
          logMessage('✅ Apache restarted');
        });
        break;
      case 'nginx_start':
        execute('docker', 'start norex_nginx').then(() => {
          logMessage('✅ Nginx started');
        });
        break;
      case 'nginx_stop':
        execute('docker', 'stop norex_nginx').then(() => {
          logMessage('✅ Nginx stopped');
        });
        break;
      case 'nginx_restart':
        execute('docker', 'restart norex_nginx').then(() => {
          logMessage('✅ Nginx restarted');
        });
        break;
      case 'mysql_start':
        execute('docker', 'start norex_mysql').then(() => {
          logMessage('✅ MySQL started');
        });
        break;
      case 'mysql_stop':
        execute('docker', 'stop norex_mysql').then(() => {
          logMessage('✅ MySQL stopped');
        });
        break;
      case 'mysql_restart':
        execute('docker', 'restart norex_mysql').then(() => {
          logMessage('✅ MySQL restarted');
        });
        break;
      case 'php_info':
        openUrl(`http://localhost:${services.find(s => s.name === 'Apache')?.port || 8080}/phpinfo.php`);
        break;
      case 'open_www':
        handleOpenFolder('www');
        break;
      case 'open_logs':
        handleOpenFolder('logs');
        break;
      case 'quit':
        appWindow.close();
        break;
      default:
        logMessage(`Unknown action: ${action}`);
    }
  };

  // -----------------------------------------------------
  // 2. TAHAP LIFE CYCLE & POLLING
  // -----------------------------------------------------

  useEffect(() => {
    console.log('[APP] Component mounted - initializing...');
    
    // 1. Initial check status
    console.log('[APP] Running initial status check...');
    setTimeout(() => checkServiceStatus(), 500); // Delay sedikit untuk memberi waktu app init
    
    // 2. Set polling (Auto-refresh setiap 5 detik)
    const intervalId = setInterval(() => {
      console.log('[APP] Auto-refresh status check...');
      checkServiceStatus();
    }, 5000); 

    // 3. Listen for tray menu events
    const setupTrayListeners = async () => {
      console.log('[APP] Setting up tray listeners...');
      const { listen } = await import('@tauri-apps/api/event');
      
      // Listen untuk run_script events dari tray
      listen('run_script', (event: any) => {
        const script = event.payload;
        console.log('[APP] Received run_script event from tray:', script);
        handleTrayScript(script);
      });

      // Listen untuk open_folder events dari tray
      listen('open_folder', (event: any) => {
        const folder = event.payload;
        console.log('[APP] Received open_folder event from tray:', folder);
        handleOpenFolder(folder);
      });
      
      console.log('[APP] Tray listeners setup complete');
    };

    setupTrayListeners();

    // 4. Cleanup: Hapus interval saat komponen di-unmount
    return () => {
      console.log('[APP] Component unmounting - cleaning up...');
      clearInterval(intervalId);
    };
  }, []);

  // Handler untuk tray script events
  const handleTrayScript = (script: string) => {
    console.log('[APP] Handling tray script:', script);
    logMessage(`📱 Tray menu: ${script}`);
    
    switch (script) {
      case 'start.sh':
        console.log('[APP] Starting all services from tray');
        handleStartAll();
        break;
      case 'stop.sh':
        console.log('[APP] Stopping all services from tray');
        handleStopAll();
        break;
      case 'apache_start':
        console.log('[APP] Starting Apache from tray');
        execute('docker', 'start norex_apache').then(() => {
          logMessage('✅ Apache started from tray');
        });
        break;
      case 'apache_stop':
        console.log('[APP] Stopping Apache from tray');
        execute('docker', 'stop norex_apache').then(() => {
          logMessage('✅ Apache stopped from tray');
        });
        break;
      case 'apache_restart':
        console.log('[APP] Restarting Apache from tray');
        execute('docker', 'restart norex_apache').then(() => {
          logMessage('✅ Apache restarted from tray');
        });
        break;
      case 'nginx_start':
        console.log('[APP] Starting Nginx from tray');
        execute('docker', 'start norex_nginx').then(() => {
          logMessage('✅ Nginx started from tray');
        });
        break;
      case 'nginx_stop':
        console.log('[APP] Stopping Nginx from tray');
        execute('docker', 'stop norex_nginx').then(() => {
          logMessage('✅ Nginx stopped from tray');
        });
        break;
      case 'nginx_restart':
        console.log('[APP] Restarting Nginx from tray');
        execute('docker', 'restart norex_nginx').then(() => {
          logMessage('✅ Nginx restarted from tray');
        });
        break;
      case 'mysql_start':
        console.log('[APP] Starting MySQL from tray');
        execute('docker', 'start norex_mysql').then(() => {
          logMessage('✅ MySQL started from tray');
        });
        break;
      case 'mysql_stop':
        console.log('[APP] Stopping MySQL from tray');
        execute('docker', 'stop norex_mysql').then(() => {
          logMessage('✅ MySQL stopped from tray');
        });
        break;
      case 'mysql_restart':
        console.log('[APP] Restarting MySQL from tray');
        execute('docker', 'restart norex_mysql').then(() => {
          logMessage('✅ MySQL restarted from tray');
        });
        break;
      case 'php_info':
        console.log('[APP] Opening PHP info from tray');
        openUrl(`http://localhost:${services.find(s => s.name === 'Apache')?.port || 8080}/phpinfo.php`);
        break;
      default:
        console.log('[APP] Unknown tray script:', script);
    }
  };

  // Handler untuk open folder dari tray
  const handleOpenFolder = async (folder: string) => {
    console.log('[APP] Opening folder from tray:', folder);
    try {
      await invoke('open_folder', { folderName: folder });
      console.log('[APP] Folder opened successfully:', folder);
      logMessage(`📁 Folder ${folder} dibuka`);
    } catch (error) {
      console.error('[APP] Failed to open folder:', error);
      logMessage(`❌ Gagal membuka folder ${folder}: ${error}`);
    }
  };

  // -----------------------------------------------------
  // 3. TAHAP UI (LARAGON STYLE 70%/30%)
  // -----------------------------------------------------

  const getStatusColor = (status: Service['status']) => {
    switch(status) {
      case 'running': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'stopped': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'checking': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: Service['status']) => {
    switch(status) {
      case 'running': return <CheckCircle className="w-3 h-3 text-emerald-600" />;
      case 'stopped': return <AlertTriangle className="w-3 h-3 text-gray-400" />;
      case 'checking': return <RefreshCw className="w-3 h-3 text-yellow-600 animate-spin" />;
      case 'error': return <X className="w-3 h-3 text-red-600" />;
      default: return <AlertTriangle className="w-3 h-3 text-gray-400" />;
    }
  };
  
  const handleMinimize = () => {
    appWindow.minimize();
  };

  // Filter services: hide stopped ones except checking
  const visibleServices = services.filter(s => s.status !== 'stopped');

  return (
    // TRANSPARENT BACKGROUND WITH ROUNDED WINDOW
    <div className="w-full h-screen flex items-center justify-center">
      {/* Main App Container with Rounded Corners & Shadow */}
      <div className={`w-[95%] h-[95%] rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        
        {/* Custom Title Bar - Title left, Controls right - ROUNDED TOP */}
        <div 
          data-tauri-drag-region
          className={`flex items-center justify-between px-4 py-2 ${
            isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-gray-100 border-b border-gray-200'
          } h-12 rounded-t-2xl`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Menu className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-sm font-semibold">NorexProject v3.0</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <button onClick={handleMinimize} title="Minimize" className={`w-10 h-8 flex items-center justify-center rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Minimize className="w-4 h-4" />
            </button>
            <button onClick={() => appWindow.close()} title="Close" className={`w-10 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-500 hover:text-white ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col h-[calc(100%-48px)]">
          {/* Main Content Area - 70%/30% Split */}
          <div className="flex-1 grid lg:grid-cols-3 gap-6 overflow-hidden">
            {/* Services Management (70%) - FLEX TO FILL SPACE */}
            <div className="lg:col-span-2 overflow-hidden flex flex-col">
              <div 
                className={`rounded-2xl shadow-lg overflow-hidden flex flex-col h-full ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-t-2xl">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Services Management
                  </h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsLogsModalOpen(true)} 
                      title="View Logs"
                      className={`p-1.5 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                    </button>
                    <button 
                      onClick={checkServiceStatus} 
                      title="Refresh Status" 
                      className={`p-1.5 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {/* Service List - ONLY SHOW RUNNING/CHECKING/ERROR */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto flex-1">
                  {visibleServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <AlertTriangle className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">No services running</p>
                      <p className="text-xs mt-1">Click "Start All" to begin</p>
                    </div>
                  ) : (
                    visibleServices.map((service, index) => (
                      <div 
                        key={index} 
                        className={`p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 animate-fadeIn`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {service.icon}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{service.name}</h3>
                                <div className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${
                                  getStatusColor(service.status)
                                }`}>
                                  {getStatusIcon(service.status)}
                                  <span>
                                    {service.status === 'checking' ? 'Checking...' : 
                                     service.status === 'running' ? 'Running' : 
                                     service.status === 'error' ? 'Error' : 'Stopped'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 text-xs">
                                <span className={`px-2 py-1 rounded ${
                                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  Version: {service.version}
                                </span>
                                <span className={`px-2 py-1 rounded ${
                                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  Port: {service.port}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel (30%) */}
            <div className="space-y-6 overflow-hidden flex flex-col">
              {/* Quick Actions */}
              <div 
                className={`rounded-2xl shadow-lg p-4 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleStartAll} className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isDarkMode ? 'bg-emerald-900/30 hover:bg-emerald-800/50 border border-emerald-700' : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'}`}>
                    <Power className="w-5 h-5 text-emerald-500 mb-1" />
                    <span className="text-xs font-medium">Start All</span>
                  </button>
                  
                  <button onClick={handleStopAll} className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isDarkMode ? 'bg-red-900/30 hover:bg-red-800/50 border border-red-700' : 'bg-red-50 hover:bg-red-100 border border-red-200'}`}>
                    <Power className="w-5 h-5 text-red-500 mb-1" />
                    <span className="text-xs font-medium">Stop All</span>
                  </button>
                  
                  <button onClick={() => openUrl(`http://localhost:${services.find(s => s.name === 'Apache')?.port || 8080}`)} className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isDarkMode ? 'bg-blue-900/30 hover:bg-blue-800/50 border border-blue-700' : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'}`}>
                    <Globe className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-xs font-medium">Web</span>
                  </button>
                  
                  <button onClick={() => openUrl(`http://localhost:${services.find(s => s.name === 'phpMyAdmin')?.port || 8081}`)} className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isDarkMode ? 'bg-green-900/30 hover:bg-green-800/50 border border-green-700' : 'bg-green-50 hover:bg-green-100 border border-green-200'}`}>
                    <Database className="w-5 h-5 text-green-500 mb-1" />
                    <span className="text-xs font-medium">Database</span>
                  </button>
                  
                  <button onClick={() => setIsSettingsModalOpen(true)} className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700 border border-gray-700' : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'}`}>
                    <Settings className="w-5 h-5 text-gray-500 mb-1" />
                    <span className="text-xs font-medium">Settings</span>
                  </button>
                </div>
              </div>

              {/* System Overview */}
              <div 
                className={`rounded-2xl shadow-lg p-4 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } flex-1`}
              >
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  System Overview (Host)
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Running Services</span>
                    <span className="font-semibold text-emerald-600">{services.filter(s => s.status === 'running').length}/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Memory Usage (Host)</span>
                    <span className="font-semibold">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>CPU (Docker)</span>
                    <span className="font-semibold">N/A</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => setIsDarkMode(prev => !prev)}
                    className={`w-full py-2 px-4 rounded-xl transition-all text-sm ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context Menu - ACTIVE untuk GUI aplikasi */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onAction={handleContextMenuAction}
          />
        )}

        {/* Logs Modal */}
        <LogsModal
          isOpen={isLogsModalOpen}
          onClose={() => setIsLogsModalOpen(false)}
          isDarkMode={isDarkMode}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default App;
