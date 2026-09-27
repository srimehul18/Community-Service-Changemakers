import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import PriorityBadge from '../../components/PriorityBadge'
import StatusBadge from '../../components/StatusBadge'
import SelectMenu from '../../components/SelectMenu'
import { apiGet, apiPatch, apiDelete } from '../../api/api'

function IssueDetails() {
  const { id } = useParams()

  const [issue, setIssue] = useState(null)
  const [users, setUsers] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [issueData, usersData, categoriesData] =
        await Promise.all([
          apiGet(`/issues/${id}`),
          apiGet('/users'),
          apiGet('/categories')
        ])

      setIssue(issueData)
      setUsers(usersData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load issue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  async function updateIssue(changes) {
    try {
      setSaving(true)
      setError('')

      const updatedIssue = await apiPatch(
        `/issues/${id}`,
        changes
      )

      setIssue(updatedIssue)
    } catch (err) {
      setError(err.message || 'Failed to update issue')
    } finally {
      setSaving(false)
    }
  }

  async function deleteIssue() {
    const confirmed = window.confirm(
      'Delete this issue permanently?'
    )

    if (!confirmed) return

    try {
      setSaving(true)
      setError('')

      await apiDelete(`/issues/${id}`)

      window.location.href = '/admin/issues'
    } catch (err) {
      setError(err.message || 'Failed to delete issue')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading issue...
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!issue) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error || 'Issue not found.'}
          </div>

          <Link
            to="/admin/issues"
            className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline"
          >
            ← Back to All Issues
          </Link>
        </div>
      </AppLayout>
    )
  }

  const categoryName =
    issue.category?.name || 'Uncategorized'

  const reporterName =
    issue.reportedBy?.name || 'Unknown resident'

  const assignedStaff =
    issue.assignedTo?.name || 'Unassigned'

  const staffOptions = [
    { value: '', label: 'Unassigned' },
    ...users
      .filter((user) => user.role === 'staff')
      .map((user) => ({
        value: user._id,
        label: user.name
      }))
  ]

  const categoryOptions = categories.map(
    (category) => ({
      value: category._id,
      label: category.name
    })
  )

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' }
  ]

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' }
  ]

  const locationParts = [
    issue.location?.tower &&
      `Tower ${issue.location.tower}`,
    issue.location?.floor &&
      `Floor ${issue.location.floor}`,
    issue.location?.flat &&
      `Flat ${issue.location.flat}`,
    issue.location?.commonArea
  ].filter(Boolean)

  const location =
    locationParts.length
      ? locationParts.join(', ')
      : 'Society premises'

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <Link
          to="/admin/issues"
          className="text-sm font-bold text-emerald-700 hover:underline"
        >
          ← All Issues
        </Link>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">
                {issue._id} · {categoryName}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {issue.title}
              </h1>
            </div>

            <div className="flex gap-2">
              <PriorityBadge
                priority={issue.priority}
              />

              <StatusBadge
                status={issue.status}
              />
            </div>
          </div>

          <p className="mt-5 leading-7 text-slate-600">
            {issue.description}
          </p>

          <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <Info
              label="Reporter"
              value={reporterName}
            />

            <Info
              label="Assigned staff"
              value={assignedStaff}
            />

            <Info
              label="Location"
              value={location}
            />

            <Info
              label="Submitted"
              value={
                issue.createdAt
                  ? new Date(
                      issue.createdAt
                    ).toLocaleString()
                  : '—'
              }
            />
          </dl>

          {issue.attachments?.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h2 className="font-bold text-slate-800">
                Attachments
              </h2>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {issue.attachments.map(
                  (attachment, index) => (
                    <a
                      key={
                        attachment.publicId ||
                        index
                      }
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="overflow-hidden rounded-lg border border-slate-200 hover:border-emerald-400"
                    >
                      <img
                        src={attachment.url}
                        alt={
                          attachment.fileName ||
                          'Issue attachment'
                        }
                        className="h-48 w-full object-cover"
                      />

                      <p className="truncate px-3 py-2 text-sm text-slate-600">
                        {attachment.fileName ||
                          'View attachment'}
                      </p>
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Controls */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Manage Issue
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Assign Staff
              </label>

              <div className="mt-2">
                <SelectMenu
                  value={
                    issue.assignedTo?._id ||
                    issue.assignedTo ||
                    ''
                  }
                  onChange={(value) =>
                    updateIssue({
                      assignedTo: value || null
                    })
                  }
                  options={staffOptions}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Category
              </label>

              <div className="mt-2">
                <SelectMenu
                  value={
                    issue.category?._id || ''
                  }
                  onChange={(value) =>
                    updateIssue({
                      category: value
                    })
                  }
                  options={categoryOptions}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400">
                Priority
              </label>

              <div className="mt-2">
                <SelectMenu
                  value={issue.priority}
                  onChange={(value) =>
                    updateIssue({
                      priority: value
                    })
                  }
                  options={priorityOptions}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 max-w-sm">
            <label className="text-xs font-bold uppercase text-slate-400">
              Status
            </label>

            <div className="mt-2">
              <SelectMenu
                value={issue.status}
                onChange={(value) =>
                  updateIssue({
                    status: value
                  })
                }
                options={statusOptions}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={deleteIssue}
              disabled={saving}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Delete Issue
            </button>
          </div>
        </section>

        {/* Status History */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Status History
          </h2>

          {issue.statusHistory?.length ? (
            <ol className="mt-4 space-y-4 border-l-2 border-emerald-100 pl-5">
              {issue.statusHistory.map(
                (entry, index) => (
                  <li
                    key={entry._id || index}
                  >
                    <p className="font-bold text-slate-700">
                      {entry.status}
                    </p>

                    <p className="text-sm text-slate-500">
                      {entry.changedBy?.name ||
                        'System'}{' '}
                      ·{' '}
                      {entry.createdAt
                        ? new Date(
                            entry.createdAt
                          ).toLocaleString()
                        : '—'}
                    </p>

                    {entry.note && (
                      <p className="mt-1 text-sm text-slate-600">
                        {entry.note}
                      </p>
                    )}
                  </li>
                )
              )}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No status history available.
            </p>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase text-slate-400">
        {label}
      </dt>

      <dd className="mt-1 text-sm text-slate-700">
        {value}
      </dd>
    </div>
  )
}

export default IssueDetails