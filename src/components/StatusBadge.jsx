function StatusBadge({ status }) {
  const statusClasses = {
    Open: 'bg-amber-50 text-amber-700 ring-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
    Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Closed: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${statusClasses[status] ?? 'bg-slate-50 text-slate-600 ring-slate-200'}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />{status}</span>
}

export default StatusBadge
