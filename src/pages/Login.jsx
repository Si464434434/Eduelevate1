import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import Card from '../components/Card'

export default function Login({ onLogin, mode = 'student' }) {
  const isAdminMode = mode === 'admin'
  const [email, setEmail] = useState(isAdminMode ? 'admin@test.com' : 'student@test.com')
  const [password, setPassword] = useState(isAdminMode ? 'admin123' : 'pass123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      if (isAdminMode && data.user.role !== 'admin') {
        throw new Error('Admin credentials required. Use Admin Login details.')
      }

      if (!isAdminMode && data.user.role === 'admin') {
        throw new Error('Use Admin Login page for admin account.')
      }

      onLogin(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/opportunities')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <h2 className="font-heading text-2xl font-semibold text-slate-900">{isAdminMode ? 'Admin Login' : 'Student Login'}</h2>
        <p className="mt-1 text-sm text-slate-600">{isAdminMode ? 'Login to access admin dashboard.' : 'Login to continue to your EduElevate dashboard.'}</p>

        <form onSubmit={handle} className="mt-5 grid gap-3">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            type="email"
            placeholder="you@example.com"
            required
          />

          <label className="mt-1 text-sm font-medium text-slate-700">Password</label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-12 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs font-medium text-brand hover:underline"
              onClick={() => alert('Demo mode: Please use test credentials to login.')}
            >
              Forgot password?
            </button>
          </div>

          {/* Demo Credentials Box */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">🔓 Demo credentials</p>
            <p>Student: student@test.com / pass123</p>
            <p>Admin: admin@test.com / admin123</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="rounded-md border px-2 py-1 hover:bg-white"
                onClick={() => {
                  setEmail('student@test.com')
                  setPassword('pass123')
                }}
                disabled={isAdminMode}
              >
                Use Student
              </button>
              <button
                type="button"
                className="rounded-md border px-2 py-1 hover:bg-white"
                onClick={() => {
                  setEmail('admin@test.com')
                  setPassword('admin123')
                }}
                disabled={!isAdminMode}
              >
                Use Admin
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-600">
            {isAdminMode ? (
              <span>Student? <Link to="/login" className="font-medium text-brand hover:underline">Go to Student Login</Link></span>
            ) : (
              <span>Admin? <Link to="/admin-login" className="font-medium text-brand hover:underline">Go to Admin Login</Link></span>
            )}
          </div>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            disabled={loading}
            className="mt-1 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </Card>
    </div>
  )
}
