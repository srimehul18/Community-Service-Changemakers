import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { apiGet, apiPatch } from '../api/api'

const inputClassName =
  'min-h-11 w-full rounded-lg border border-emerald-100 bg-white px-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiGet('/users/me')

        setProfile(data)

        setFormData({
          name: data.name || '',
          age: data.age || '',
          phone: data.phone || '',
          tower: data.tower || '',
          flat: data.flat || '',
          householdMembers: data.householdMembers || ''
        })
      } catch (error) {
        setMessage(error.message)
        setIsError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()

    setSaving(true)
    setMessage('')
    setIsError(false)

    try {
      const data = await apiPatch('/users/me', {
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined,
        phone: formData.phone,
        tower: formData.tower,
        flat: formData.flat,
        householdMembers: formData.householdMembers
          ? Number(formData.householdMembers)
          : undefined
      })

      setProfile(data.user)

      setFormData({
        name: data.user.name || '',
        age: data.user.age || '',
        phone: data.user.phone || '',
        tower: data.user.tower || '',
        flat: data.user.flat || '',
        householdMembers: data.user.householdMembers || ''
      })

      setIsEditing(false)
      setMessage('Profile updated successfully')
    } catch (error) {
      setMessage(error.message)
      setIsError(true)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      age: profile.age || '',
      phone: profile.phone || '',
      tower: profile.tower || '',
      flat: profile.flat || '',
      householdMembers: profile.householdMembers || ''
    })

    setIsEditing(false)
    setMessage('')
    setIsError(false)
  }

  const displayValue = (value) => {
    return value !== undefined && value !== null && value !== ''
      ? value
      : 'Not provided'
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-80 items-center justify-center">
          <p className="text-sm font-semibold text-slate-500">
            Loading profile...
          </p>
        </div>
      </AppLayout>
    )
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {message || 'Unable to load profile'}
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <header className="mb-7">
          <p className="text-sm font-bold text-emerald-700">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage your personal information.
          </p>
        </header>

        {message && (
          <div
            className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
              isError
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Profile header */}
          <div className="border-b border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
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

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true)
                    setMessage('')
                  }}
                  className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Personal information */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Personal Information
              </h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {isEditing ? (
                  <>
                    <ProfileInput
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <ProfileReadOnly
                      label="Email"
                      value={profile.email}
                    />

                    <ProfileInput
                      label="Age"
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <ProfileValue
                      label="Name"
                      value={profile.name}
                    />

                    <ProfileValue
                      label="Email"
                      value={profile.email}
                    />

                    <ProfileValue
                      label="Age"
                      value={displayValue(profile.age)}
                    />

                    <ProfileValue
                      label="Phone"
                      value={displayValue(profile.phone)}
                    />
                  </>
                )}
              </div>
            </section>

            {/* Residence */}
            <section className="mt-9 border-t border-slate-100 pt-8">
              <h3 className="text-lg font-bold text-slate-900">
                Residence Information
              </h3>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {isEditing ? (
                  <>
                    <ProfileInput
                      label="Tower"
                      name="tower"
                      placeholder="e.g. Tower A"
                      value={formData.tower}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Flat Number"
                      name="flat"
                      placeholder="e.g. A-204"
                      value={formData.flat}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="People in Household"
                      name="householdMembers"
                      type="number"
                      min="1"
                      placeholder="e.g. 4"
                      value={formData.householdMembers}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
        </form>
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

function ProfileReadOnly({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        disabled
        className={`${inputClassName} bg-slate-50`}
      />
    </div>
  )
}

function ProfileInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  required = false
}) {
  return (
    <div>
      <label
        htmlFor={`profile-${name}`}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <input
        id={`profile-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        required={required}
        className={inputClassName}
      />
    </div>
  )
}

export default Profile