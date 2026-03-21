import React from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
import Card from '../components/Card'

export default function OpportunityDetail({ opportunities, bookmarks, toggleBookmark, addApplication, user }) {
  const { id } = useParams()
  const item = opportunities.find((x) => x.id === id)
  
  if (!item) return <Navigate to="/opportunities" replace />
  
  const isBookmarked = bookmarks.includes(item.id)
  const typeColors = { 
    'Internship': 'bg-blue-100 text-blue-800', 
    'Scholarship': 'bg-emerald-100 text-emerald-800', 
    'Hackathon': 'bg-purple-100 text-purple-800' 
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link to="/opportunities" className="inline-flex items-center text-sm font-medium text-brand hover:gap-1 transition gap-0.5">
        <span>←</span>
        Back to Opportunities
      </Link>

      {/* Opportunity Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Type Badge */}
              <div className="mb-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeColors[item.type] || 'bg-slate-100 text-slate-800'}`}>
                  {item.type}
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold text-slate-900">{item.title}</h1>
              <p className="mt-2 text-lg text-slate-600">{item.org} • {item.location}</p>
            </div>
            
            {/* Bookmark Button */}
            <button 
              onClick={() => toggleBookmark(item.id)} 
              className={`flex-shrink-0 rounded-lg p-3 transition ${isBookmarked ? 'bg-blue-100' : 'bg-slate-100 hover:bg-slate-200'}`} 
              title={isBookmarked ? 'Remove bookmark' : 'Save opportunity'}
            >
              <span className="text-2xl">{isBookmarked ? '🔖' : '📑'}</span>
            </button>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-3 pt-6 border-t border-slate-200">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Deadline</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.deadline}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Stipend/Reward</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.stipend}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Location</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.location}</p>
            </div>
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="font-heading text-lg font-semibold text-slate-900 mb-3">About</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              className="flex-1 rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
              onClick={async () => {
                if (!user) {
                  alert('Please login first.')
                  return
                }
                try {
                  await addApplication({ title: item.title, org: item.org })
                  alert('✓ Application added to tracker!')
                } catch (err) {
                  alert('❌ ' + err.message)
                }
              }}
            >
              Apply Now
            </button>
            <button 
              className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50" 
              onClick={() => alert('Share feature coming soon!')}
            >
              Share
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
