import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import { apiDelete, apiGet, apiPost } from '../../api/api'

function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiGet('/categories')
      setCategories(data)
    } catch (err) {
      setError(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function add(event) {
    event.preventDefault()

    const trimmed = name.trim()

    if (!trimmed) return

    try {
      setError('')

      const newCategory = await apiPost('/categories', {
        name: trimmed
      })

      setCategories((current) => [
        ...current,
        newCategory
      ])

      setName('')
    } catch (err) {
      setError(err.message || 'Failed to add category')
    }
  }

  async function remove(categoryId) {
    const confirmed = window.confirm(
      'Delete this category?'
    )

    if (!confirmed) return

    try {
      setError('')

      await apiDelete(`/categories/${categoryId}`)

      setCategories((current) =>
        current.filter(
          (category) => category._id !== categoryId
        )
      )
    } catch (err) {
      setError(
        err.message || 'Failed to delete category'
      )
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          Manage Categories
        </h1>

        <p className="mt-2 text-slate-600">
          Manage issue categories used by residents.
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form
          onSubmit={add}
          className="mt-6 flex gap-3 rounded-xl border bg-white p-4"
        >
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="min-w-0 flex-1 rounded-lg border p-2 text-sm"
            placeholder="New category name"
            disabled={loading}
          />

          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800"
          >
            Add
          </button>
        </form>

        <div className="mt-5 rounded-xl border bg-white p-4">
          {loading ? (
            <p className="p-6 text-center text-slate-500">
              Loading categories...
            </p>
          ) : categories.length ? (
            categories.map((category) => (
              <div
                className="flex items-center justify-between border-b py-3 last:border-0"
                key={category._id}
              >
                <div>
                  <span className="font-semibold text-slate-700">
                    {category.name}
                  </span>

                  {category.description && (
                    <p className="text-xs text-slate-500">
                      {category.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    remove(category._id)
                  }
                  className="text-sm font-bold text-red-700 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-slate-500">
              No categories available.
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default ManageCategories