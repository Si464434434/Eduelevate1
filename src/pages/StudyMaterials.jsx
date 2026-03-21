import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import Card from '../components/Card'

export default function StudyMaterials({ materials, addMaterial, refreshMaterials }) {
  const [stream, setStream] = useState('All')
  const [sem, setSem] = useState('All')
  const [form, setForm] = useState({ title: '', stream: 'CSE', semester: '1', link: '' })

  useEffect(() => {
    refreshMaterials(stream, sem)
  }, [stream, sem, refreshMaterials])

  const add = async (e) => {
    e.preventDefault()
    try {
      await addMaterial(form)
      setForm({ title: '', stream: 'CSE', semester: '1', link: '' })
      await refreshMaterials(stream, sem)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Study Materials</h1>
        <p className="mt-1 text-slate-600">Access curated study resources by stream and semester</p>
      </div>

      {/* Upload Form Card */}
      <Card>
        <h2 className="font-heading text-lg font-semibold mb-4 text-slate-900">Upload New Material</h2>
        <form onSubmit={add} className="grid gap-3 md:grid-cols-5">
          <input 
            required 
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
            placeholder="Material title" 
            value={form.title} 
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} 
          />
          <select 
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
            value={form.stream} 
            onChange={(e) => setForm((f) => ({ ...f, stream: e.target.value }))}
          >
            <option>CSE</option>
            <option>ECE</option>
            <option>ME</option>
            <option>BBA</option>
          </select>
          <select 
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
            value={form.semester} 
            onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
          >
            {Array.from({ length: 8 }, (_, i) => String(i + 1)).map((s) => <option key={s}>Sem {s}</option>)}
          </select>
          <input 
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
            placeholder="Link (optional)" 
            value={form.link} 
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} 
          />
          <button className="rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]">
            Upload
          </button>
        </form>
      </Card>

      {/* Filter Card */}
      <Card>
        <h2 className="font-heading text-lg font-semibold mb-4 text-slate-900">Filter Materials</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Stream</label>
            <select 
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
              value={stream} 
              onChange={(e) => setStream(e.target.value)}
            >
              <option>All</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>ME</option>
              <option>BBA</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Semester</label>
            <select 
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
              value={sem} 
              onChange={(e) => setSem(e.target.value)}
            >
              <option>All</option>
              {Array.from({ length: 8 }, (_, i) => String(i + 1)).map((s) => <option key={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Materials List */}
      <div>
        <h2 className="font-heading text-lg font-semibold mb-4 text-slate-900">Available Materials ({materials.length})</h2>
        {materials.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-slate-600">No materials available yet 📚</p>
            <p className="mt-1 text-sm text-slate-500">Materials will appear here once uploaded</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {materials.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-md">
                <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-slate-900 truncate">{m.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {m.stream} • {m.semester} <span className="text-xs text-slate-500">• ID: {m.id}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.link && (
                      <a 
                        href={m.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        📄 View
                      </a>
                    )}
                    <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 active:scale-[0.98]">
                      📥 Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
