import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Routes } from '@generouted/react-router'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/ui/app-sidebar'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <div className='flex relative'>
        <SidebarProvider>
          <div>
            <AppSidebar />
          </div>
        </SidebarProvider>
        <div className='w-[80%] absolute left-[20%]'>
          <Routes />
        </div>
      </div>
    </StrictMode>
  )
} else {
  console.error('Root element not found')
}
