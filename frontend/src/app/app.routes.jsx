import { useEffect } from 'react'
import { createBrowserRouter, Outlet, useLocation } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import { checkAuth, logoutUser } from './features/auth/state/auth.slice'
import useLenis from '../shared/hooks/useLenis'

const NO_SCROLL_ROUTES = ['/register', '/login', '/forgot-password']

const RootLayout = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const isAuthPage = NO_SCROLL_ROUTES.includes(location.pathname)

  // Check auth session on mount
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  // Initialize lenis, disabled on auth pages
  useLenis(isAuthPage)

  return <Outlet />
}

const HomePage = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070707",
        color: "#fff",
        fontFamily: "var(--font-body)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.5rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        Welcome to Velora, {user?.fullname || "User"}!
      </h1>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
        Logged in as: <strong style={{ color: "#fff" }}>{user?.email}</strong> ({user?.role})
      </p>
    </div>
  )
}

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        )
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "login",
        element: <Login />
      }
    ]
  }
])