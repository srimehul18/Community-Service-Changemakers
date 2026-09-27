import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { apiGet, apiPost } from '../../api/api'

const input =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

function ReportIssue() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const data = await apiGet('/categories')
        setCategories(data)
      } catch (err) {
        setError(err.message || 'Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  async function submit(event) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)

    const title = form.get('title')?.trim()
    const description = form.get('description')?.trim()
    const category = form.get('category')
    const priority = form.get('priority')

    if (!title || !description || !category) {
      setError('Please fill in the required fields.')
      return
    }

    const location = {
      tower: form.get('block')?.trim() || '',
      floor: form.get('floor')?.trim() || '',
      flat: form.get('flat')?.trim() || '',
      commonArea: form.get('commonArea')?.trim() || ''
    }

    const images = form.getAll('images')

    const issueData = new FormData()

    issueData.append('title', title)
    issueData.append('description', description)
    issueData.append('category', category)
    issueData.append('priority', priority)
    issueData.append('location', JSON.stringify(location))

    images.forEach((image) => {
      if (image instanceof File && image.size > 0) {
        issueData.append('images', image)
      }
    })

    try {
      setSubmitting(true)
      setError('')

      await apiPost('/issues', issueData)

      navigate('/resident/issues')
    } catch (err) {
      setError(err.message || 'Failed to report the issue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Report an Issue
        </h1>

        <p className="mt-2 text-slate-600">
          Share a concern and our team will follow up.
        </p>

        <form
          onSubmit={submit}
          className="mt-7 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <Field label="Issue Title">
            <input
              name="title"
              className={input}
              required
              disabled={submitting}
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              className={input}
              rows="4"
              required
              disabled={submitting}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              <select
                name="category"
                className={input}
                required
                disabled={loadingCategories || submitting}
              >
                <option value="">
                  {loadingCategories
                    ? 'Loading categories...'
                    : 'Select category'}
                </option>

                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Priority">
              <select
                name="priority"
                className={input}
                defaultValue="Medium"
                disabled={submitting}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Block">
              <input
                name="block"
                className={input}
                disabled={submitting}
              />
            </Field>

            <Field label="Floor">
              <input
                name="floor"
                className={input}
                disabled={submitting}
              />
            </Field>

            <Field label="Flat Number">
              <input
                name="flat"
                className={input}
                disabled={submitting}
              />
            </Field>
          </div>

          <Field label="Common Area">
            <input
              name="commonArea"
              className={input}
              placeholder="e.g. Garden, lobby, parking"
              disabled={submitting}
            />
          </Field>

          <Field label="Photo (optional)">
            <input
              name="images"
              className="text-sm"
              type="file"
              accept="image/*"
              multiple
              disabled={submitting}
            />
          </Field>

          <button
            type="submit"
            disabled={submitting || loadingCategories}
            className="rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting Issue...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default ReportIssue