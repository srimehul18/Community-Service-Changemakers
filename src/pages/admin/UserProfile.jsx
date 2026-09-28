import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppLayout from '../../components/AppLayout'
import { apiGet } from '../../api/api'

function UserProfile() {
  const { id } = useParams()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await apiGet(`/users/${id}`)
        setProfile(data)
      } catch (err) {
        setError(err.message || 'Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  const displayValue = (value) => {
    return value !== undefined &&
      value !== null &&
      value !== ''
      ? value
      : 'Not provided'
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-sm font-semibold text-slate-500">
            Loading user profile...
          </p>
        </div>
      </AppLayout>
    )
  }

  if (error || !profile) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl">
          <Link
            to="/admin/users"
            className="text-sm font-bold text-emerald-700 hover:underline"
          >
            ← Back to Users
          </Link>

          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error || 'User not found'}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        <div className="mb-5">
          <Link
            to="/admin/users"
            className="text-sm font-bold text-emerald-700 hover:underline"
          >
            ← Back to Users
          </Link>
        </div>

        <header className="mb-7">
          <p className="text-sm font-bold text-emerald-700">
            User Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            User Profile
          </h1>

          <p className="mt-2 text-slate-600">
            View account and activity information.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Profile header */}
          <div className="border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 px-6 py-7 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700 text-2xl font-bold text-white shadow-sm">
                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {profile.email}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold capitalize text-emerald-800">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Personal Information */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Personal Information
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ProfileValue
                  label="Name"
                  value={displayValue(profile.name)}
                />

                <ProfileValue
                  label="Email"
                  value={displayValue(profile.email)}
                />

                <ProfileValue
                  label="Age"
                  value={displayValue(profile.age)}
                />

                <ProfileValue
                  label="Phone"
                  value={displayValue(profile.phone)}
                />
              </div>
            </section>

            {/* Residence */}
            <section className="mt-9 border-t border-slate-100 pt-8">
              <h3 className="text-lg font-bold text-slate-900">
                Residence Information
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <ProfileValue
                  label="Tower"
                  value={displayValue(profile.tower)}
                />

                <ProfileValue
                  label="Flat Number"
                  value={displayValue(profile.flat)}
                />

                <ProfileValue
                  label="People in Household"
                  value={
                    profile.householdMembers
                      ? `${profile.householdMembers} ${
                          profile.householdMembers === 1
                            ? 'person'
                            : 'people'
                        }`
                      : 'Not provided'
                  }
                />
              </div>
            </section>

            {/* Activity */}
            <section className="mt-9 border-t border-slate-100 pt-8">
              <h3 className="text-lg font-bold text-slate-900">
                Activity
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-5">
                  <p className="text-sm font-medium text-emerald-700">
                    Issues Reported
                  </p>

                  <p className="mt-2 text-3xl font-bold text-emerald-900">
                    {profile.issuesReported ?? 0}
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Total issues submitted
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Member Since
                  </p>

                  <p className="mt-2 text-xl font-bold text-slate-800">
                    {profile.createdAt
                      ? new Date(
                          profile.createdAt
                        ).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      : '—'}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Account creation date
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function ProfileValue({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  )
}

export default UserProfile