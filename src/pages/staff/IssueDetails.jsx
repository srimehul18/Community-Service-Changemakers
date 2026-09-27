import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import PriorityBadge from '../../components/PriorityBadge'
import StatusBadge from '../../components/StatusBadge'
import { apiGet, apiPatch } from '../../api/api'

function IssueDetails() {
  const { id } = useParams()

  const [issue, setIssue] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  const loadIssue = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiGet(`/issues/${id}`)
      setIssue(data)
    } catch (err) {
      setError(err.message || 'Failed to load issue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIssue()
  }, [id])

  async function updateStatus(status) {
    try {
      setUpdating(true)
      setError('')

      const updatedIssue = await apiPatch(`/issues/${id}`, {
        status,
        note
      })

      setIssue(updatedIssue)
      setNote('')
    } catch (err) {
      setError(err.message || 'Failed to update issue')
    } finally {
      setUpdating(false)
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
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error || 'Issue not found.'}
          </p>

          <Link
            className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline"
            to="/staff/issues"
          >
            ← Back to Assigned Issues
          </Link>
        </div>
      </AppLayout>
    )
  }

  const categoryName =
    issue.category?.name || 'Uncategorized'

  const reporterName =
    issue.reportedBy?.name || 'Unknown resident'

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
      <div className="mx-auto max-w-4xl">
        <Link
          className="text-sm font-bold text-emerald-700 hover:underline"
          to="/staff/issues"
        >
          ← Assigned Issues
        </Link>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <article className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">
                {issue._id} · {categoryName}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {issue.title}
              </h1>
            </div>

            <div className="flex gap-2">
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
            </div>
          </div>

          <p className="mt-5 leading-7 text-slate-600">
            {issue.description}
          </p>

          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <Info
              label="Location"
              value={location}
            />

            <Info
              label="Reported by"
              value={reporterName}
            />

            <Info
              label="Submitted"
              value={
                issue.createdAt
                  ? new Date(issue.createdAt).toLocaleString()
                  : '—'
              }
            />

            <Info
              label="Priority"
              value={issue.priority}
            />
          </div>

          {issue.attachments?.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm font-bold text-slate-700">
                Attachments
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {issue.attachments.map((attachment, index) => (
                  <a
                    key={attachment.publicId || index}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-lg border border-slate-200 hover:border-emerald-400"
                  >
                    <img
                      src={attachment.url}
                      alt={attachment.fileName || 'Issue attachment'}
                      className="h-48 w-full object-cover"
                    />

                    <p className="truncate px-3 py-2 text-sm text-slate-600">
                      {attachment.fileName || 'View attachment'}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Update Issue
          </h2>

          <textarea
            className="mt-4 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a note about this status update"
            rows="4"
            disabled={updating}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateStatus('In Progress')}
              disabled={
                updating ||
                issue.status === 'In Progress'
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? 'Updating...'
                : 'Mark In Progress'}
            </button>

            <button
              type="button"
              onClick={() => updateStatus('Resolved')}
              disabled={
                updating ||
                issue.status === 'Resolved'
              }
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? 'Updating...'
                : 'Mark Resolved'}
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-800">
            History
          </h2>

          {issue.statusHistory?.length ? (
            <ol className="mt-4 space-y-4 border-l-2 border-emerald-100 pl-5">
              {issue.statusHistory.map((entry, index) => (
                <li key={entry._id || index}>
                  <p className="font-bold text-slate-700">
                    {entry.status}
                  </p>

                  <p className="text-sm text-slate-500">
                    {entry.changedBy?.name || 'System'} ·{' '}
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
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No history available.
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
      <p className="text-xs font-bold uppercase text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value}
      </p>
    </div>
  )
}

export default IssueDetails