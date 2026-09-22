import { Link } from 'react-router-dom'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'
import Icon from './Icon'

function IssueCard({ issue, role = 'resident' }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{issue.category}</span>
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-800">{issue.title}</h3>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1"><Icon name="location" className="h-3.5 w-3.5" />{issue.location}</span>
            <span className="inline-flex items-center gap-1"><Icon name="calendar" className="h-3.5 w-3.5" />{issue.date}</span>
          </div>
        </div>
        <Link className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 px-3 py-2 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50" to={`/${role}/issues/${issue.id}`}><Icon name="eye" className="h-4 w-4" />View Details</Link>
      </div>
    </article>
  )
}

export default IssueCard
