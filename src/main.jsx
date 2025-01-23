import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from "react-router-dom"
import { HeroUIProvider } from "@heroui/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <main className="dark text-foreground bg-background">
        <HashRouter>
          <App />
        </HashRouter>
      </main>
    </HeroUIProvider>  
  </StrictMode>,
)
