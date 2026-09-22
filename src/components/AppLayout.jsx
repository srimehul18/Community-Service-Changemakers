import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  function handleLogout() { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        userName={currentUser.name}
        role={currentUser.role}
        onMenuClick={() => setIsSidebarOpen(true)}
        onLogout={handleLogout}
      />
      <div className="flex">
        <Sidebar
          role={currentUser.role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
