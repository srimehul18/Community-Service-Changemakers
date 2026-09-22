import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import IssueCard from '../../components/IssueCard'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../context/AuthContext'
import { useDemoData } from '../../context/useDemoData'
function StaffDashboard() { const { currentUser } = useAuth(); const issues = useDemoData('issues').filter((x) => x.assignedTo === currentUser.id); const stats = ['Open', 'In Progress', 'Resolved'].map((x, i) => [x, issues.filter((y) => y.status === x).length, ['amber','blue','emerald'][i]]); return <AppLayout><div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}</h1><p className="mt-2 text-slate-600">Here are the issues assigned to you.</p><section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Assigned Issues" value={issues.length} accent="violet" />{stats.map(([l,v,a])=><StatCard key={l} label={l} value={v} accent={a} />)}</section><div className="mt-8 flex items-center justify-between"><h2 className="text-xl font-bold text-slate-800">Recently Assigned</h2><Link to="/staff/issues" className="text-sm font-bold text-emerald-700 hover:underline">View all</Link></div><div className="mt-4 grid gap-3">{issues.length ? issues.slice(0,3).map((x)=><IssueCard issue={x} role="staff" key={x.id} />) : <p className="rounded-xl border border-dashed bg-white p-8 text-center text-slate-500">No issues assigned yet.</p>}</div></div></AppLayout> }
export default StaffDashboard
