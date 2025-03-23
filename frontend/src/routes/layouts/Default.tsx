import { Outlet } from 'react-router-dom'
import TheHeader from '@/components/TheHeader'
import Sidebar from '@/components/Sidebar'

export default function DefaultLayout() {
  return (
    <>
      {/* <TheHeader /> */}
      <Sidebar />
      <Outlet />
    </>
  )
}
