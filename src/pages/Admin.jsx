import React from 'react'
import { useState, useMemo } from 'react'
import { api } from '../utils/api'
import Card from '../components/Card'

export default function Admin({ opportunities, setOpportunities, applications }) {
  const [form, setForm] = useState({ 
    title: '', 
    type: 'Internship', 
    org: '', 
    location: '', 
    deadline: '', 
    stipend: '', 
    description: '' 
  })
  const [loading, setLoading] = useState(false)

  const add = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const created = await api('/opportunities', {
        method: 'POST',
        body: JSON.stringify(form)
      })
      setOpportunities((items) => [created, ...items])
      setForm({ title: '', type: 'Internship', org: '', location: '', deadline: '', stipend: '', description: '' })
      alert('✓ Opportunity posted successfully!')
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => ({
    'Total Opportunities': opportunities.length,
    'Total Applications': applications.length,
    'Internships': opportunities.filter((o) => o.type === 'Internship').length,
    'Scholarships': opportunities.filter((o) => o.type === 'Scholarship').length,
    'Hackathons': opportunities.filter((o) => o.type === 'Hackathon').length
  }), [opportunities, applications])

  const statIcons = {
    'Total Opportunities': '📌',
    'Total Applications': '📤',
    'Internships': '💼',
    'Scholarships': '🎓',
    'Hackathons': '⚡'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-slate-600">Manage opportunities and view statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-2xl">{statIcons[k]}</p>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{k}</p>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">{v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Post Opportunity Card */}
      <Card>
        <h2 className="font-heading text-2xl font-semibold mb-6 text-slate-900">Post New Opportunity</h2>
        <form onSubmit={add} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input 
                required 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                placeholder="e.g., Frontend Engineer Internship" 
                value={form.title} 
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} 
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
              <select 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                value={form.type} 
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option>Internship</option>
                <option>Scholarship</option>
                <option>Hackathon</option>
              </select>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization *</label>
              <input 
                required 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                placeholder="e.g., Google, Microsoft" 
                value={form.org} 
                onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))} 
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
              <input 
                required 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                placeholder="e.g., Bangalore, Remote" 
                value={form.location} 
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} 
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline *</label>
              <input 
                required 
                type="date" 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                value={form.deadline} 
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} 
              />
            </div>

            {/* Stipend */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stipend / Reward</label>
              <input 
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                placeholder="e.g., ₹20,000/month" 
                value={form.stipend} 
                onChange={(e) => setForm((f) => ({ ...f, stipend: e.target.value }))} 
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
            <textarea 
              required 
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="Describe the opportunity in detail..." 
              rows={4} 
              value={form.description} 
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} 
            />
          </div>

          <button 
            disabled={loading} 
            className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Opportunity'}
          </button>
        </form>
      </Card>

      {/* Recent Opportunities */}
      <Card>
        <h2 className="font-heading text-xl font-semibold mb-4 text-slate-900">Recent Opportunities</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {opportunities.slice(0, 10).map((opp) => (
            <div key={opp.id} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{opp.title}</h4>
                  <p className="text-sm text-slate-600">{opp.org} • {opp.type}</p>
                </div>
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{opp.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
