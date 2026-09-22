function PriorityBadge({ priority }) {
  const priorityClasses = {
    High: 'bg-red-50 text-red-700 ring-red-200',
    Critical: 'bg-red-100 text-red-800 ring-red-300',
    Medium: 'bg-orange-50 text-orange-700 ring-orange-200',
    Low: 'bg-slate-100 text-slate-600 ring-slate-200',
  }

  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${priorityClasses[priority] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />{priority}</span>
}

export default PriorityBadge
