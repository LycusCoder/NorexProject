// /gui/src/components/SettingsModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Settings Modal Component - NOW WITH REACT PORTAL
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'services'>('general');
  
  // General settings state
  const [runOnStartup, setRunOnStartup] = useState(false);
  const [language, setLanguage] = useState('English');
  const [documentRoot, setDocumentRoot] = useState('/www');
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupInterval, setBackupInterval] = useState(8);
  const [autoUpdate, setAutoUpdate] = useState(false);
  
  // Services & Ports state
  const [apacheEnabled, setApacheEnabled] = useState(true);
  const [apachePort, setApachePort] = useState('80');
  const [apacheSslPort, setApacheSslPort] = useState('443');
  const [mysqlEnabled, setMysqlEnabled] = useState(true);
  const [mysqlPort, setMysqlPort] = useState('3306');
  
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
      <div className={`relative w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-lg font-bold">Preferences</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-500'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'services'
                ? 'border-blue-500 text-blue-500'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-300'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Services & Ports
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Run on Startup */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Run when Windows starts</label>
                <input
                  type="checkbox"
                  checked={runOnStartup}
                  onChange={(e) => setRunOnStartup(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-2">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="English">English</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>

              {/* Document Root */}
              <div>
                <label className="block text-sm font-medium mb-2">Document Root:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={documentRoot}
                    onChange={(e) => setDocumentRoot(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                  <button
                    className={`px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    ...
                  </button>
                </div>
              </div>

              {/* Auto Backup */}
              <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Auto Backup</label>
                  <input
                    type="checkbox"
                    checked={autoBackup}
                    onChange={(e) => setAutoBackup(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </div>
                {autoBackup && (
                  <div className="ml-6">
                    <label className="block text-sm mb-2">Backup Interval:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={backupInterval}
                        onChange={(e) => setBackupInterval(Number(e.target.value))}
                        className={`w-24 px-3 py-2 rounded-lg border text-center ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <span className="text-sm">hours</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Auto Update */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Update</label>
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
            </div>
          )}

          {/* Services & Ports Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {/* Apache */}
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={apacheEnabled}
                      onChange={(e) => setApacheEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <label className="font-semibold">Apache:</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={apachePort}
                      onChange={(e) => setApachePort(e.target.value)}
                      disabled={!apacheEnabled}
                      className={`w-20 px-2 py-1 text-center rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } disabled:opacity-50`}
                    />
                    <span className="text-sm">SSL:</span>
                    <input
                      type="text"
                      value={apacheSslPort}
                      onChange={(e) => setApacheSslPort(e.target.value)}
                      disabled={!apacheEnabled}
                      className={`w-20 px-2 py-1 text-center rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } disabled:opacity-50`}
                    />
                    <span className="text-sm ml-2">Enabled</span>
                  </div>
                </div>
              </div>

              {/* MySQL */}
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mysqlEnabled}
                      onChange={(e) => setMysqlEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <label className="font-semibold">MySQL:</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={mysqlPort}
                      onChange={(e) => setMysqlPort(e.target.value)}
                      disabled={!mysqlEnabled}
                      className={`w-20 px-2 py-1 text-center rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } disabled:opacity-50`}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Section - DISABLED */}
              <div className="pt-4 mt-4 border-t border-gray-300 dark:border-gray-600">
                <h4 className="text-sm font-semibold mb-3 text-blue-600">Advanced</h4>
                
                {/* PostgreSQL - DISABLED */}
                <div className={`p-3 rounded-lg border mb-3 opacity-50 ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300 cursor-not-allowed"
                      />
                      <label className="text-sm text-gray-500">PostgreSQL:</label>
                    </div>
                    <input
                      type="text"
                      value="5432"
                      disabled
                      className={`w-20 px-2 py-1 text-center text-sm rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* Nginx - DISABLED */}
                <div className={`p-3 rounded-lg border mb-3 opacity-50 ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300 cursor-not-allowed"
                      />
                      <label className="text-sm text-gray-500">Nginx:</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value="8080"
                        disabled
                        className={`w-20 px-2 py-1 text-center text-sm rounded border ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-600 text-gray-500'
                            : 'bg-white border-gray-300 text-gray-400'
                        } cursor-not-allowed`}
                      />
                      <span className="text-xs text-gray-500">SSL: 8443</span>
                      <span className="text-xs text-gray-500">Enabled</span>
                    </div>
                  </div>
                </div>

                {/* Memcached - DISABLED */}
                <div className={`p-3 rounded-lg border mb-3 opacity-50 ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300 cursor-not-allowed"
                      />
                      <label className="text-sm text-gray-500">Memcached:</label>
                    </div>
                    <input
                      type="text"
                      value="11211"
                      disabled
                      className={`w-20 px-2 py-1 text-center text-sm rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* Redis - DISABLED */}
                <div className={`p-3 rounded-lg border mb-3 opacity-50 ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300 cursor-not-allowed"
                      />
                      <label className="text-sm text-gray-500">Redis:</label>
                    </div>
                    <input
                      type="text"
                      value="6379"
                      disabled
                      className={`w-20 px-2 py-1 text-center text-sm rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* MongoDB - DISABLED */}
                <div className={`p-3 rounded-lg border mb-3 opacity-50 ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300 cursor-not-allowed"
                      />
                      <label className="text-sm text-gray-500">MongoDB:</label>
                    </div>
                    <input
                      type="text"
                      value="27017"
                      disabled
                      className={`w-20 px-2 py-1 text-center text-sm rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* Mailpit - DISABLED */}
                <div className={`p-3 rounded-lg border opacity-50 ${
                  isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        disabled
                        className="w-4 h-4 rounded border-gray-300 cursor-not-allowed"
                      />
                      <label className="text-sm text-gray-500">Mailpit:</label>
                    </div>
                    <input
                      type="text"
                      value="1025"
                      disabled
                      className={`w-20 px-2 py-1 text-center text-sm rounded border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-500'
                          : 'bg-white border-gray-300 text-gray-400'
                      } cursor-not-allowed`}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic mt-3">
                  * Advanced services will be available after development phase
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex justify-end gap-3 ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsModal;
