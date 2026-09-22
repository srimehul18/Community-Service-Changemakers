import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, role }) {
  const { currentUser, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && currentUser.role !== role) return <Navigate to={`/${currentUser.role}/dashboard`} replace />
  return children
}

export default ProtectedRoute
