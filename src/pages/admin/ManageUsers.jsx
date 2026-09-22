import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import SelectMenu from '../../components/SelectMenu'
import { getUsers, saveUsers } from '../../data/demoStore'
import { useDemoData } from '../../context/useDemoData'

function ManageUsers() {
  const users = useDemoData('users')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('resident')

  const roleOptions = [
    { value: 'resident', label: 'Resident' },
    { value: 'staff', label: 'Staff' },
  ]

  const userRoleOptions = [
    { value: 'resident', label: 'Resident' },
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Admin' },
  ]

  function add(e) {
    e.preventDefault()

    if (!name.trim() || !email.trim()) return

    saveUsers([
      ...getUsers(),
      {
        id: `u-${Date.now()}`,
        name,
        email,
        password: '123456',
        role,
      },
    ])

    setName('')
    setEmail('')
    setRole('resident')
  }

  function update(id, role) {
    saveUsers(
      getUsers().map(x =>
        x.id === id
          ? {
              ...x,
              role,
            }
          : x
      )
    )
  }

  function remove(id) {
    if (window.confirm('Delete this demo user?')) {
      saveUsers(
        getUsers().filter(x => x.id !== id)
      )
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          Manage Users
        </h1>

        {/* Add User */}
        <form
          onSubmit={add}
          className="mt-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-4"
        >
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Full name"
          />

          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Email"
            type="email"
          />

          <SelectMenu
            value={role}
            onChange={setRole}
            options={roleOptions}
            className="w-full"
          />

          <button
            type="submit"
            className="rounded-lg bg-emerald-700 p-2 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
          >
            Add Demo User
          </button>
        </form>

        {/* Users Table */}
        <div className="mt-5 overflow-x-auto rounded-xl border bg-white">
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
              {users.map(x => (
                <tr
                  className="border-t"
                  key={x.id}
                >
                  <td className="p-3 font-semibold">
                    {x.name}
                  </td>

                  <td className="p-3 text-slate-600">
                    {x.email}
                  </td>

                  <td className="p-3">
                    <SelectMenu
                      value={x.role}
                      onChange={value =>
                        update(x.id, value)
                      }
                      options={userRoleOptions}
                      className="w-32"
                    />
                  </td>

                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => remove(x.id)}
                      className="text-sm font-bold text-red-700 transition hover:text-red-800 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}

export default ManageUsers