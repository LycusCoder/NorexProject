// Settings Window - Standalone window untuk Settings modal
import React from 'react';
import SettingsDialog from './components/SettingsDialog';

const SettingsWindow: React.FC = () => {
  const handleClose = () => {
    window.electron.closeSettingsWindow();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ backgroundColor: 'transparent' }}>
      <SettingsDialog isOpen={true} onClose={handleClose} isStandaloneWindow={true} />
    </div>
  );
};

export default SettingsWindow;
