import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import DefaultLayout from './layouts/Default'
import Recommendation from './pages/Recommendation'

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/recommendation',
        element: <Recommendation />
      }
    ]
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}
