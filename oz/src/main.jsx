import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { SiteProvider } from './context/SiteContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteProvider>
      <BrowserRouter basename="/ozinterstate">
        <App />
      </BrowserRouter>
    </SiteProvider>
  </StrictMode>,
)
