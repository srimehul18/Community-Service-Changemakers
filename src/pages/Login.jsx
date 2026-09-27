import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClassName = 'min-h-12 rounded-lg border border-emerald-100 bg-white px-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-100'

function Login() {
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  async function handleSubmit(event) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)

    const result = await login(
      form.get('email'),
      form.get('password')
    )

    setIsError(!result.success)

    if (result.success) {
      navigate(`/${result.user.role}/dashboard`)
    } else {
      setMessage(result.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-teal-50 px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:gap-14">
        <section className="px-1 py-4 sm:px-5 lg:py-10">
          <Link className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-emerald-900" to="/login">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-xl text-white shadow-sm">C</span>
            MyCoral
          </Link>
          <h1 className="mt-8 max-w-xl text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">Welcome to MyCoral</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">A Society Issue Management Platform that helps residents, staff, and administrators keep the community running smoothly.</p>
        </section>

        <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/10 sm:p-8" aria-labelledby="login-title">
          <h2 id="login-title" className="text-2xl font-bold tracking-tight text-slate-800">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Enter your details to access your workspace.</p>
          <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="login-email">Email</label>
              <input className={inputClassName} id="login-email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="login-password">Password</label>
              <input className={inputClassName} id="login-password" name="password" type="password" placeholder="Enter your password" required />
            </div>
            <button className="mt-1 min-h-12 rounded-lg bg-emerald-700 px-4 font-bold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-3 focus:ring-emerald-200" type="submit">Login</button>
          </form>
          {message && <p className={`mt-5 rounded-lg border px-3 py-2.5 text-sm leading-5 ${isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`} role="status">{message}</p>}
          <p className="mt-6 text-center text-sm text-slate-500">New to MyCoral? <Link className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline" to="/register">Create an account</Link></p>
          
        </section>
      </div>
    </main>
  )
}

export default Login
