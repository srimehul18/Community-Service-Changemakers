import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import IssueCard from '../../components/IssueCard'
import { apiGet } from '../../api/api'

function MyIssues() {
  const [issues, setIssues] = useState([])
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
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
        setError(err.message || 'Failed to load your issues')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const shown = issues.filter((issue) => {
    const issueCategory = issue.category?.name || ''

    return (
      issue.title.toLowerCase().includes(query.toLowerCase()) &&
      (!status || issue.status === status) &&
      (!category || issueCategory === category)
    )
  })

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          My Issues
        </h1>

        <p className="mt-2 text-slate-600">
          Track every issue you have reported.
        </p>

        <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Search issues"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>

            {['Open', 'In Progress', 'Resolved', 'Closed'].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading your issues...
          </div>
        ) : error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {shown.length ? (
              shown.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={{
                    ...issue,
                    id: issue._id,
                    reporterId: issue.reportedBy?._id,
                    category:
                      issue.category?.name || 'Uncategorized'
                  }}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                {issues.length
                  ? 'No issues match your filters.'
                  : 'No issues reported yet.'}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default MyIssues