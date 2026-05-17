import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './demo.css'
import { applyTheme, getInitialTheme } from '../src'
import { App } from './App'

applyTheme(getInitialTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
