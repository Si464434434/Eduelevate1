import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'

const RAW_API_URL = import.meta.env.VITE_API_URL || '/api'
const API_URL = RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL.replace(/\/+$/, '')}/api`
const API_BASE = API_URL

const seedHostels = [
  { id: 1, name: 'Skyline Boys Hostel', gender: 'Boys', fee: 4500, area: 'Sector 18' },
  { id: 2, name: 'Serene Girls Residency', gender: 'Girls', fee: 5200, area: 'City Center' },
  { id: 3, name: 'Metro Co-Living', gender: 'Unisex', fee: 8000, area: 'IT Park' },
  { id: 4, name: 'Budget Stay Boys', gender: 'Boys', fee: 3500, area: 'Near Station' },
  { id: 5, name: 'Lotus Girls Hostel', gender: 'Girls', fee: 6000, area: 'University Road' },
  { id: 6, name: 'Study Nest Residency', gender: 'Unisex', fee: 7000, area: 'Library Circle' }
]

const seedMentors = [
  { id: 1, name: 'Aditi Sharma', company: 'Google', domain: 'Web Development' },
  { id: 2, name: 'Rohan Verma', company: 'Microsoft', domain: 'Cloud' },
  { id: 3, name: 'Nisha Rao', company: 'Amazon', domain: 'Data Science' },
  { id: 4, name: 'Karan Mehta', company: 'Adobe', domain: 'Product Design' },
  { id: 5, name: 'Priya Iyer', company: 'Meta', domain: 'Mobile Development' },
  { id: 6, name: 'Arjun Singh', company: 'NVIDIA', domain: 'AI/ML' }
]

const seedEvents = [
  { id: 'ev1', title: 'Resume Review Bootcamp', date: '2026-03-18', mode: 'Online' },
  { id: 'ev2', title: 'Hackathon Prep Session', date: '2026-03-25', mode: 'Offline' },
  { id: 'ev3', title: 'Scholarship Q&A Live', date: '2026-04-02', mode: 'Online' },
  { id: 'ev4', title: 'Placement Interview Simulation', date: '2026-04-10', mode: 'Hybrid' }
]

const navItems = [
  ['/', 'Home'],
  ['/opportunities', 'Opportunities'],
  ['/resume-builder', 'Resume Builder'],
  ['/tracker', 'Tracker'],
  ['/hostel-finder', 'Hostels'],
  ['/mentors', 'Mentors'],
  ['/study-materials', 'Materials'],
  ['/events', 'Events'],
  ['/admin', 'Admin']
]

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data.message || message
    } catch {
      message = await res.text()
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

function Layout({ children, user, onLogout, apiDown, apiChecking, apiErrorMessage, apiBannerDismissed, onRetryApi, onDismissApiBanner }) {
  const [open, setOpen] = useState(false)
  const visibleNavItems = user?.role === 'admin' ? navItems : navItems.filter(([to]) => to !== '/admin')
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="group inline-flex items-center text-xl font-bold tracking-tight transition duration-200 hover:scale-[1.02]">
            <span className="font-heading text-[#0E57C4]">Edu</span>
            <span className="font-heading bg-gradient-to-r from-[#FF8A00] to-[#F25F00] bg-clip-text text-transparent">Elevate</span>
            <span className="ml-2 h-1.5 w-1.5 rounded-full bg-accent opacity-70 transition duration-200 group-hover:opacity-100" />
          </Link>
          <button className="rounded-lg border border-slate-300 px-3 py-1.5 md:hidden" onClick={() => setOpen((s) => !s)}>☰</button>
          <nav className="hidden items-center gap-1 md:flex">
            {visibleNavItems.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-md px-3 py-1.5 text-sm transition duration-200 hover:-translate-y-0.5 ${isActive ? 'bg-brand/10 font-semibold text-brand' : 'text-slate-600 hover:bg-slate-100 hover:text-brand'}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <span className="text-sm text-slate-600">{user.name}</span>
                <button onClick={onLogout} className="rounded-lg bg-brand px-3.5 py-1.5 text-sm text-white transition duration-200 hover:opacity-95 active:scale-[0.98]">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50">Student Login</Link>
                <Link to="/admin-login" className="rounded-lg border border-brand px-3.5 py-1.5 text-sm text-brand transition duration-200 hover:-translate-y-0.5 hover:bg-brand/5">Admin Login</Link>
                <Link to="/register" className="rounded-lg bg-brand px-3.5 py-1.5 text-sm text-white transition duration-200 hover:opacity-95 active:scale-[0.98]">Register</Link>
              </>
            )}
          </div>
        </div>
        {open && (
          <div className="space-y-2 border-t px-4 py-3 md:hidden">
            {visibleNavItems.map(([to, label]) => (
              <NavLink key={to} onClick={() => setOpen(false)} to={to} className="block text-sm text-slate-700">{label}</NavLink>
            ))}
          </div>
        )}
        {apiDown && !apiBannerDismissed && (
          <div className="border-t border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">API offline:</span>
                <span>Backend not reachable on {RAW_API_URL}.</span>
                {apiErrorMessage && <span className="hidden text-amber-800/90 md:inline">({apiErrorMessage})</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded border border-amber-500 px-3 py-1 text-xs font-semibold text-amber-900 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={onRetryApi}
                  disabled={apiChecking}
                >
                  {apiChecking ? 'Checking...' : 'Retry now'}
                </button>
                <button
                  className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100"
                  onClick={onDismissApiBanner}
                  aria-label="Dismiss API warning"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}

function AdminOnlyRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/opportunities" replace />
  return children
}

function Card({ children }) {
  return <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>
}

function Landing() {
  const categories = {
    Trending: [
      { id: 't1', title: 'AI Career Sprint', tag: 'Live Cohort', meta: '12k learners' },
      { id: 't2', title: 'React Master Path', tag: 'Top Rated', meta: '8 weeks' },
      { id: 't3', title: 'Interview Pro Pack', tag: 'New', meta: '250+ questions' },
      { id: 't4', title: 'Hackathon Vault', tag: 'Popular', meta: '50 challenge sets' }
    ],
    Internships: [
      { id: 'i1', title: 'Frontend Intern', tag: 'Remote', meta: '₹15,000/month' },
      { id: 'i2', title: 'Backend Intern', tag: 'Hybrid', meta: '₹18,000/month' },
      { id: 'i3', title: 'Product Intern', tag: 'Onsite', meta: '₹20,000/month' },
      { id: 'i4', title: 'Data Analyst Intern', tag: 'Remote', meta: '₹22,000/month' }
    ],
    Scholarships: [
      { id: 's1', title: 'Women in STEM', tag: 'Grant', meta: '₹75,000' },
      { id: 's2', title: 'AI Scholar 2026', tag: 'Merit', meta: '₹1,00,000' },
      { id: 's3', title: 'Rural Talent Fund', tag: 'Need-based', meta: '₹60,000' },
      { id: 's4', title: 'Research Catalyst', tag: 'Academic', meta: '₹90,000' }
    ]
  }

  const faq = [
    { q: 'EduElevate kya hai?', a: 'Ye student platform hai jahan internships, scholarships, hackathons, tracker, aur resume tools ek jagah milte hain.' },
    { q: 'Kya backend zaroori hai?', a: 'Demo localStorage mode bhi run karta hai, lekin full API mode ke liye backend server on hona chahiye.' },
    { q: 'Admin aur student login alag hai?', a: 'Haan, ab separate Student Login aur Admin Login flow available hai.' },
    { q: 'Is app mobile responsive hai?', a: 'Haan, homepage aur major pages responsive layout follow karte hain.' }
  ]

  const [activeCategory, setActiveCategory] = useState('Trending')
  const [openFaq, setOpenFaq] = useState(0)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimateIn(true), 60)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8">
      <section className={`relative overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_15%_20%,rgba(75,0,130,0.35),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(0,191,255,0.25),transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_65%,#111827_100%)] p-8 text-white transition-all duration-700 md:p-12 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">EduElevate Premium</p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight md:text-6xl">Build Your Career Like a Pro</h1>
            <p className="mt-4 max-w-2xl text-slate-200">Internships, scholarships, hackathons, resume builder, and smart tracking—everything in one modern student hub.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/opportunities" className="group relative overflow-hidden rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand/30 transition duration-200 hover:opacity-95 active:scale-[0.98]">
                <span className="relative z-10">Start Exploring</span>
                <span className="pointer-events-none absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/25 blur-sm transition-all duration-500 group-hover:left-[110%]" />
              </Link>
              <Link to="/tracker" className="group relative overflow-hidden rounded-lg border border-slate-500 bg-slate-900/50 px-5 py-2.5 font-semibold text-slate-100 transition duration-200 hover:bg-slate-800 active:scale-[0.98]">
                <span className="relative z-10">Go to Tracker</span>
                <span className="pointer-events-none absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/20 blur-sm transition-all duration-500 group-hover:left-[110%]" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['1200+', 'Active Opportunities'],
              ['35k+', 'Student Community'],
              ['93%', 'Interview Success Prep'],
              ['24/7', 'Anytime Access']
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-slate-700/80 bg-slate-900/60 p-4 backdrop-blur">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`transition-all duration-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '120ms' }}>
        <h2 className="mb-3 font-heading text-2xl font-semibold">Why students choose EduElevate</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Opportunity Feed', 'Curated internships, scholarships, and hackathons in one timeline.'],
            ['Resume Studio', 'Build ATS-friendly resume with guided sections and live preview.'],
            ['Application Tracker', 'Track status from applied to offer with a clean dashboard.'],
            ['Mentor + Resources', 'Get mentor help and study resources for faster growth.']
          ].map(([title, desc]) => (
            <div key={title} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-slate-100 shadow-lg shadow-slate-900/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
              <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_top,rgba(0,191,255,0.18),transparent_55%)] opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />
              <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`transition-all duration-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '220ms' }}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {Object.keys(categories).map((name) => (
            <button
              key={name}
              onClick={() => setActiveCategory(name)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${activeCategory === name ? 'bg-brand text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories[activeCategory].map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4 text-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(circle_at_top,rgba(75,0,130,0.34),transparent_55%)] opacity-0 blur-xl transition duration-300 group-hover:opacity-100" />
              <div className="mb-3 inline-block rounded bg-brand/80 px-2 py-1 text-xs font-semibold">{item.tag}</div>
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-300">{item.meta}</p>
              <div className="mt-4">
                <Link to="/opportunities" className="text-sm font-semibold text-accent group-hover:underline">View details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`transition-all duration-700 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '320ms' }}>
        <h2 className="mb-3 font-heading text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faq.map((item, idx) => (
            <div key={item.q} className="overflow-hidden rounded-xl border bg-white">
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-slate-50"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                <span>{item.q}</span>
                <span className={`text-xl transition-transform duration-300 ${openFaq === idx ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`grid transition-all duration-300 ${openFaq === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className="border-t px-4 py-3 text-sm text-slate-600">{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Login({ onLogin, mode = 'student' }) {
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

      onLogin(data.user)
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
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l18 18" />
                  <path d="M10.58 10.58a2 2 0 102.83 2.83" />
                  <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 01-3.07 4.36" />
                  <path d="M6.61 6.61A11.8 11.8 0 001 12.5C2.73 16.89 7 20 12 20c1.73 0 3.36-.37 4.83-1.03" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12.5C2.73 8.11 7 5 12 5s9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5z" />
                  <circle cx="12" cy="12.5" r="3" />
                </svg>
              )}
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

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Demo credentials</p>
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

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ok, setOk] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setOk('')
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      })
      setOk('Registered successfully. Now login.')
      setName('')
      setEmail('')
      setPassword('')
    } catch (err) {
      setOk(err.message)
    }
  }

  return (
    <Card>
      <h2 className="font-heading text-2xl font-semibold">Register</h2>
      <form onSubmit={handle} className="mt-4 grid gap-3 max-w-md">
        <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="rounded border px-3 py-2" required />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded border px-3 py-2" type="email" required />
        <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded border px-3 py-2" type="password" required />
        {ok && <p className="text-sm text-emerald-700">{ok}</p>}
        <button className="rounded bg-brand px-4 py-2 text-white">Create Account</button>
      </form>
    </Card>
  )
}

function Opportunities({ opportunities, bookmarks, toggleBookmark }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const filtered = opportunities.filter((item) => {
    const hit = `${item.title} ${item.org} ${item.description}`.toLowerCase().includes(search.toLowerCase())
    const typeHit = type === 'All' || item.type === type
    return hit && typeHit
  })

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="rounded border px-3 py-2" placeholder="Search by keyword" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="rounded border px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            <option>Internship</option>
            <option>Scholarship</option>
            <option>Hackathon</option>
          </select>
          <div className="text-sm text-slate-600 self-center">{filtered.length} results</div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <Card key={item.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.org} • {item.type}</p>
              </div>
              <button onClick={() => toggleBookmark(item.id)} className="text-sm">{bookmarks.includes(item.id) ? '🔖' : '📑'}</button>
            </div>
            <p className="mt-2 text-sm text-slate-700">{item.description}</p>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span>Deadline: {item.deadline}</span>
              <Link className="text-brand font-semibold" to={`/opportunity/${item.id}`}>View Details</Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function OpportunityDetail({ opportunities, bookmarks, toggleBookmark, addApplication, user }) {
  const { id } = useParams()
  const item = opportunities.find((x) => x.id === id)
  if (!item) return <Navigate to="/opportunities" replace />
  const isBookmarked = bookmarks.includes(item.id)

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-2xl font-semibold">{item.title}</h2>
        <button onClick={() => toggleBookmark(item.id)} className="rounded border px-3 py-1 text-sm">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</button>
      </div>
      <p className="mt-1 text-slate-600">{item.org} • {item.type} • {item.location}</p>
      <p className="mt-4">{item.description}</p>
      <div className="mt-4 rounded bg-slate-50 p-3 text-sm">
        <p><strong>Deadline:</strong> {item.deadline}</p>
        <p><strong>Stipend / Reward:</strong> {item.stipend}</p>
      </div>
      <button
        className="mt-4 rounded bg-brand px-4 py-2 text-white"
        onClick={async () => {
          if (!user) {
            alert('Please login first.')
            return
          }
          try {
            await addApplication({ title: item.title, org: item.org })
            alert('Application added to tracker!')
          } catch (err) {
            alert(err.message)
          }
        }}
      >
        Apply Now
      </button>
    </Card>
  )
}

function ResumeBuilder({ user }) {
  const [resume, setResume] = useState({ name: '', email: '', phone: '', summary: '', skills: '', education: '', projects: '' })

  useEffect(() => {
    if (!user?.email) return
    api(`/resume?email=${encodeURIComponent(user.email)}`).then((data) => {
      setResume({ ...data, email: data.email || user.email })
    }).catch(() => {
      setResume((r) => ({ ...r, email: user.email }))
    })
  }, [user])

  const change = (k, v) => setResume((r) => ({ ...r, [k]: v }))

  const saveResume = async () => {
    if (!user?.email) {
      alert('Please login to save resume.')
      return
    }
    await api('/resume', {
      method: 'POST',
      body: JSON.stringify({ ...resume, email: user.email })
    })
    alert('Resume saved to backend.')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="font-heading text-2xl font-semibold">Resume Builder</h2>
        {!user && <p className="mt-2 text-sm text-amber-700">Login required for saving resume.</p>}
        <div className="mt-4 grid gap-2">
          {[
            ['name', 'Full Name'],
            ['email', 'Email'],
            ['phone', 'Phone']
          ].map(([key, label]) => (
            <input key={key} placeholder={label} value={resume[key]} onChange={(e) => change(key, e.target.value)} className="rounded border px-3 py-2" />
          ))}
          {[
            ['summary', 'Professional Summary'],
            ['skills', 'Skills (comma separated)'],
            ['education', 'Education'],
            ['projects', 'Projects']
          ].map(([key, label]) => (
            <textarea key={key} placeholder={label} value={resume[key]} onChange={(e) => change(key, e.target.value)} className="rounded border px-3 py-2" rows={3} />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded bg-brand px-4 py-2 text-white" onClick={saveResume}>Save Resume</button>
          <button className="rounded border px-4 py-2" onClick={() => alert('PDF download is a demo stub in this version.')}>Download PDF (Demo)</button>
        </div>
      </Card>
      <Card>
        <h3 className="font-heading text-xl font-semibold">Live Preview</h3>
        <div className="mt-4 space-y-2 text-sm">
          <h4 className="font-heading text-lg font-semibold">{resume.name || 'Your Name'}</h4>
          <p>{resume.email} {resume.phone && `• ${resume.phone}`}</p>
          <p><strong>Summary:</strong> {resume.summary}</p>
          <p><strong>Skills:</strong> {resume.skills}</p>
          <p><strong>Education:</strong> {resume.education}</p>
          <p><strong>Projects:</strong> {resume.projects}</p>
        </div>
      </Card>
    </div>
  )
}

function Tracker({ applications, addApplication, updateApplicationStatus, removeApplication }) {
  const [title, setTitle] = useState('')
  const [org, setOrg] = useState('')

  const add = async (e) => {
    e.preventDefault()
    await addApplication({ title, org })
    setTitle('')
    setOrg('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-heading text-2xl font-semibold">Application Tracker</h2>
        <form onSubmit={add} className="mt-3 grid gap-2 md:grid-cols-3">
          <input required className="rounded border px-3 py-2" placeholder="Opportunity title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input required className="rounded border px-3 py-2" placeholder="Organization" value={org} onChange={(e) => setOrg(e.target.value)} />
          <button className="rounded bg-brand px-4 py-2 text-white">Add Custom Application</button>
        </form>
      </Card>
      <div className="grid gap-3">
        {applications.map((app) => (
          <Card key={app.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold">{app.title}</h3>
                <p className="text-sm text-slate-600">{app.org} • Applied: {app.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={app.status} onChange={(e) => updateApplicationStatus(app.id, e.target.value)} className="rounded border px-2 py-1 text-sm">
                  {['Applied', 'In Review', 'Interview', 'Offer', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={() => removeApplication(app.id)} className="rounded border px-2 py-1 text-sm">Delete</button>
              </div>
            </div>
          </Card>
        ))}
        {applications.length === 0 && <p className="text-sm text-slate-600">No applications yet.</p>}
      </div>
    </div>
  )
}

function HostelFinder() {
  const [gender, setGender] = useState('All')
  const [budget, setBudget] = useState(8000)
  const list = seedHostels.filter((h) => (gender === 'All' || h.gender === gender || h.gender === 'Unisex') && h.fee <= budget)

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-heading text-2xl font-semibold">Hostel Finder</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <select className="rounded border px-3 py-2" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>All</option><option>Boys</option><option>Girls</option>
          </select>
          <input type="range" min="3500" max="8000" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
          <p className="text-sm self-center">Max Budget: ₹{budget}</p>
        </div>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((h) => (
          <Card key={h.id}>
            <h3 className="font-semibold">{h.name}</h3>
            <p className="text-sm text-slate-600">{h.gender} • {h.area}</p>
            <p className="mt-1">₹{h.fee}/month</p>
            <button onClick={() => alert(`Booked demo: ${h.name}`)} className="mt-3 rounded bg-brand px-3 py-1 text-sm text-white">Book</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Mentors() {
  const [domain, setDomain] = useState('All')
  const domains = ['All', ...new Set(seedMentors.map((m) => m.domain))]
  const list = seedMentors.filter((m) => domain === 'All' || m.domain === domain)

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-heading text-2xl font-semibold">Mentor Connect</h2>
        <select className="mt-3 rounded border px-3 py-2" value={domain} onChange={(e) => setDomain(e.target.value)}>
          {domains.map((d) => <option key={d}>{d}</option>)}
        </select>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((m) => (
          <Card key={m.id}>
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-sm text-slate-600">{m.company} • {m.domain}</p>
            <button onClick={() => alert(`Connection request sent to ${m.name}`)} className="mt-3 rounded bg-brand px-3 py-1 text-sm text-white">Connect</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StudyMaterials({ materials, addMaterial, refreshMaterials }) {
  const [stream, setStream] = useState('All')
  const [sem, setSem] = useState('All')
  const [form, setForm] = useState({ title: '', stream: 'CSE', semester: '1', link: '' })

  useEffect(() => {
    refreshMaterials(stream, sem)
  }, [stream, sem, refreshMaterials])

  const add = async (e) => {
    e.preventDefault()
    await addMaterial(form)
    setForm({ title: '', stream: 'CSE', semester: '1', link: '' })
    refreshMaterials(stream, sem)
  }

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="font-heading text-2xl font-semibold">Study Materials</h2>
        <form onSubmit={add} className="mt-3 grid gap-2 md:grid-cols-4">
          <input required className="rounded border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <select className="rounded border px-3 py-2" value={form.stream} onChange={(e) => setForm((f) => ({ ...f, stream: e.target.value }))}><option>CSE</option><option>ECE</option><option>ME</option><option>BBA</option></select>
          <select className="rounded border px-3 py-2" value={form.semester} onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}>{Array.from({ length: 8 }, (_, i) => String(i + 1)).map((s) => <option key={s}>{s}</option>)}</select>
          <input className="rounded border px-3 py-2" placeholder="Link (optional)" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
          <button className="rounded bg-brand px-4 py-2 text-white md:col-span-4">Upload Material</button>
        </form>
      </Card>
      <Card>
        <div className="grid gap-2 md:grid-cols-2">
          <select className="rounded border px-3 py-2" value={stream} onChange={(e) => setStream(e.target.value)}><option>All</option><option>CSE</option><option>ECE</option><option>ME</option><option>BBA</option></select>
          <select className="rounded border px-3 py-2" value={sem} onChange={(e) => setSem(e.target.value)}><option>All</option>{Array.from({ length: 8 }, (_, i) => String(i + 1)).map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </Card>
      <div className="grid gap-3">
        {materials.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-slate-600">{m.stream} • Semester {m.semester}</p>
              </div>
              <button className="rounded border px-3 py-1 text-sm" onClick={() => alert(`Downloading: ${m.title}`)}>Download</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Events({ rsvps, toggleRsvp }) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-2xl font-semibold">Event Calendar</h2>
      {seedEvents.map((ev) => (
        <Card key={ev.id}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold">{ev.title}</h3>
              <p className="text-sm text-slate-600">{ev.date} • {ev.mode}</p>
            </div>
            <button className={`rounded px-3 py-1 text-sm ${rsvps.includes(ev.id) ? 'bg-emerald-600 text-white' : 'border'}`} onClick={() => toggleRsvp(ev.id)}>
              {rsvps.includes(ev.id) ? 'RSVPed' : 'RSVP'}
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

function Admin({ opportunities, setOpportunities, applications }) {
  const [form, setForm] = useState({ title: '', type: 'Internship', org: '', location: '', deadline: '', stipend: '', description: '' })

  const add = async (e) => {
    e.preventDefault()
    const created = await api('/opportunities', {
      method: 'POST',
      body: JSON.stringify(form)
    })
    setOpportunities((items) => [created, ...items])
    setForm({ title: '', type: 'Internship', org: '', location: '', deadline: '', stipend: '', description: '' })
  }

  const stats = useMemo(() => ({
    totalOpportunities: opportunities.length,
    totalApplications: applications.length,
    internships: opportunities.filter((o) => o.type === 'Internship').length,
    scholarships: opportunities.filter((o) => o.type === 'Scholarship').length
  }), [opportunities, applications])

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold">Admin Dashboard</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(stats).map(([k, v]) => (
          <Card key={k}><p className="text-sm text-slate-600">{k}</p><p className="text-2xl font-semibold text-brand">{v}</p></Card>
        ))}
      </div>
      <Card>
        <h3 className="font-heading text-xl font-semibold">Post Opportunity</h3>
        <form onSubmit={add} className="mt-3 grid gap-2 md:grid-cols-2">
          <input required className="rounded border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <select className="rounded border px-3 py-2" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}><option>Internship</option><option>Scholarship</option><option>Hackathon</option></select>
          <input required className="rounded border px-3 py-2" placeholder="Organization" value={form.org} onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} />
          <input required className="rounded border px-3 py-2" placeholder="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          <input required type="date" className="rounded border px-3 py-2" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          <input className="rounded border px-3 py-2" placeholder="Stipend / Reward" value={form.stipend} onChange={(e) => setForm((f) => ({ ...f, stipend: e.target.value }))} />
          <textarea required className="rounded border px-3 py-2 md:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <button className="rounded bg-brand px-4 py-2 text-white md:col-span-2">Post Opportunity</button>
        </form>
      </Card>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [applications, setApplications] = useState([])
  const [materials, setMaterials] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [apiDown, setApiDown] = useState(false)
  const [apiChecking, setApiChecking] = useState(false)
  const [apiErrorMessage, setApiErrorMessage] = useState('')
  const [apiBannerDismissed, setApiBannerDismissed] = useState(false)

  const email = user?.email || ''

  useEffect(() => {
    api('/opportunities').then(setOpportunities).catch(() => setOpportunities([]))
  }, [])

  const checkHealth = async () => {
    setApiChecking(true)
    try {
      await api('/health')
      setApiDown(false)
      setApiErrorMessage('')
      setApiBannerDismissed(false)
    } catch (err) {
      setApiDown(true)
      setApiErrorMessage(err?.message || 'Unable to connect')
      setApiBannerDismissed(false)
    } finally {
      setApiChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const timer = window.setInterval(checkHealth, 8000)
    return () => {
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!email) {
      setBookmarks([])
      setApplications([])
      setRsvps([])
      return
    }

    api(`/bookmarks?email=${encodeURIComponent(email)}`).then(setBookmarks).catch(() => setBookmarks([]))
    api(`/applications?email=${encodeURIComponent(email)}`).then(setApplications).catch(() => setApplications([]))
    api(`/events/rsvp?email=${encodeURIComponent(email)}`).then(setRsvps).catch(() => setRsvps([]))
  }, [email])

  const refreshMaterials = async (stream = 'All', semester = 'All') => {
    const data = await api(`/materials?stream=${encodeURIComponent(stream)}&semester=${encodeURIComponent(semester)}`)
    setMaterials(data)
  }

  const addMaterial = async (form) => {
    await api('/materials', {
      method: 'POST',
      body: JSON.stringify(form)
    })
  }

  const toggleBookmark = async (opportunityId) => {
    if (!email) {
      alert('Please login to bookmark opportunities.')
      return
    }
    const data = await api('/bookmarks/toggle', {
      method: 'POST',
      body: JSON.stringify({ email, opportunityId })
    })
    setBookmarks(data)
  }

  const addApplication = async ({ title, org }) => {
    if (!email) throw new Error('Please login first.')
    const created = await api('/applications', {
      method: 'POST',
      body: JSON.stringify({ title, org, email })
    })
    setApplications((items) => [created, ...items])
  }

  const updateApplicationStatus = async (id, status) => {
    const updated = await api(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
    setApplications((items) => items.map((x) => x.id === updated.id ? updated : x))
  }

  const removeApplication = async (id) => {
    await api(`/applications/${id}`, { method: 'DELETE' })
    setApplications((items) => items.filter((x) => x.id !== id))
  }

  const toggleRsvp = async (eventId) => {
    if (!email) {
      alert('Please login to RSVP events.')
      return
    }
    const data = await api('/events/rsvp/toggle', {
      method: 'POST',
      body: JSON.stringify({ email, eventId })
    })
    setRsvps(data)
  }

  return (
    <Layout
      user={user}
      onLogout={() => setUser(null)}
      apiDown={apiDown}
      apiChecking={apiChecking}
      apiErrorMessage={apiErrorMessage}
      apiBannerDismissed={apiBannerDismissed}
      onRetryApi={checkHealth}
      onDismissApiBanner={() => setApiBannerDismissed(true)}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={setUser} mode="student" />} />
        <Route path="/admin-login" element={<Login onLogin={setUser} mode="admin" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/opportunities" element={<Opportunities opportunities={opportunities} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
        <Route path="/opportunity/:id" element={<OpportunityDetail opportunities={opportunities} bookmarks={bookmarks} toggleBookmark={toggleBookmark} addApplication={addApplication} user={user} />} />
        <Route path="/resume-builder" element={<ResumeBuilder user={user} />} />
        <Route path="/tracker" element={<Tracker applications={applications} addApplication={addApplication} updateApplicationStatus={updateApplicationStatus} removeApplication={removeApplication} />} />
        <Route path="/hostel-finder" element={<HostelFinder />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/study-materials" element={<StudyMaterials materials={materials} addMaterial={addMaterial} refreshMaterials={refreshMaterials} />} />
        <Route path="/events" element={<Events rsvps={rsvps} toggleRsvp={toggleRsvp} />} />
        <Route
          path="/admin"
          element={
            <AdminOnlyRoute user={user}>
              <Admin opportunities={opportunities} setOpportunities={setOpportunities} applications={applications} />
            </AdminOnlyRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
