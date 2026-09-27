import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import IssueCard from '../../components/IssueCard'
import { apiGet } from '../../api/api'

function AssignedIssues() {
  const [issues, setIssues] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
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

  const filteredIssues = issues.filter((issue) => {
    const matchesQuery = issue.title
      .toLowerCase()
      .includes(query.toLowerCase())

    const matchesStatus =
      !status || issue.status === status

    const matchesPriority =
      !priority || issue.priority === priority

    return matchesQuery && matchesStatus && matchesPriority
  })

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Assigned Issues
        </h1>

        <p className="mt-2 text-slate-600">
          Issues currently assigned to you.
        </p>

        <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
          <input
            className="rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-emerald-600"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            className="rounded-lg border border-slate-200 p-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>

            {['Open', 'In Progress', 'Resolved', 'Closed'].map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              )
            )}
          </select>

          <select
            className="rounded-lg border border-slate-200 p-2 text-sm"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="">All priorities</option>

            {['Low', 'Medium', 'High', 'Critical'].map(
              (item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              )
            )}
          </select>
        </div>

        {loading ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading assigned issues...
          </div>
        ) : error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {filteredIssues.length ? (
              filteredIssues.map((issue) => (
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
              <p className="rounded-xl border border-dashed bg-white p-10 text-center text-slate-500">
                {issues.length
                  ? 'No assigned issues match your filters.'
                  : 'No assigned issues found.'}
              </p>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default AssignedIssues