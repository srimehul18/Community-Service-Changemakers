import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import IssueCard from '../../components/IssueCard'
import StatCard from '../../components/StatCard'
import { apiGet } from '../../api/api'

function AdminDashboard() {
  const [issues, setIssues] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [issuesData, categoriesData] = await Promise.all([
          apiGet('/issues'),
          apiGet('/categories')
        ])

        setIssues(issuesData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const stats = [
    ['Total Issues', issues.length, 'violet'],
    [
      'Open',
      issues.filter((issue) => issue.status === 'Open').length,
      'amber'
    ],
    [
      'In Progress',
      issues.filter((issue) => issue.status === 'In Progress').length,
      'blue'
    ],
    [
      'Resolved',
      issues.filter((issue) => issue.status === 'Resolved').length,
      'emerald'
    ],
    [
      'Closed',
      issues.filter((issue) => issue.status === 'Closed').length,
      'emerald'
    ]
  ]

  const highPriorityIssues = issues
    .filter((issue) =>
      ['High', 'Critical'].includes(issue.priority)
    )
    .slice(0, 3)

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Society issue overview and administration.
        </p>

        {loading ? (
          <div className="mt-7 rounded-xl border bg-white p-10 text-center text-slate-500">
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {stats.map(([label, value, accent]) => (
                <StatCard
                  key={label}
                  label={label}
                  value={value}
                  accent={accent}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border bg-white p-5">
                <h2 className="text-xl font-bold">
                  High-priority issues
                </h2>

                <div className="mt-4 grid gap-3">
                  {highPriorityIssues.length ? (
                    highPriorityIssues.map((issue) => (
                      <IssueCard
                        key={issue._id}
                        role="admin"
                        issue={{
                          ...issue,
                          id: issue._id,
                          category:
                            issue.category?.name || 'Uncategorized',
                          reporter:
                            issue.reportedBy?.name || 'Unknown resident'
                        }}
                      />
                    ))
                  ) : (
                    <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                      No high-priority issues.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-xl border bg-white p-5">
                <h2 className="text-xl font-bold">
                  Category summary
                </h2>

                <div className="mt-4 grid gap-3">
                  {categories.map((category) => {
                    const count = issues.filter(
                      (issue) =>
                        issue.category?._id === category._id
                    ).length

                    return (
                      <div
                        key={category._id}
                        className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span>{category.name}</span>
                        <strong>{count}</strong>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                ['All Issues', '/admin/issues'],
                ['Users', '/admin/users'],
                ['Categories', '/admin/categories'],
                ['Analytics', '/admin/analytics']
              ].map(([label, to]) => (
                <Link
                  key={label}
                  to={to}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800"
                >
                  {label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default AdminDashboard