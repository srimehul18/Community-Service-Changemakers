import { Area, AreaChart, Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { useDemoData } from '../../context/useDemoData'

const palette = ['#059669', '#0d9488', '#0284c7', '#8b5cf6', '#f59e0b', '#f43f5e']
const tooltipStyle = { borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 8px 20px rgba(15,23,42,.08)' }

function ChartCard({ title, icon, children }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-2.5"><span className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><Icon name={icon} className="h-4 w-4" /></span><h2 className="font-bold text-slate-800">{title}</h2></div><div className="mt-5 h-72">{children}</div></section>
}

function Analytics() {
  const issues = useDemoData('issues')
  const categories = useDemoData('categories')
  const count = (values, key) => values.map((label) => ({ label, value: issues.filter((issue) => issue[key] === label).length }))
  const categoryData = count(categories, 'category')
  const statusData = count(['Open', 'In Progress', 'Resolved', 'Closed'], 'status')
  const priorityData = count(['Low', 'Medium', 'High', 'Critical'], 'priority')
  const trendData = [...issues].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).reduce((list, issue) => {
    const label = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(issue.createdAt))
    const item = list.find((entry) => entry.label === label)
    if (item) item.value += 1
    else list.push({ label, value: 1 })
    return list
  }, [])
  const resolved = issues.filter((issue) => ['Resolved', 'Closed'].includes(issue.status)).length
  const resolutionRate = issues.length ? Math.round((resolved / issues.length) * 100) : 0

  return <AppLayout><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-emerald-700">Administration</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Analytics</h1><p className="mt-2 text-slate-600">Data shown is based on the current frontend demo data.</p></div><div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span className="font-bold">{resolutionRate}%</span> resolved or closed</div></header><section className="mt-7 grid gap-5 md:grid-cols-2"><ChartCard title="Issues by category" icon="tag"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData} margin={{ top: 8, right: 8, left: -20, bottom: 5 }}><XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={55}/><YAxis allowDecimals={false} tick={{ fontSize: 11 }}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="value" name="Issues" radius={[5, 5, 0, 0]}>{categoryData.map((item, index) => <Cell key={item.label} fill={palette[index % palette.length]} />)}</Bar></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Issues by status" icon="clipboard"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="label" cx="50%" cy="48%" innerRadius="48%" outerRadius="72%" paddingAngle={3}>{statusData.map((item, index) => <Cell key={item.label} fill={palette[index]} />)}</Pie><Tooltip contentStyle={tooltipStyle}/><Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }}/></PieChart></ResponsiveContainer></ChartCard><ChartCard title="Issues by priority" icon="alert"><ResponsiveContainer width="100%" height="100%"><BarChart data={priorityData} layout="vertical" margin={{ top: 6, right: 16, left: 20, bottom: 6 }}><XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }}/><YAxis type="category" dataKey="label" width={58} tick={{ fontSize: 11 }}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="value" name="Issues" fill="#0f766e" radius={[0, 5, 5, 0]} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Reported issue trend" icon="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}><defs><linearGradient id="issueTrend" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.35}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="label" tick={{ fontSize: 11 }}/><YAxis allowDecimals={false} tick={{ fontSize: 11 }}/><Tooltip contentStyle={tooltipStyle}/><Area type="monotone" dataKey="value" name="Reported issues" stroke="#059669" strokeWidth={2.5} fill="url(#issueTrend)" /></AreaChart></ResponsiveContainer></ChartCard></section></div></AppLayout>
}

export default Analytics
