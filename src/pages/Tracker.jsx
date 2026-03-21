import React from 'react'
import { useState } from 'react'
import Card from '../components/Card'

export default function Tracker({ applications, addApplication, updateApplicationStatus, removeApplication }) {
  const [title, setTitle] = useState('')
  const [org, setOrg] = useState('')

  const add = async (e) => {
    e.preventDefault()
    try {
      await addApplication({ title, org })
      setTitle('')
      setOrg('')
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const statusColors = {
    'Applied': 'bg-blue-100 text-blue-800 border-blue-300',
    'In Review': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Interview': 'bg-purple-100 text-purple-800 border-purple-300',
    'Offer': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'Rejected': 'bg-red-100 text-red-800 border-red-300'
  }

  const stats = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Application Tracker</h1>
        <p className="mt-1 text-slate-600">Track all your applications in one place</p>
      </div>

      {/* Stats Dashboard */}
      {Object.keys(stats).length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {['Applied', 'In Review', 'Interview', 'Offer', 'Rejected'].map((status) => (
            <Card key={status}>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{status}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats[status] || 0}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Add Application Card */}
      <Card>
        <h2 className="font-heading text-lg font-semibold mb-4 text-slate-900">Add New Application</h2>
        <form onSubmit={add} className="grid gap-3 md:grid-cols-4">
          <input 
            required 
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
            placeholder="Opportunity title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <input 
            required 
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
            placeholder="Organization" 
            value={org} 
            onChange={(e) => setOrg(e.target.value)} 
          />
          <button className="rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:opacity-95 active:scale-[0.98] md:col-span-2">
            Add Application
          </button>
        </form>
      </Card>

      {/* Applications List */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4 text-slate-900">Your Applications</h2>
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-slate-600">No applications tracked yet 📝</p>
            <p className="mt-1 text-sm text-slate-500">Apply to opportunities or add them manually to start tracking</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {applications.map((app) => (
              <Card key={app.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-slate-900 truncate">{app.title}</h3>
                    <p className="text-sm text-slate-600">
                      {app.org} • <span className="text-xs text-slate-500">Applied: {app.date}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* Status Dropdown */}
                    <select 
                      value={app.status} 
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value)} 
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold border outline-none transition cursor-pointer ${statusColors[app.status] || 'bg-slate-100'}`}
                    >
                      {['Applied', 'In Review', 'Interview', 'Offer', 'Rejected'].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeApplication(app.id)} 
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete application"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
