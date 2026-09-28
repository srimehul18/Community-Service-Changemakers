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
  const [recurringIssues, setRecurringIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [
          issuesData,
          categoriesData,
          analyticsData
        ] = await Promise.all([
          apiGet('/issues'),
          apiGet('/categories'),
          apiGet('/issues/analytics')
        ])

        setIssues(issuesData)
        setCategories(categoriesData)
        setRecurringIssues(
          analyticsData.recurringIssues || []
        )
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

  const getLocationLabel = (issue) => {
    const parts = []

    if (issue.tower) {
      parts.push(`Tower ${issue.tower}`)
    }

    if (issue.floor) {
      parts.push(`Floor ${issue.floor}`)
    }

    if (issue.flat) {
      parts.push(`Flat ${issue.flat}`)
    }

    if (issue.commonArea) {
      parts.push(issue.commonArea)
    }

    return parts.length
      ? parts.join(' • ')
      : 'Location not specified'
  }

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
          <>
            {/* Existing analytics charts */}
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

            {/* NEW: Recurring Issues */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
                  <Icon
                    name="alert"
                    className="h-4 w-4"
                  />
                </span>

                <div>
                  <h2 className="font-bold text-slate-800">
                    Recurring Issues
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Same category and location reported
                    3 or more times
                  </p>
                </div>
              </div>

              {recurringIssues.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="font-semibold text-slate-600">
                    No recurring issues detected.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Recurring issues appear after 3 or
                    more reports for the same category
                    and location.
                  </p>
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                        <th className="px-4 py-3">
                          Category
                        </th>

                        <th className="px-4 py-3">
                          Location
                        </th>

                        <th className="px-4 py-3 text-right">
                          Reports
                        </th>

                        <th className="px-4 py-3">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recurringIssues.map(
                        (issue, index) => (
                          <tr
                            key={`${issue.category}-${issue.tower}-${issue.floor}-${issue.flat}-${issue.commonArea}-${index}`}
                            className="border-b border-slate-50 last:border-0"
                          >
                            <td className="px-4 py-4 font-semibold text-slate-800">
                              {issue.category}
                            </td>

                            <td className="px-4 py-4 text-slate-600">
                              {getLocationLabel(
                                issue
                              )}
                            </td>

                            <td className="px-4 py-4 text-right">
                              <span className="font-bold text-amber-700">
                                {issue.count}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                Recurring
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default Analytics