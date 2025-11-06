// src/electron.d.ts - TypeScript Definitions for Electron API

export interface ElectronAPI {
  // IPC invoke for backend commands
  invoke: (channel: string, args?: any) => Promise<any>;
  
  // Window controls
  minimize: () => void;
  close: () => void;
  
  // Browser integration
  openUrl: (url: string) => void;
  
  // Settings window controls
  openSettingsWindow: () => Promise<void>;
  closeSettingsWindow: () => Promise<void>;
  
  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => void;
  removeListener: (channel: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
