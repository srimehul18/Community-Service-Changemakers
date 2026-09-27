import { useEffect, useState } from 'react'
import AppLayout from '../../components/AppLayout'
import SelectMenu from '../../components/SelectMenu'
import { apiDelete, apiGet, apiPatch, apiPost } from '../../api/api'

function ManageUsers() {
  const [users, setUsers] = useState([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('123456')
  const [role, setRole] = useState('resident')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const roleOptions = [
    { value: 'resident', label: 'Resident' },
    { value: 'staff', label: 'Staff' }
  ]

  const userRoleOptions = [
    { value: 'resident', label: 'Resident' },
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Admin' }
  ]

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiGet('/users')
      setUsers(data)
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  async function add(event) {
    event.preventDefault()

    if (!name.trim() || !email.trim() || !password) {
      setError(
        'Name, email and password are required.'
      )
      return
    }

    try {
      setSaving(true)
      setError('')

      const newUser = await apiPost('/users', {
        name: name.trim(),
        email: email.trim(),
        password,
        role
      })

      setUsers((current) => [
        ...current,
        newUser
      ])

      setName('')
      setEmail('')
      setPassword('123456')
      setRole('resident')
    } catch (err) {
      setError(err.message || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  async function update(id, newRole) {
    try {
      setError('')

      const updatedUser = await apiPatch(
        `/users/${id}`,
        { role: newRole }
      )

      setUsers((current) =>
        current.map((user) =>
          user._id === id
            ? updatedUser
            : user
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to update user')
    }
  }

  async function remove(id) {
    const confirmed = window.confirm(
      'Delete this user?'
    )

    if (!confirmed) return

    try {
      setError('')

      await apiDelete(`/users/${id}`)

      setUsers((current) =>
        current.filter(
          (user) => user._id !== id
        )
      )
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>

        <p className="mt-2 text-slate-600">
          Create and manage society users and roles.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={add}
          className="mt-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-5"
        >
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Full name"
            disabled={saving}
          />

          <input
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Email"
            type="email"
            disabled={saving}
          />

          <input
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Password"
            type="password"
            disabled={saving}
          />

          <SelectMenu
            value={role}
            onChange={setRole}
            options={roleOptions}
            className="w-full"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-700 p-2 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {saving ? 'Adding...' : 'Add User'}
          </button>
        </form>

        <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Loading users...
            </p>
          ) : (
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    className="border-t"
                    key={user._id}
                  >
                    <td className="p-3 font-semibold">
                      {user.name}
                    </td>

                    <td className="p-3 text-slate-600">
                      {user.email}
                    </td>

                    <td className="p-3">
                      <SelectMenu
                        value={user.role}
                        onChange={(value) =>
                          update(
                            user._id,
                            value
                          )
                        }
                        options={userRoleOptions}
                        className="w-32"
                      />
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          remove(user._id)
                        }
                        className="text-sm font-bold text-red-700 transition hover:text-red-800 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default ManageUsers