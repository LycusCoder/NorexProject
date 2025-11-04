// /gui/src/components/LogsModal.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, RefreshCw } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

// Logs Modal Component - NOW WITH REACT PORTAL
interface LogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const LogsModal: React.FC<LogsModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [logFiles, setLogFiles] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string>('');
  const [logContent, setLogContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load log files list saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      loadLogFiles();
    }
  }, [isOpen]);

  const loadLogFiles = async () => {
    try {
      const files: string[] = await invoke('list_logs_files');
      setLogFiles(files);
      if (files.length > 0 && !selectedLog) {
        setSelectedLog(files[0]);
        loadLogContent(files[0]);
      }
    } catch (error) {
      console.error('Failed to load log files:', error);
    }
  };

  const loadLogContent = async (filename: string) => {
    setIsLoading(true);
    try {
      const content: string = await invoke('read_logs_file', { filename });
      const lines = content.split('\n').filter(line => line.trim());
      setLogContent(lines);
    } catch (error) {
      console.error('Failed to load log content:', error);
      setLogContent([`Error: ${error}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSelect = (filename: string) => {
    setSelectedLog(filename);
    loadLogContent(filename);
  };

  if (!isOpen) return null;

  // Render modal menggunakan React Portal ke document.body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-5xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold">Log Files Viewer</h3>
            <button
              onClick={loadLogFiles}
              className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[60vh]">
          {/* Sidebar - Log files list */}
          <div className={`w-64 border-r overflow-y-auto ${
            isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="p-3 border-b border-gray-700">
              <p className="text-xs font-semibold text-gray-400">Available Logs</p>
            </div>
            {logFiles.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No log files found</p>
            ) : (
              logFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => handleLogSelect(file)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedLog === file
                      ? isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      : isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  📄 {file}
                </button>
              ))
            )}
          </div>

          {/* Content - Log display */}
          <div className={`flex-1 p-4 overflow-y-auto font-mono text-xs ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : logContent.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Select a log file to view</p>
            ) : (
              logContent.map((line, index) => (
                <p 
                  key={index} 
                  className={`mb-1 ${
                    line.includes('ERROR') || line.includes('❌') || line.includes('GAGAL') 
                      ? 'text-red-400' 
                      : line.includes('SUCCESS') || line.includes('✅') 
                      ? 'text-green-400'
                      : line.includes('WARN') || line.includes('⚠️')
                      ? 'text-yellow-400'
                      : line.includes('INFO') || line.includes('🚀')
                      ? 'text-blue-400'
                      : 'text-gray-400'
                  }`}
                >
                  {line}
                </p>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {selectedLog ? `${selectedLog} - ${logContent.length} lines` : 'No file selected'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogsModal;
