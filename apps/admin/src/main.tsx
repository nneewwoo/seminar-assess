import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Routes } from '@generouted/react-router'
import { SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/ui/app-sidebar'
import { AuthProvider, useAuth } from './context/AuthProvider'

const AppLayout = () => {
  const { session } = useAuth()

  return (
    <div className='flex relative'>
      {session && (
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      )}
      <div
        className={`absolute pt-2 pr-2 ${session ? 'left-[20%] w-[80%]' : 'w-full'}`}>
        <Routes />
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </StrictMode>
  )
} else {
  console.error('Root element not found')
}
