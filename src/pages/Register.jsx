import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import Card from '../components/Card'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ok, setOk] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setOk('')
    setLoading(true)
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      })
      setOk('✓ Registered successfully! Redirecting to login...')
      setName('')
      setEmail('')
      setPassword('')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setOk('❌ ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h2 className="font-heading text-2xl font-semibold text-slate-900">Create Account</h2>
        <p className="mt-1 text-sm text-slate-600">Join EduElevate and start your career journey</p>
        <form onSubmit={handle} className="mt-6 grid gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" type="email" required />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" type="password" required />
          </div>

          {ok && (
            <div className={`rounded-lg px-4 py-3 text-sm font-medium ${ok.includes('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {ok}
            </div>
          )}

          <button disabled={loading} className="mt-2 rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:opacity-95 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
