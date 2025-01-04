import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import type { Path } from '../router'

const PUBLIC: Path[] = ['/auth/login', '/auth/signup']

export const Redirects = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth()
  const location = useLocation()

  const isPublicPath = PUBLIC.includes(location.pathname as Path)

  if (session && isPublicPath) {
    return (
      <Navigate
        to='/'
        replace
      />
    )
  }

  if (!session && !isPublicPath) {
    return (
      <Navigate
        to='/auth/login'
        replace
      />
    )
  }

  return <>{children}</>
}
