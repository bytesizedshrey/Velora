import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from './features/auth/hooks/useAuth'
import { useEffect } from 'react'

import GlobalSoundListener from '../shared/components/GlobalSoundListener'

const App = () => {
  const { handleGetMe } = useAuth()
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <>
      <GlobalSoundListener />
      <RouterProvider router={routes} />
    </>
  )
}

export default App