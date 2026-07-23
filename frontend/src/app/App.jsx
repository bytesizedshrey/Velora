import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { Provider, useSelector } from 'react-redux'
import { store } from './app.store'
import { useAuth } from './features/auth/hooks/useAuth'
import { useEffect } from 'react'

const App = () => {

  const {handleGetMe} = useAuth()

  const user = useSelector(state => state.auth.user)

  console.log(user)

  useEffect(()=>{
    handleGetMe()
  },[])

  return (
    <Provider store={store}>
      <RouterProvider router={routes} />
    </Provider>
  )
}

export default App