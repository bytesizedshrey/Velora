import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from './features/auth/hooks/useAuth'
import { useEffect } from 'react'

const App = () => {
  const { handleGetMe } = useAuth()
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <RouterProvider router={routes} />
  )
}

export default App