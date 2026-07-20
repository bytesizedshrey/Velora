import { createBrowserRouter, Outlet, useLocation } from 'react-router'
import Register from './features/auth/pages/Register'
import useLenis from '@/shared/hooks/useLenis'

const NO_SCROLL_ROUTES = ['/register', '/login', '/forgot-password']

const RootLayout = () => {
  const location = useLocation()
  const isAuthPage = NO_SCROLL_ROUTES.includes(location.pathname)
  
  // Initialize lenis, disabled on auth pages
  useLenis(isAuthPage)

  return <Outlet />
}

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <h1 style={{ color: "white", padding: "2rem", fontFamily: "sans-serif" }}>Velora — Home (coming soon)</h1>
      },
      {
        path: "register",
        element: <Register />
      }
    ]
  }
])