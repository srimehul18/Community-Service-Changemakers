import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { Link } from 'react-router-dom'
import PriorityBadge from '../../components/PriorityBadge'
import StatusBadge from '../../components/StatusBadge'
import SelectMenu from '../../components/SelectMenu'
import { apiGet, apiPatch } from '../../api/api'

function AllIssues() {
  const [issues, setIssues] = useState([])
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])

  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [issuesData, usersData, categoriesData] =
          await Promise.all([
            apiGet('/issues'),
            apiGet('/users'),
            apiGet('/categories')
          ])

        setIssues(issuesData)
        setUsers(usersData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message || 'Failed to load issues')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' }
  ]

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((item) => ({
      value: item._id,
      label: item.name
    }))
  ]

  const priorityOptions = [
    { value: '', label: 'All priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ]

  const staffOptions = [
    { value: '', label: 'Unassigned' },
    ...users
      .filter((user) => user.role === 'staff')
      .map((user) => ({
        value: user._id,
        label: user.name
      }))
  ]

  const shown = issues.filter((issue) => {
    const matchesQuery = String(issue.title || '')
      .toLowerCase()
      .includes(q.toLowerCase())

    const matchesStatus =
      !status || issue.status === status

    const matchesCategory =
      !category || issue.category?._id === category

    const matchesPriority =
      !priority || issue.priority === priority

    return (
      matchesQuery &&
      matchesStatus &&
      matchesCategory &&
      matchesPriority
    )
  })

  async function change(issueId, key, value) {
    try {
      setError('')

      const updatedIssue = await apiPatch(
        `/issues/${issueId}`,
        {
          [key]: value || null
        }
      )

      setIssues((current) =>
        current.map((issue) =>
          issue._id === issueId
            ? updatedIssue
            : issue
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to update issue')
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">
          All Issues
        </h1>

        <p className="mt-2 text-slate-600">
          Review, prioritize and assign society issues.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />

          <SelectMenu
            value={status}
            onChange={setStatus}
            options={statusOptions}
            className="w-full"
          />

          <SelectMenu
            value={category}
            onChange={setCategory}
            options={categoryOptions}
            className="w-full"
          />

          <SelectMenu
            value={priority}
            onChange={setPriority}
            options={priorityOptions}
            className="w-full"
          />
        </div>

        {loading ? (
          <div className="mt-5 rounded-xl border bg-white p-10 text-center text-slate-500">
            Loading issues...
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {[
                    'Issue',
                    'Reporter / Location',
                    'Status',
                    'Priority',
                    'Assign staff',
                    'Edit'
                  ].map((item) => (
                    <th key={item} className="p-3">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {shown.map((issue) => (
                  <tr
                    key={issue._id}
                    className="border-t"
                  >
                    <td className="p-3">
                      <Link
                        to={`/admin/issues/${issue._id}`}
                        className="font-bold text-slate-900 hover:text-emerald-700 hover:underline"
                      >
                        {issue.title}
                      </Link>

                      <br />

                      <span className="text-slate-500">
                        {issue.category?.name || 'Uncategorized'}{' '}
                        ·{' '}
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : '—'}
                      </span>

                      <br />

                      <Link
                        to={`/admin/issues/${issue._id}`}
                        className="mt-1 inline-block text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        View Details →
                      </Link>
                    </td>

                    <td className="p-3">
                      {issue.reportedBy?.name ||
                        'Unknown resident'}

                      <br />

                      <span className="text-slate-500">
                        {[
                          issue.location?.tower &&
                          `Tower ${issue.location.tower}`,
                          issue.location?.floor &&
                          `Floor ${issue.location.floor}`,
                          issue.location?.flat &&
                          `Flat ${issue.location.flat}`,
                          issue.location?.commonArea
                        ]
                          .filter(Boolean)
                          .join(', ') ||
                          'Society premises'}
                      </span>
                    </td>

                    <td className="p-3">
                      <StatusBadge
                        status={issue.status}
                      />
                    </td>

                    <td className="p-3">
                      <PriorityBadge
                        priority={issue.priority}
                      />
                    </td>

                    <td className="p-3">
                      <SelectMenu
                        value={
                          issue.assignedTo?._id ||
                          issue.assignedTo ||
                          ''
                        }
                        onChange={(value) =>
                          change(
                            issue._id,
                            'assignedTo',
                            value
                          )
                        }
                        options={staffOptions}
                        className="w-40"
                      />
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        <SelectMenu
                          value={
                            issue.category?._id ||
                            ''
                          }
                          onChange={(value) =>
                            change(
                              issue._id,
                              'category',
                              value
                            )
                          }
                          options={categories.map(
                            (item) => ({
                              value: item._id,
                              label: item.name
                            })
                          )}
                          className="w-36"
                        />

                        <SelectMenu
                          value={issue.priority}
                          onChange={(value) =>
                            change(
                              issue._id,
                              'priority',
                              value
                            )
                          }
                          options={[
                            {
                              value: 'Low',
                              label: 'Low'
                            },
                            {
                              value: 'Medium',
                              label: 'Medium'
                            },
                            {
                              value: 'High',
                              label: 'High'
                            },
                            {
                              value: 'Critical',
                              label: 'Critical'
                            }
                          ]}
                          className="w-36"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !shown.length && (
          <p className="mt-5 text-slate-500">
            No issues match your filters.
          </p>
        )}
      </div>
    </AppLayout>
  )
}

export default AllIssues