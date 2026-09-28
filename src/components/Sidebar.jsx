import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const navigationByRole = {
  resident: [
    { label: 'Dashboard', to: '/resident/dashboard', icon: 'dashboard' },
    { label: 'Report Issue', to: '/resident/report', icon: 'plus' },
    { label: 'My Issues', to: '/resident/issues', icon: 'list' },
    { label: 'Profile', to: '/resident/profile', icon: 'user' },
  ],
  staff: [
    { label: 'Dashboard', to: '/staff/dashboard', icon: 'dashboard' },
    { label: 'Assigned Issues', to: '/staff/issues', icon: 'clipboard' },
    { label: 'Profile', to: '/staff/profile', icon: 'user' },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: 'dashboard' },
    { label: 'All Issues', to: '/admin/issues', icon: 'clipboard' },
    { label: 'Users', to: '/admin/users', icon: 'users' },
    { label: 'Categories', to: '/admin/categories', icon: 'tag' },
    { label: 'Analytics', to: '/admin/analytics', icon: 'chart' },
  ],
}

function Sidebar({ role = 'resident', isOpen = false, onClose }) {
  const links = navigationByRole[role] ?? navigationByRole.resident

  return (
    <>
      {isOpen && <button type="button" className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden" onClick={onClose} aria-label="Close navigation menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-emerald-100 bg-white pt-16 shadow-xl transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0 lg:pt-0 lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-5 lg:hidden">
          <span className="font-bold text-emerald-900">Navigation</span>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700" aria-label="Close navigation menu">
            <Icon name="close" />
          </button>
        </div>
        <nav className="flex-1 p-4" aria-label="Main navigation">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">{role} workspace</p>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.label === 'Dashboard'}
                  onClick={onClose}
                  className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`}
                >
                  <Icon name={link.icon} className="h-4.5 w-4.5" /> {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="m-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-semibold">Building a better society</p>
          <p className="mt-1 text-xs leading-5 text-emerald-700">Track, resolve, and follow up on community issues.</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
