import Icon from './Icon'

function StatCard({ label, value, icon, accent = 'emerald' }) {
  const accentClasses = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
  }

  const defaultIcons = { 'Total Issues': 'clipboard', 'Assigned Issues': 'clipboard', Open: 'alert', 'In Progress': 'refresh', Resolved: 'file', Closed: 'file' }
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClasses[accent] ?? accentClasses.emerald}`}>
          {icon || <Icon name={defaultIcons[label] || 'dashboard'} />}
        </span>
      </div>
    </article>
  )
}

export default StatCard
