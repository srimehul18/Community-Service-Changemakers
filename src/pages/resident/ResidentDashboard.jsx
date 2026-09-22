import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import IssueCard from '../../components/IssueCard'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../context/AuthContext'
import { useDemoData } from '../../context/useDemoData'

function ResidentDashboard() {
  const { currentUser } = useAuth(); const issues = useDemoData('issues').filter((issue) => issue.reporterId === currentUser.id)
  const stats = [['Total Issues', issues.length, 'violet'], ['Open', issues.filter((x) => x.status === 'Open').length, 'amber'], ['In Progress', issues.filter((x) => x.status === 'In Progress').length, 'blue'], ['Resolved', issues.filter((x) => x.status === 'Resolved').length, 'emerald']]
  return <AppLayout><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-emerald-700">Resident dashboard</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Good morning, {currentUser.name.split(' ')[0]}</h1><p className="mt-2 text-slate-600">Here&apos;s an overview of your reported issues.</p></div><Link to="/resident/report" className="rounded-lg bg-emerald-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-emerald-800">+ Report an Issue</Link></header><section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, value, accent]) => <StatCard key={label} label={label} value={value} accent={accent} />)}</section><section className="mt-8 grid gap-8 xl:grid-cols-[1fr_280px]"><div><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-800">Recent Issues</h2><p className="text-sm text-slate-500">Your latest reported concerns.</p></div><Link to="/resident/issues" className="text-sm font-bold text-emerald-700 hover:underline">View all</Link></div>{issues.length ? <div className="grid gap-3">{issues.slice(0, 3).map((issue) => <IssueCard key={issue.id} issue={issue} />)}</div> : <Empty />}</div><aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-800">Quick Actions</h2><div className="mt-4 grid gap-3"><Link to="/resident/report" className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-100">Report New Issue</Link><Link to="/resident/issues" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">View My Issues</Link></div></aside></section></div></AppLayout>
}
function Empty() { return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No issues reported yet.</div> }
export default ResidentDashboard
