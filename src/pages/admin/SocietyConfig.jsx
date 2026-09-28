import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import Icon from '../../components/Icon'
import { apiGet, apiPatch } from '../../api/api'

const emptyConfig = {
  towers: [],
  floors: [],
  commonAreas: []
}

function SocietyConfig() {
  const [config, setConfig] = useState(emptyConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [newTower, setNewTower] = useState('')
  const [newFloor, setNewFloor] = useState('')
  const [newCommonArea, setNewCommonArea] = useState('')

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await apiGet('/society-config')

        setConfig({
          towers: data.towers || [],
          floors: data.floors || [],
          commonAreas: data.commonAreas || []
        })
      } catch (err) {
        setError(
          err.message || 'Failed to load society configuration'
        )
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const addItem = (field, value, setter) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) return

    const alreadyExists = config[field].some(
      (item) =>
        item.name.toLowerCase() === trimmedValue.toLowerCase()
    )

    if (alreadyExists) {
      setError(`${trimmedValue} already exists`)
      return
    }

    setConfig((current) => ({
      ...current,
      [field]: [
        ...current[field],
        {
          name: trimmedValue,
          isActive: true
        }
      ]
    }))

    setter('')
    setError('')
    setSuccess('')
  }

  const removeItem = (field, index) => {
    setConfig((current) => ({
      ...current,
      [field]: current[field].filter(
        (_, itemIndex) => itemIndex !== index
      )
    }))

    setSuccess('')
  }

  const toggleItem = (field, index) => {
    setConfig((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              isActive: !item.isActive
            }
          : item
      )
    }))

    setSuccess('')
  }

  const saveConfig = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = await apiPatch('/society-config', config)

      setConfig({
        towers: data.config?.towers || config.towers,
        floors: data.config?.floors || config.floors,
        commonAreas:
          data.config?.commonAreas || config.commonAreas
      })

      setSuccess(
        'Society configuration saved successfully.'
      )
    } catch (err) {
      setError(
        err.message || 'Failed to save society configuration'
      )
    } finally {
      setSaving(false)
    }
  }

  const renderSection = ({
    title,
    description,
    icon,
    field,
    value,
    setter,
    placeholder
  }) => {
    const items = config[field]

    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Icon name={icon} className="h-5 w-5" />
            </span>

            <div>
              <h2 className="font-bold text-slate-800">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
            {items.length}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={value}
            onChange={(event) =>
              setter(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addItem(field, value, setter)
              }
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />

          <button
            type="button"
            onClick={() =>
              addItem(field, value, setter)
            }
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            Add
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-400">
              No {title.toLowerCase()} configured yet.
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      item.isActive
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                    }`}
                  />

                  <span
                    className={`truncate text-sm font-semibold ${
                      item.isActive
                        ? 'text-slate-700'
                        : 'text-slate-400 line-through'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      toggleItem(field, index)
                    }
                    className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-white hover:text-slate-700"
                  >
                    {item.isActive
                      ? 'Disable'
                      : 'Enable'}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(field, index)
                    }
                    className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-700">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Society Configuration
            </h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Define the fixed structure of the society.
              These values will be used in issue reporting.
            </p>
          </div>

          <button
            type="button"
            onClick={saveConfig}
            disabled={saving || loading}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </header>

        {loading ? (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading society configuration...
          </div>
        ) : (
          <>
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}

            <div className="mt-7 grid gap-5 lg:grid-cols-3">
              {renderSection({
                title: 'Towers',
                description:
                  'Define the towers or blocks in the society.',
                icon: 'building',
                field: 'towers',
                value: newTower,
                setter: setNewTower,
                placeholder: 'e.g. Tower A'
              })}

              {renderSection({
                title: 'Floors',
                description:
                  'Define the floors available in the society.',
                icon: 'layers',
                field: 'floors',
                value: newFloor,
                setter: setNewFloor,
                placeholder: 'e.g. Ground or 1'
              })}

              {renderSection({
                title: 'Common Areas',
                description:
                  'Define shared areas where issues can occur.',
                icon: 'mapPin',
                field: 'commonAreas',
                value: newCommonArea,
                setter: setNewCommonArea,
                placeholder: 'e.g. Garden'
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-bold text-slate-700">
                How this works
              </p>

              <p className="mt-1">
                Add the society's towers, floors and common
                areas here. Residents will later select these
                values from controlled dropdowns when reporting
                an issue.
              </p>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default SocietyConfig