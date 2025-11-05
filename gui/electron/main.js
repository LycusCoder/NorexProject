// electron/main.js - Main Process
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const { setupTray } = require('./tray');

let mainWindow = null;

// Helper function to get project root
function getProjectRoot() {
  // In development: /app/gui/electron/main.js -> /app
  // In production: similar structure
  const currentDir = process.cwd();
  
  // Check if we're in gui folder
  if (currentDir.endsWith('gui')) {
    return path.join(currentDir, '..');
  }
  
  // Check if scripts folder exists in current dir
  if (fs.existsSync(path.join(currentDir, 'scripts'))) {
    return currentDir;
  }
  
  // Try parent directory
  const parentDir = path.join(currentDir, '..');
  if (fs.existsSync(path.join(parentDir, 'scripts'))) {
    return parentDir;
  }
  
  return currentDir;
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    frame: false,              // No native window decorations
    transparent: true,         // Enable transparency for rounded corners
    resizable: true,
    minWidth: 800,
    minHeight: 500,
    backgroundColor: '#00000000', // Transparent background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // Security: isolate context
      nodeIntegration: false,  // Security: no direct node access
      sandbox: false           // Needed for some Node.js features
    }
  });

  // Load app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools(); // Uncomment for debugging
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window close - hide to tray instead
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  return mainWindow;
}

// App ready event
app.whenReady().then(() => {
  createWindow();
  setupTray(mainWindow, app);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ========================================
// IPC HANDLERS - Backend Functions
// ========================================

// Execute bash script
ipcMain.handle('execute_bash_script', async (event, { command }) => {
  return new Promise((resolve, reject) => {
    const projectRoot = getProjectRoot();
    const logsDir = path.join(projectRoot, 'logs');
    
    // Set PROJECT_ROOT environment variable
    const env = {
      ...process.env,
      PROJECT_ROOT: projectRoot
    };
    
    // Create logs directory if not exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Determine log file based on command
    let logFilename = 'gui_commands.log';
    let actionMessage = '';
    
    if (command.includes('start_services.sh')) {
      logFilename = 'start_services.log';
      actionMessage = '🚀 Service dijalankan';
    } else if (command.includes('stop_services.sh')) {
      logFilename = 'stop_services.log';
      actionMessage = '🛑 Service sedang dihentikan';
    } else if (command.includes('status_services.sh')) {
      logFilename = 'gui_status.log';
    } else if (command.includes('docker start')) {
      logFilename = 'gui_docker_start.log';
    } else if (command.includes('docker stop')) {
      logFilename = 'gui_docker_stop.log';
    } else if (command.includes('docker restart')) {
      logFilename = 'gui_docker_restart.log';
    }
    
    const logFilePath = path.join(logsDir, logFilename);
    const timestamp = new Date().toLocaleString('id-ID', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
    
    // Log command execution with custom message
    const logEntry = `\n[${timestamp}] ═══════════════════════════════════════\n`;
    const logCommand = actionMessage 
      ? `[${timestamp}] ${actionMessage}\n[${timestamp}] COMMAND: ${command}\n`
      : `[${timestamp}] 🚀 EXECUTING: ${command}\n`;
    
    fs.appendFileSync(logFilePath, logEntry + logCommand);
    
    // Execute command with PROJECT_ROOT env
    exec(command, { cwd: projectRoot, env: env }, (error, stdout, stderr) => {
      const finishTimestamp = new Date().toLocaleString('id-ID', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
      
      // Log output
      if (stdout) {
        fs.appendFileSync(logFilePath, `[${finishTimestamp}] OUTPUT:\n${stdout}\n`);
      }
      if (stderr && !error) {
        fs.appendFileSync(logFilePath, `[${finishTimestamp}] INFO:\n${stderr}\n`);
      }
      
      if (error) {
        const errorMsg = `[${finishTimestamp}] ❌ GAGAL - Exit code: ${error.code}\n`;
        fs.appendFileSync(logFilePath, errorMsg);
        if (stderr) {
          fs.appendFileSync(logFilePath, `[${finishTimestamp}] ERROR:\n${stderr}\n`);
        }
        
        // Return error info instead of rejecting - keep GUI responsive
        const errorInfo = {
          error: true,
          exitCode: error.code,
          stderr: stderr || '',
          stdout: stdout || ''
        };
        
        // For status checks, resolve with error info instead of reject
        if (command.includes('status')) {
          resolve(JSON.stringify(errorInfo));
        } else {
          reject(`Command failed (exit code ${error.code}):\n${stderr}`);
        }
      } else {
        const successMsg = actionMessage.includes('dijalankan')
          ? `[${finishTimestamp}] ✅ Service berhasil dijalankan!\n`
          : actionMessage.includes('dihentikan')
          ? `[${finishTimestamp}] ✅ Service berhasil dihentikan!\n`
          : `[${finishTimestamp}] ✅ SUCCESS - Exit code: 0\n`;
        fs.appendFileSync(logFilePath, successMsg);
        resolve(stdout);
      }
    });
  });
});

// Check Docker containers status
ipcMain.handle('check_docker_containers', async () => {
  return new Promise((resolve, reject) => {
    const projectRoot = getProjectRoot();
    
    exec('docker compose ps --format json', { cwd: projectRoot }, (error, stdout, stderr) => {
      if (error) {
        // If Docker is not running or command fails, return empty array
        resolve('[]');
      } else {
        resolve(stdout || '[]');
      }
    });
  });
});

// List log files
ipcMain.handle('list_logs_files', async () => {
  const projectRoot = getProjectRoot();
  const logsDir = path.join(projectRoot, 'logs');
  
  if (!fs.existsSync(logsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(logsDir);
  return files.filter(file => {
    const filePath = path.join(logsDir, file);
    return fs.statSync(filePath).isFile();
  }).sort();
});

// Read log file
ipcMain.handle('read_logs_file', async (event, { filename }) => {
  const projectRoot = getProjectRoot();
  const logPath = path.join(projectRoot, 'logs', filename);
  
  if (!fs.existsSync(logPath)) {
    throw new Error(`Log file not found: ${filename}`);
  }
  
  return fs.readFileSync(logPath, 'utf-8');
});

// Open folder in file manager
ipcMain.handle('open_folder', async (event, { folderName }) => {
  const projectRoot = getProjectRoot();
  const folderPath = path.join(projectRoot, folderName);
  
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Folder not found: ${folderName}`);
  }
  
  await shell.openPath(folderPath);
  return `Folder ${folderName} opened`;
});

// Write log message
ipcMain.handle('write_log_message', async (event, { message }) => {
  const projectRoot = getProjectRoot();
  const logsDir = path.join(projectRoot, 'logs');
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  const logFile = path.join(logsDir, 'gui_actions.log');
  const timestamp = new Date().toLocaleString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  fs.appendFileSync(logFile, logEntry);
});

// Get Docker logs
ipcMain.handle('get_docker_logs', async (event, { containerName, lines }) => {
  return new Promise((resolve, reject) => {
    exec(`docker logs --tail ${lines} ${containerName}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Container ${containerName} not found`);
      } else {
        resolve(stdout + stderr);
      }
    });
  });
});

// Window controls
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-close', () => {
  app.isQuitting = true;
  app.quit();
});

// Open URL in browser
ipcMain.handle('open-url', async (event, url) => {
  await shell.openExternal(url);
});

const projectRoot = getProjectRoot();
console.log('✅ Electron main process ready!');
console.log('📁 Project root:', projectRoot);
console.log('📁 Scripts dir:', require('path').join(projectRoot, 'scripts'));

// Verify critical paths on startup
const scriptsDir = require('path').join(projectRoot, 'scripts');
if (!require('fs').existsSync(scriptsDir)) {
  console.error('❌ ERROR: Scripts directory not found at:', scriptsDir);
} else {
  console.log('✅ Scripts directory verified');
}
