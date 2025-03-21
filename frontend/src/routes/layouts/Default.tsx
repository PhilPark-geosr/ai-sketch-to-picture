import { Outlet } from 'react-router-dom'
import TheHeader from '@/components/TheHeader'

export default function DefaultLayout() {
  return (
    <>
      <TheHeader />
      <Outlet />
    </>
  )
}
