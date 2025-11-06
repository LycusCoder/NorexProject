// NOREX V3.6 - Settings Dialog Modal
import React, { useState } from 'react';
import { X, Download, Settings as SettingsIcon, Sliders } from 'lucide-react';
import DownloadsTab from './DownloadsTab';
import ServicesTab from './ServicesTab';
import AdvancedTab from './AdvancedTab';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isStandaloneWindow?: boolean; // Flag untuk deteksi standalone window
}

type TabType = 'downloads' | 'services' | 'advanced';

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose, isStandaloneWindow = false }) => {
  const [activeTab, setActiveTab] = useState<TabType>('downloads');

  if (!isOpen) return null;

  const tabs = [
    { id: 'downloads' as TabType, label: 'Downloads', icon: Download },
    { id: 'services' as TabType, label: 'Services', icon: SettingsIcon },
    { id: 'advanced' as TabType, label: 'Advanced', icon: Sliders },
  ];

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={`${isStandaloneWindow ? '' : 'fixed inset-0'} z-50 flex items-center justify-center`}
      style={{ backgroundColor: isStandaloneWindow ? 'transparent' : 'rgba(0, 0, 0, 0.75)' }}
      onClick={isStandaloneWindow ? undefined : onClose}
      onKeyDown={handleEscapeKey}
    >
      {/* Modal Container - FIXED SIZE */}
      <div
        className="relative flex flex-col rounded-xl shadow-2xl"
        style={{ 
          backgroundColor: 'var(--bg-primary)',
          width: isStandaloneWindow ? '100%' : '900px',
          height: isStandaloneWindow ? '100vh' : '650px',
          maxWidth: isStandaloneWindow ? '100%' : '900px',
          maxHeight: isStandaloneWindow ? '100vh' : '650px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Draggable Region */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ 
            borderBottomColor: 'var(--border-color)',
            WebkitAppRegion: isStandaloneWindow ? 'drag' : 'no-drag'
          } as React.CSSProperties}
        >
          <div 
            className="flex items-center space-x-3"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(120deg, #B06EFF 0%, #6A5AEC 100%)',
              }}
            >
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Settings
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Manage downloads, services, and advanced options
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150"
            style={{ 
              color: 'var(--text-secondary)',
              WebkitAppRegion: 'no-drag'
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-red)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div
          className="flex items-center space-x-1 px-6 py-3 border-b flex-shrink-0"
          style={{ 
            borderBottomColor: 'var(--border-color)', 
            backgroundColor: 'var(--bg-secondary)',
            WebkitAppRegion: 'no-drag'
          } as React.CSSProperties}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-150 text-sm font-medium"
                style={{
                  backgroundColor: isActive ? 'var(--accent-purple)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content - Scrollable with FIXED height */}
        <div 
          className="flex-1 overflow-y-auto px-6 py-4" 
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            WebkitAppRegion: 'no-drag',
            minHeight: 0 // Important for flex overflow
          } as React.CSSProperties}
        >
          {activeTab === 'downloads' && <DownloadsTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'advanced' && <AdvancedTab />}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end space-x-3 px-6 py-4 border-t flex-shrink-0"
          style={{ 
            borderTopColor: 'var(--border-color)', 
            backgroundColor: 'var(--bg-secondary)',
            WebkitAppRegion: 'no-drag'
          } as React.CSSProperties}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-lg transition-all duration-150"
            style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
