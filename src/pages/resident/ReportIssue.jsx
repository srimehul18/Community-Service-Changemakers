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
  const [locationType, setLocationType] = useState('flat')

  const [societyConfig, setSocietyConfig] = useState({
    towers: [],
    floors: [],
    commonAreas: []
  })

  const [loadingSocietyConfig, setLoadingSocietyConfig] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingCategories(true)
        setLoadingSocietyConfig(true)
        setError('')

        const [categoriesData, societyConfigData] =
          await Promise.all([
            apiGet('/categories'),
            apiGet('/society-config')
          ])

        setCategories(categoriesData)

        setSocietyConfig({
          towers: societyConfigData.towers || [],
          floors: societyConfigData.floors || [],
          commonAreas: societyConfigData.commonAreas || []
        })
      } catch (err) {
        setError(
          err.message ||
          'Failed to load reporting options'
        )
      } finally {
        setLoadingCategories(false)
        setLoadingSocietyConfig(false)
      }
    }

    loadData()
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
      tower:
        locationType === 'flat'
          ? form.get('block')?.trim() || ''
          : '',
      floor:
        locationType === 'flat'
          ? form.get('floor')?.trim() || ''
          : '',
      flat:
        locationType === 'flat'
          ? form.get('flat')?.trim() || ''
          : '',
      commonArea:
        locationType === 'commonArea'
          ? form.get('commonArea')?.trim() || ''
          : ''
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

          <div className="grid gap-5">
            <Field label="Where is the issue?">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300">
                  <input
                    type="radio"
                    name="locationType"
                    value="flat"
                    checked={locationType === 'flat'}
                    onChange={() => setLocationType('flat')}
                    disabled={submitting}
                    className="accent-emerald-600"
                  />
                  Inside a flat
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-emerald-300">
                  <input
                    type="radio"
                    name="locationType"
                    value="commonArea"
                    checked={locationType === 'commonArea'}
                    onChange={() =>
                      setLocationType('commonArea')
                    }
                    disabled={submitting}
                    className="accent-emerald-600"
                  />
                  Common area
                </label>
              </div>
            </Field>

            {locationType === 'flat' ? (
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Tower">
                  <select
                    name="block"
                    className={input}
                    disabled={
                      loadingSocietyConfig || submitting
                    }
                    required
                  >
                    <option value="">
                      {loadingSocietyConfig
                        ? 'Loading towers...'
                        : 'Select tower'}
                    </option>

                    {societyConfig.towers
                      .filter((tower) => tower.isActive)
                      .map((tower) => (
                        <option
                          key={tower._id}
                          value={tower.name}
                        >
                          {tower.name}
                        </option>
                      ))}
                  </select>
                </Field>

                <Field label="Floor">
                  <select
                    name="floor"
                    className={input}
                    disabled={
                      loadingSocietyConfig || submitting
                    }
                    required
                  >
                    <option value="">
                      {loadingSocietyConfig
                        ? 'Loading floors...'
                        : 'Select floor'}
                    </option>

                    {societyConfig.floors
                      .filter((floor) => floor.isActive)
                      .map((floor) => (
                        <option
                          key={floor._id}
                          value={floor.name}
                        >
                          {floor.name}
                        </option>
                      ))}
                  </select>
                </Field>

                <Field label="Flat Number">
                  <input
                    name="flat"
                    className={input}
                    disabled={submitting}
                    placeholder="e.g. B217"
                    required
                  />
                </Field>
              </div>
            ) : (
              <Field label="Common Area">
                <select
                  name="commonArea"
                  className={input}
                  disabled={
                    loadingSocietyConfig || submitting
                  }
                  required
                >
                  <option value="">
                    {loadingSocietyConfig
                      ? 'Loading common areas...'
                      : 'Select common area'}
                  </option>

                  {societyConfig.commonAreas
                    .filter((area) => area.isActive)
                    .map((area) => (
                      <option
                        key={area._id}
                        value={area.name}
                      >
                        {area.name}
                      </option>
                    ))}
                </select>
              </Field>
            )}
          </div>

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
            disabled={
              submitting ||
              loadingCategories ||
              loadingSocietyConfig
            }
            className="rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Submitting Issue...'
              : 'Submit Issue'}
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