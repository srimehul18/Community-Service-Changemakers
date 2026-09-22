import { createContext, useContext, useMemo, useState } from 'react'
import { getUsers, initializeDemoData } from '../data/demoStore'

const AuthContext = createContext(null)
const userKey = 'changemakers_current_user'
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => { initializeDemoData(); return JSON.parse(localStorage.getItem(userKey) || 'null') })
  const value = useMemo(() => ({ currentUser, isAuthenticated: Boolean(currentUser), login(email, password) { const user = getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password); if (!user) return { success: false, message: 'Use a demo email and password 123456.' }; localStorage.setItem(userKey, JSON.stringify(user)); setCurrentUser(user); return { success: true, user } }, logout() { localStorage.removeItem(userKey); setCurrentUser(null) } }), [currentUser])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context }
