import { createContext, useContext, useState } from 'react'
import useLocalStorage from '@/hooks/use-local-storage'

type AuthContextType = {
  session: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<string | null>(() => {
    const token = useLocalStorage('get', 'session-token')
    return token ? token : null
  })

  const login = (token: string) => {
    setSession(token)
    useLocalStorage('set', 'session-token', token)
  }

  const logout = () => {
    setSession(null)
    useLocalStorage('remove', 'session-token')
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
