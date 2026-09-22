import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, saveUsers } from '../data/demoStore'

const inputClassName = 'min-h-12 rounded-lg border border-emerald-100 bg-white px-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100'

function Register() {
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    if (form.get('password') !== form.get('confirmPassword')) {
      setIsError(true)
      setMessage('Passwords do not match. Please try again.')
      return
    }

    if (getUsers().some((user) => user.email.toLowerCase() === form.get('email').toLowerCase())) {
      setIsError(true)
      setMessage('An account with this email already exists.')
      return
    }

    saveUsers([...getUsers(), { id: `u-${Date.now()}`, name: form.get('fullName'), email: form.get('email'), password: form.get('password'), role: form.get('role') }])
    setIsError(false)
    setMessage('Demo account created. You can now sign in with your email and password.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:gap-14">
        <section className="px-1 py-4 sm:px-5 lg:py-10">
          <Link className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-emerald-900" to="/login">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-xl text-white shadow-sm">C</span>
            ChangeMakers
          </Link>
          <h1 className="mt-8 max-w-xl text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">Join your community in making change.</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">Create an account to report issues, stay informed, and help make your society a better place to live.</p>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/10 sm:p-8" aria-labelledby="register-title">
          <h2 id="register-title" className="text-2xl font-bold tracking-tight text-slate-800">Create account</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Get started with ChangeMakers.</p>
          <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2"><label className="text-sm font-semibold text-slate-700" htmlFor="full-name">Full Name</label><input className={inputClassName} id="full-name" name="fullName" type="text" placeholder="Your full name" required /></div>
            <div className="grid gap-2"><label className="text-sm font-semibold text-slate-700" htmlFor="register-email">Email</label><input className={inputClassName} id="register-email" name="email" type="email" placeholder="you@example.com" required /></div>
            <div className="grid gap-2"><label className="text-sm font-semibold text-slate-700" htmlFor="register-password">Password</label><input className={inputClassName} id="register-password" name="password" type="password" placeholder="Create a password" required /></div>
            <div className="grid gap-2"><label className="text-sm font-semibold text-slate-700" htmlFor="confirm-password">Confirm Password</label><input className={inputClassName} id="confirm-password" name="confirmPassword" type="password" placeholder="Confirm your password" required /></div>
            <div className="grid gap-2"><label className="text-sm font-semibold text-slate-700" htmlFor="role">Role</label><select className={inputClassName} id="role" name="role" defaultValue="" required><option value="" disabled>Select your role</option><option value="resident">Resident</option><option value="staff">Staff</option></select></div>
            <button className="mt-1 min-h-12 rounded-lg bg-emerald-700 px-4 font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-200" type="submit">Register</button>
          </form>
          {message && <p className={`mt-5 rounded-lg border px-3 py-2.5 text-sm leading-5 ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`} role="status">{message}</p>}
          <p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline" to="/login">Back to Login</Link></p>
        </section>
      </div>
    </main>
  )
}

export default Register
