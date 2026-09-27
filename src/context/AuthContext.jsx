import { createContext, useContext, useMemo, useState } from 'react'
import { apiPost } from '../api/api'

const AuthContext = createContext(null)

const userKey = 'changemakers_current_user'
const tokenKey = 'changemakers_token'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem(userKey) || 'null')
  )

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),

      async login(email, password) {
        try {
          const data = await apiPost('/auth/login', {
            email,
            password
          })

          localStorage.setItem(tokenKey, data.token)
          localStorage.setItem(userKey, JSON.stringify(data.user))

          setCurrentUser(data.user)

          return {
            success: true,
            user: data.user
          }
        } catch (error) {
          return {
            success: false,
            message: error.message || 'Login failed'
          }
        }
      },

      logout() {
        localStorage.removeItem(tokenKey)
        localStorage.removeItem(userKey)
        setCurrentUser(null)
      }
    }),
    [currentUser]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}