import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'

export default function Opportunities({ opportunities, bookmarks, toggleBookmark }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  
  const filtered = opportunities.filter((item) => {
    const hit = `${item.title} ${item.org} ${item.description}`.toLowerCase().includes(search.toLowerCase())
    const typeHit = type === 'All' || item.type === type
    return hit && typeHit
  })

  const typeColors = { 
    'Internship': 'bg-blue-100 text-blue-800', 
    'Scholarship': 'bg-emerald-100 text-emerald-800', 
    'Hackathon': 'bg-purple-100 text-purple-800' 
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Explore Opportunities</h1>
        <p className="mt-1 text-slate-600">Find your perfect internship, scholarship, or hackathon</p>
      </div>

      {/* Search & Filter Card */}
      <Card>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {/* Search Input */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-slate-700">Search</label>
            <input 
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
              placeholder="Search by title, organization, or keywords..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          
          {/* Type Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-700">Type</label>
            <select 
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
              value={type} 
              onChange={(e) => setType(e.target.value)}
            >
              <option>All</option>
              <option>Internship</option>
              <option>Scholarship</option>
              <option>Hackathon</option>
            </select>
          </div>
        </div>
        
        {/* Result Count */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700">{filtered.length} opportunity{filtered.length !== 1 ? 'ies' : ''} found</p>
        </div>
      </Card>

      {/* Opportunities Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* Type Badge */}
                  <div className="mb-2 inline-block">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[item.type] || 'bg-slate-100 text-slate-800'}`}>
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900 group-hover:text-brand transition">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{item.org}</p>
                </div>
                
                {/* Bookmark Button */}
                <button 
                  onClick={() => toggleBookmark(item.id)} 
                  className="rounded-lg p-2 transition hover:bg-slate-100" 
                  title={bookmarks.includes(item.id) ? 'Remove bookmark' : 'Save opportunity'}
                >
                  <span className="text-lg">{bookmarks.includes(item.id) ? '🔖' : '📑'}</span>
                </button>
              </div>
              
              {/* Description */}
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.description}</p>
              
              {/* Footer with Deadline and CTA */}
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">Deadline: {item.deadline}</span>
                <Link className="inline-flex items-center text-sm font-semibold text-brand hover:gap-1 transition gap-0.5" to={`/opportunity/${item.id}`}>
                  View Details
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">No opportunities match your criteria 🔍</p>
          <button 
            onClick={() => { setSearch(''); setType('All'); }} 
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
