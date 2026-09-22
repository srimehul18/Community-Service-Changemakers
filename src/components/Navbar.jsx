function Navbar({ userName = 'Community Member', role = 'resident', onMenuClick, onLogout }) {
  const initials = userName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between border-b border-emerald-100 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" />
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm">C</span>
          <div>
            <p className="text-base font-bold tracking-tight text-emerald-900">ChangeMakers</p>
            <p className="hidden text-xs text-slate-500 sm:block">Society Issue Management</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-700">{userName}</p>
          <p className="text-xs capitalize text-slate-500">{role}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800" aria-label={`${userName} avatar`}>{initials}</span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Icon name="logout" className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
import Icon from './Icon'
