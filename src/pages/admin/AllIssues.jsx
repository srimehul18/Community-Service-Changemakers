import { useState } from 'react'
import AppLayout from '../../components/AppLayout'
import PriorityBadge from '../../components/PriorityBadge'
import StatusBadge from '../../components/StatusBadge'
import { getIssues, getUsers, saveIssues } from '../../data/demoStore'
import { useDemoData } from '../../context/useDemoData'
import SelectMenu from '../../components/SelectMenu'

function AllIssues() {
  const issues = useDemoData('issues')
  const users = useDemoData('users')
  const cats = useDemoData('categories')

  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')

  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
  ]

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...cats.map(category => ({
      value: category,
      label: category,
    })),
  ]

  const priorityOptions = [
    { value: '', label: 'All priorities' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ]

  const staffOptions = [
    { value: '', label: 'Unassigned' },
    ...users
      .filter(user => user.role === 'staff')
      .map(user => ({
        value: user.id,
        label: user.name,
      })),
  ]

  const shown = issues.filter(
    x =>
      x.title.toLowerCase().includes(q.toLowerCase()) &&
      (!status || x.status === status) &&
      (!category || x.category === category) &&
      (!priority || x.priority === priority)
  )

  function change(id, key, value) {
    const staff =
      key === 'assignedTo'
        ? getUsers().find(x => x.id === value)
        : null

    saveIssues(
      getIssues().map(x =>
        x.id === id
          ? {
              ...x,
              [key]: value,
              ...(staff ? { assignedName: staff.name } : {}),
            }
          : x
      )
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">All Issues</h1>

        {/* Filters */}
        <div className="mt-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Search"
            value={q}
            onChange={e => setQ(e.target.value)}
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

        {/* Issues table */}
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
                  'Edit',
                ].map(x => (
                  <th key={x} className="p-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {shown.map(x => (
                <tr key={x.id} className="border-t">
                  <td className="p-3">
                    <strong>{x.title}</strong>
                    <br />
                    <span className="text-slate-500">
                      {x.category} · {x.date}
                    </span>
                  </td>

                  <td className="p-3">
                    {x.reporter}
                    <br />
                    <span className="text-slate-500">
                      {x.location}
                    </span>
                  </td>

                  <td className="p-3">
                    <StatusBadge status={x.status} />
                  </td>

                  <td className="p-3">
                    <PriorityBadge priority={x.priority} />
                  </td>

                  {/* Assign Staff */}
                  <td className="p-3">
                    <SelectMenu
                      value={x.assignedTo}
                      onChange={value =>
                        change(
                          x.id,
                          'assignedTo',
                          value
                        )
                      }
                      options={staffOptions}
                      className="w-40"
                    />
                  </td>

                  {/* Edit Category + Priority */}
                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <SelectMenu
                        value={x.category}
                        onChange={value =>
                          change(
                            x.id,
                            'category',
                            value
                          )
                        }
                        options={cats.map(category => ({
                          value: category,
                          label: category,
                        }))}
                        className="w-36"
                      />

                      <SelectMenu
                        value={x.priority}
                        onChange={value =>
                          change(
                            x.id,
                            'priority',
                            value
                          )
                        }
                        options={[
                          {
                            value: 'Low',
                            label: 'Low',
                          },
                          {
                            value: 'Medium',
                            label: 'Medium',
                          },
                          {
                            value: 'High',
                            label: 'High',
                          },
                          {
                            value: 'Critical',
                            label: 'Critical',
                          },
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

        {!shown.length && (
          <p className="mt-5 text-slate-500">
            No issues match your filters.
          </p>
        )}
      </div>
    </AppLayout>
  )
}

export default AllIssues