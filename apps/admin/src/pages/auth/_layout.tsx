import { Outlet } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function AuthLayout() {
  return (
    <div>
      <div className='flex justify-center'>
        <img
          src={logo}
          className='w-[140px] h-[140px] object-cover'
          alt='Logo'
        />
      </div>
      <div className='text-center font-bold text-[200%]'>Seminar Assess</div>
      <div className='text-center text-[100%] pb-12'>
        A Mobile App for Comprehensive Extension Training Assessment
      </div>
      <Outlet />
    </div>
  )
}
