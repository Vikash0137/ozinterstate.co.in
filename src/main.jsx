import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/theme.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/ozinterstate/admin">
      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            border: '1px solid #e1e8ef',
            color: '#152b42',
            background: '#ffffff',
          },
          success: {
            iconTheme: {
              primary: '#087c35',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#d14343',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)