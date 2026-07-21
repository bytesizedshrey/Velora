import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router"
import LoadingScreen from "../../../../shared/components/loading/LoadingScreen"

/**
 * ProtectedRoute
 * Guards routes from unauthenticated access.
 * Shows loading state while checking session on mount.
 */
const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!authChecked) {
    return <LoadingScreen isVisible={true} />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
