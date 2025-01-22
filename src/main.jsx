import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import {NextUIProvider} from '@nextui-org/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </main>
    </NextUIProvider>  
  </StrictMode>,
)
