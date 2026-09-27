import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import PriorityBadge from '../../components/PriorityBadge'
import StatusBadge from '../../components/StatusBadge'
import { apiGet, apiPost } from '../../api/api'

function IssueDetails() {
  const { id } = useParams()

  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const [reopening, setReopening] = useState(false)

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

  async function feedback(event) {
    event.preventDefault()

    if (!rating) {
      setError('Please select a rating before submitting feedback.')
      return
    }

    try {
      setSubmittingFeedback(true)
      setError('')

      await apiPost(`/issues/${id}/feedback`, {
        rating,
        comment
      })

      await loadIssue()
    } catch (err) {
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  async function reopen() {
    try {
      setReopening(true)
      setError('')

      await apiPost(`/issues/${id}/reopen`, {})

      await loadIssue()
    } catch (err) {
      setError(err.message || 'Failed to reopen issue')
    } finally {
      setReopening(false)
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

  if (error && !issue) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-4xl">
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>

          <Link
            className="mt-4 inline-block text-sm font-bold text-emerald-700 hover:underline"
            to="/resident/issues"
          >
            ← Return to My Issues
          </Link>
        </div>
      </AppLayout>
    )
  }

  if (!issue) {
    return (
      <AppLayout>
        <p className="text-slate-600">
          Issue not found.{' '}
          <Link
            className="text-emerald-700 underline"
            to="/resident/issues"
          >
            Return to My Issues
          </Link>
        </p>
      </AppLayout>
    )
  }

  const categoryName =
    issue.category?.name || issue.category || 'Uncategorized'

  const reporterName =
    issue.reportedBy?.name || 'Unknown resident'

  const assignedStaff =
    issue.assignedTo?.name || 'Awaiting assignment'

  const locationParts = [
    issue.location?.tower && `Tower ${issue.location.tower}`,
    issue.location?.floor && `Floor ${issue.location.floor}`,
    issue.location?.flat && `Flat ${issue.location.flat}`,
    issue.location?.commonArea
  ].filter(Boolean)

  const location =
    locationParts.length > 0
      ? locationParts.join(', ')
      : 'Society premises'

  const submittedDate = issue.createdAt
    ? new Date(issue.createdAt).toLocaleString()
    : '—'

  const canGiveFeedback =
    issue.status === 'Resolved' || issue.status === 'Closed'

  const canReopen =
    issue.status === 'Resolved' || issue.status === 'Closed'

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        <Link
          className="text-sm font-bold text-emerald-700 hover:underline"
          to="/resident/issues"
        >
          ← My Issues
        </Link>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
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
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
            </div>
          </div>

          <p className="mt-5 leading-7 text-slate-600">
            {issue.description}
          </p>

          <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <Info label="Location" value={location} />

            <Info
              label="Reporter"
              value={reporterName}
            />

            <Info
              label="Submitted"
              value={submittedDate}
            />

            <Info
              label="Assigned staff"
              value={assignedStaff}
            />
          </dl>

          {issue.attachments?.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-5">
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
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-800">
            Status Timeline
          </h2>

          {issue.statusHistory?.length ? (
            <ol className="mt-4 space-y-4 border-l-2 border-emerald-100 pl-5">
              {issue.statusHistory.map((entry, index) => {
                const changedBy =
                  entry.changedBy?.name ||
                  'System'

                const changedAt = entry.createdAt
                  ? new Date(entry.createdAt).toLocaleString()
                  : '—'

                return (
                  <li key={entry._id || index}>
                    <p className="font-bold text-slate-700">
                      {entry.status}
                    </p>

                    <p className="text-sm text-slate-500">
                      {changedBy} · {changedAt}
                    </p>

                    {entry.note && (
                      <p className="mt-1 text-sm text-slate-600">
                        {entry.note}
                      </p>
                    )}
                  </li>
                )
              })}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No status history available.
            </p>
          )}
        </section>

        {canGiveFeedback && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-800">
              Resolution Feedback
            </h2>

            {issue.feedback ? (
              <div className="mt-3">
                <p className="text-slate-600">
                  Thank you for your{' '}
                  <span className="font-bold">
                    {issue.feedback.rating}/5
                  </span>{' '}
                  feedback.
                </p>

                {issue.feedback.comment && (
                  <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    “{issue.feedback.comment}”
                  </p>
                )}
              </div>
            ) : (
              <form
                onSubmit={feedback}
                className="mt-4 grid gap-3"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      type="button"
                      disabled={submittingFeedback}
                      onClick={() => setRating(number)}
                      className={`text-2xl ${
                        number <= rating
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  className="rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  placeholder="Share your feedback (optional)"
                  disabled={submittingFeedback}
                />

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-fit rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submittingFeedback
                    ? 'Submitting...'
                    : 'Submit Feedback'}
                </button>
              </form>
            )}

            {canReopen && (
              <button
                type="button"
                onClick={reopen}
                disabled={reopening}
                className="mt-4 text-sm font-bold text-red-700 hover:underline disabled:opacity-50"
              >
                {reopening
                  ? 'Reopening...'
                  : 'Not satisfied? Reopen Issue'}
              </button>
            )}
          </section>
        )}
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