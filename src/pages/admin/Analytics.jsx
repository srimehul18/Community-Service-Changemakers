import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { apiGet } from '../../api/api'

const palette = [
  '#059669',
  '#0d9488',
  '#0284c7',
  '#8b5cf6',
  '#f59e0b',
  '#f43f5e'
]

const tooltipStyle = {
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 20px rgba(15,23,42,.08)'
}

function ChartCard({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
          <Icon name={icon} className="h-4 w-4" />
        </span>

        <h2 className="font-bold text-slate-800">
          {title}
        </h2>
      </div>

      <div className="mt-5 h-72">
        {children}
      </div>
    </section>
  )
}

function Analytics() {
  const [issues, setIssues] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [issuesData, categoriesData] =
          await Promise.all([
            apiGet('/issues'),
            apiGet('/categories')
          ])

        setIssues(issuesData)
        setCategories(categoriesData)
      } catch (err) {
        setError(
          err.message || 'Failed to load analytics'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const categoryData = categories.map(
    (category) => ({
      label: category.name,
      value: issues.filter(
        (issue) =>
          issue.category?._id === category._id
      ).length
    })
  )

  const statusData = [
    'Open',
    'In Progress',
    'Resolved',
    'Closed'
  ].map((status) => ({
    label: status,
    value: issues.filter(
      (issue) => issue.status === status
    ).length
  }))

  const priorityData = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ].map((priority) => ({
    label: priority,
    value: issues.filter(
      (issue) => issue.priority === priority
    ).length
  }))

  const trendData = [...issues]
    .sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    )
    .reduce((list, issue) => {
      const label = new Intl.DateTimeFormat(
        'en-US',
        { month: 'short' }
      ).format(new Date(issue.createdAt))

      const existing = list.find(
        (entry) => entry.label === label
      )

      if (existing) {
        existing.value += 1
      } else {
        list.push({
          label,
          value: 1
        })
      }

      return list
    }, [])

  const resolved = issues.filter(
    (issue) =>
      ['Resolved', 'Closed'].includes(
        issue.status
      )
  ).length

  const resolutionRate = issues.length
    ? Math.round(
        (resolved / issues.length) * 100
      )
    : 0

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Analytics
            </h1>

            <p className="mt-2 text-slate-600">
              Analytics based on live issue data.
            </p>
          </div>

          {!loading && !error && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <span className="font-bold">
                {resolutionRate}%
              </span>{' '}
              resolved or closed
            </div>
          )}
        </header>

        {loading ? (
          <div className="mt-7 rounded-xl border bg-white p-10 text-center text-slate-500">
            Loading analytics...
          </div>
        ) : error ? (
          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <section className="mt-7 grid gap-5 md:grid-cols-2">
            <ChartCard
              title="Issues by category"
              icon="tag"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 8,
                    right: 8,
                    left: -20,
                    bottom: 5
                  }}
                >
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={55}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Bar
                    dataKey="value"
                    name="Issues"
                    radius={[5, 5, 0, 0]}
                  >
                    {categoryData.map(
                      (item, index) => (
                        <Cell
                          key={item.label}
                          fill={
                            palette[
                              index %
                                palette.length
                            ]
                          }
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Issues by status"
              icon="clipboard"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="48%"
                    innerRadius="48%"
                    outerRadius="72%"
                    paddingAngle={3}
                  >
                    {statusData.map(
                      (item, index) => (
                        <Cell
                          key={item.label}
                          fill={
                            palette[
                              index %
                                palette.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Issues by priority"
              icon="alert"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={priorityData}
                  layout="vertical"
                  margin={{
                    top: 6,
                    right: 16,
                    left: 20,
                    bottom: 6
                  }}
                >
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    type="category"
                    dataKey="label"
                    width={58}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Bar
                    dataKey="value"
                    name="Issues"
                    fill="#0f766e"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Reported issue trend"
              icon="chart"
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={trendData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5
                  }}
                >
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Reported issues"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="#059669"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>
        )}
      </div>
    </AppLayout>
  )
}

export default Analytics