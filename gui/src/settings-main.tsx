import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SettingsWindow from './SettingsWindow.tsx'

createRoot(document.getElementById('settings-root')!).render(
  <StrictMode>
    <SettingsWindow />
  </StrictMode>,
)
