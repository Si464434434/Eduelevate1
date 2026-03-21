import React from 'react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { API_URL } from '../utils/api'

const navItems = [
  ['/', 'Home', '🏠'],
  ['/opportunities', 'Opportunities', '🎯'],
  ['/study-materials', 'Materials', '📚'],
  ['/events', 'Events', '📅'],
  ['/resume-builder', 'Resume Builder', '📝'],
  ['/tracker', 'Tracker', '✓'],
  ['/hostel-finder', 'Hostel', '🏢'],
  ['/mentors', 'Mentors', '👨‍🏫'],
  ['/admin', 'Admin', '⚙️']
]

export default function Layout({ 
  children, 
  user, 
  onLogout, 
  apiDown, 
  apiChecking, 
  apiErrorMessage, 
  apiBannerDismissed, 
  onRetryApi, 
  onDismissApiBanner 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const visibleNavItems = user?.role === 'admin' ? navItems : navItems.filter(([to]) => to !== '/admin')

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-64 transform bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-screen flex-col">
          {/* Logo */}
          <div className="border-b border-slate-700 p-6">
            <Link to="/" className="group inline-flex items-center gap-2 text-lg font-bold tracking-tight transition duration-200 hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-blue-600">
                <span className="text-white font-heading">🎓</span>
              </div>
              <div className="flex flex-col gap-0">
                <span className="text-white">Edu</span>
                <span className="text-xs text-blue-400 font-semibold">Elevate</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
            {visibleNavItems.map(([to, label, icon]) => (
              <NavLink 
                key={to} 
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-slate-700 p-4">
            {user ? (
              <div className="space-y-3">
                <div className="rounded-lg bg-slate-700/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email || 'student@edu.com'}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    onLogout()
                    setSidebarOpen(false)
                  }} 
                  className="w-full rounded-lg bg-red-600/20 px-4 py-2.5 text-sm text-red-400 transition duration-200 hover:bg-red-600/30 hover:text-red-300 flex items-center justify-center gap-2 border border-red-600/30"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block w-full rounded-lg border border-blue-500 px-4 py-2.5 text-center text-sm text-blue-400 transition duration-200 hover:bg-blue-500/10">
                  Student Login
                </Link>
                <Link to="/register" className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm text-white transition duration-200 hover:bg-blue-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            {/* Mobile Menu Button */}
            <button 
              className="rounded-lg border border-slate-300 p-2 lg:hidden hover:bg-slate-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="text-xl">☰</span>
            </button>

            {/* Page Title */}
            <h1 className="flex-1 text-center lg:text-left text-lg font-semibold text-slate-900">
              {navItems.find(([path]) => path === location.pathname)?.[1] || 'Welcome'}
            </h1>

            {/* Notification Bell */}
            <button className="rounded-full border border-slate-200 p-2 hover:bg-slate-100 transition duration-200">
              <span className="text-lg">🔔</span>
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>

          {/* API Status Banner */}
          {apiDown && !apiBannerDismissed && (
            <div className="border-t border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">⚠️ API offline:</span>
                  <span>Backend not reachable.</span>
                  {apiErrorMessage && <span className="hidden text-amber-800/90 md:inline">({apiErrorMessage})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded border border-amber-500 px-3 py-1 text-xs font-semibold text-amber-900 disabled:cursor-not-allowed disabled:opacity-70 hover:bg-amber-100"
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

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
