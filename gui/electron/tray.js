// electron/tray.js - System Tray Management
const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

function setupTray(mainWindow, app) {
  // Create tray icon (use a placeholder icon for now)
  // TODO: Replace with actual icon path from public/
  const iconPath = path.join(__dirname, '../public/vite.svg');
  
  try {
    // Create tray icon
    const icon = nativeImage.createFromPath(iconPath);
    tray = new Tray(icon.resize({ width: 16, height: 16 }));
    
    // Tray tooltip
    tray.setToolTip('NorexProject v3.0');
    
    // Context menu
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '🖥️ Show Window',
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        }
      },
      { type: 'separator' },
      {
        label: '▶️ Start All Services',
        click: () => {
          mainWindow.webContents.send('run_script', 'start.sh');
          mainWindow.show();
        }
      },
      {
        label: '⏹️ Stop All Services',
        click: () => {
          mainWindow.webContents.send('run_script', 'stop.sh');
          mainWindow.show();
        }
      },
      { type: 'separator' },
      {
        label: '🌐 Apache',
        submenu: [
          {
            label: '▶️ Start',
            click: () => mainWindow.webContents.send('run_script', 'apache_start')
          },
          {
            label: '⏹️ Stop',
            click: () => mainWindow.webContents.send('run_script', 'apache_stop')
          },
          {
            label: '🔄 Restart',
            click: () => mainWindow.webContents.send('run_script', 'apache_restart')
          }
        ]
      },
      {
        label: '🗄️ MySQL',
        submenu: [
          {
            label: '▶️ Start',
            click: () => mainWindow.webContents.send('run_script', 'mysql_start')
          },
          {
            label: '⏹️ Stop',
            click: () => mainWindow.webContents.send('run_script', 'mysql_stop')
          },
          {
            label: '🔄 Restart',
            click: () => mainWindow.webContents.send('run_script', 'mysql_restart')
          }
        ]
      },
      { type: 'separator' },
      {
        label: '📁 Open www folder',
        click: () => {
          mainWindow.webContents.send('open_folder', 'www');
        }
      },
      {
        label: '📄 Open logs folder',
        click: () => {
          mainWindow.webContents.send('open_folder', 'logs');
        }
      },
      { type: 'separator' },
      {
        label: '❌ Exit',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);
    
    tray.setContextMenu(contextMenu);
    
    // Double click to show window
    tray.on('double-click', () => {
      mainWindow.show();
      mainWindow.focus();
    });
    
    console.log('✅ System tray initialized!');
  } catch (error) {
    console.error('❌ Failed to create system tray:', error);
  }
}

module.exports = { setupTray };
