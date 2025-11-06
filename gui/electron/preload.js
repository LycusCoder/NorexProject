// electron/preload.js - Preload Script (IPC Bridge)
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Execute bash script
  invoke: (channel, ...args) => {
    // Whitelist channels for security
    const validChannels = [
      'execute_bash_script',
      'check_docker_containers',
      'list_logs_files',
      'read_logs_file',
      'open_folder',
      'write_log_message',
      'get_docker_logs'
    ];
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
  },
  
  // Helper: Execute bash script
  executeBashScript: (command) => {
    return ipcRenderer.invoke('execute_bash_script', { command });
  },
  
  // Helper: Get project root path
  getProjectRoot: () => {
    return ipcRenderer.invoke('get_project_root');
  },
  
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // Open URL in browser
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  
  // Settings window controls - NOW WITH THEME PARAMETER
  openSettingsWindow: (theme) => ipcRenderer.invoke('open-settings-window', theme),
  closeSettingsWindow: () => ipcRenderer.invoke('close-settings-window'),
  
  // Listen for theme changes (for standalone settings window)
  onThemeChange: (callback) => {
    ipcRenderer.on('set-theme', (event, theme) => callback(theme));
  },
  
  // Remove theme listener
  removeThemeListener: (callback) => {
    ipcRenderer.removeListener('set-theme', callback);
  },
  
  // Listen to events from main process
  on: (channel, callback) => {
    const validChannels = ['run_script', 'open_folder', 'set-theme'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Remove event listener
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  }
});

console.log('✅ Electron preload script loaded!');
