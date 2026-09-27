import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import IssueCard from '../../components/IssueCard'
import StatCard from '../../components/StatCard'
import { apiGet } from '../../api/api'

function StaffDashboard() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await apiGet('/issues')
        setIssues(data)
      } catch (err) {
        setError(err.message || 'Failed to load assigned issues')
      } finally {
        setLoading(false)
      }
    }

    loadIssues()
  }, [])

  const stats = ['Open', 'In Progress', 'Resolved'].map((status, index) => [
    status,
    issues.filter((issue) => issue.status === status).length,
    ['amber', 'blue', 'emerald'][index]
  ])

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Staff Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Here are the issues assigned to you.
        </p>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Assigned Issues"
            value={issues.length}
            accent="violet"
          />

          {stats.map(([label, value, accent]) => (
            <StatCard
              key={label}
              label={label}
              value={value}
              accent={accent}
            />
          ))}
        </section>

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Recently Assigned
            </h2>
            <p className="text-sm text-slate-500">
              Your latest assigned issues.
            </p>
          </div>

          <Link
            to="/staff/issues"
            className="text-sm font-bold text-emerald-700 hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading assigned issues...
          </div>
        ) : error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {issues.length ? (
              issues.slice(0, 3).map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={{
                    ...issue,
                    id: issue._id,
                    category:
                      issue.category?.name || 'Uncategorized',
                    reporterId: issue.reportedBy?._id,
                    reporter:
                      issue.reportedBy?.name || 'Unknown resident'
                  }}
                  role="staff"
                />
              ))
            ) : (
              <p className="rounded-xl border border-dashed bg-white p-8 text-center text-slate-500">
                No issues assigned yet.
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default StaffDashboard