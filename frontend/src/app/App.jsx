import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from './features/auth/hooks/useAuth'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

import GlobalSoundListener from '../shared/components/GlobalSoundListener'

const App = () => {
  const { handleGetMe } = useAuth()
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    // Handle Google OAuth token passed in URL (bypasses cross-domain cookie restrictions)
    const params = new URLSearchParams(window.location.search)
    const oauthToken = params.get('oauth_token')

    if (oauthToken) {
      // Store it as a first-party cookie on this domain (no cross-domain issues)
      Cookies.set('token', oauthToken, {
        expires: 7,
        sameSite: 'Lax',
        secure: window.location.protocol === 'https:'
      })

      // Clean the URL so token is not visible or bookmarked
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
    }

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