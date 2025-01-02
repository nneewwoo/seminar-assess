import { Redirects } from '@/config/redirects'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <Redirects>
      <Outlet />
    </Redirects>
  )
}
