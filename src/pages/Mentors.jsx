import React from 'react'
import { useState } from 'react'
import Card from '../components/Card'

const seedMentors = [
  { id: 1, name: 'Aditi Sharma', company: 'Google', domain: 'Web Development' },
  { id: 2, name: 'Rohan Verma', company: 'Microsoft', domain: 'Cloud' },
  { id: 3, name: 'Nisha Rao', company: 'Amazon', domain: 'Data Science' },
  { id: 4, name: 'Karan Mehta', company: 'Adobe', domain: 'Product Design' },
  { id: 5, name: 'Priya Iyer', company: 'Meta', domain: 'Mobile Development' },
  { id: 6, name: 'Arjun Singh', company: 'NVIDIA', domain: 'AI/ML' }
]

export default function Mentors() {
  const [domain, setDomain] = useState('All')
  const domains = ['All', ...new Set(seedMentors.map((m) => m.domain))]
  const list = seedMentors.filter((m) => domain === 'All' || m.domain === domain)

  const domainEmojis = {
    'Web Development': '🌐',
    'Cloud': '☁️',
    'Data Science': '📊',
    'Product Design': '🎨',
    'Mobile Development': '📱',
    'AI/ML': '🤖'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Mentor Connect</h1>
        <p className="mt-1 text-slate-600">Get guidance from industry professionals</p>
      </div>

      {/* Filter Card */}
      <Card>
        <h2 className="font-heading text-lg font-semibold mb-3 text-slate-900">Filter by Domain</h2>
        <div className="flex flex-wrap gap-2">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${domain === d ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600">{list.length} mentor{list.length !== 1 ? 's' : ''} available</p>
      </Card>

      {/* Mentors Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <div key={m.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="text-3xl">{domainEmojis[m.domain] || '👨‍💼'}</div>
                <span className="inline-block rounded-full bg-brand/10 px-2 py-1 text-xs font-semibold text-brand">{m.domain}</span>
              </div>
              <h3 className="font-heading font-semibold text-slate-900 group-hover:text-brand transition">{m.name}</h3>
              <p className="mt-1 text-sm text-slate-600 flex items-center gap-1">
                <span>💼</span>
                {m.company}
              </p>
              <button 
                onClick={() => alert(`✓ Connection request sent to ${m.name}!`)} 
                className="mt-4 w-full rounded-lg bg-brand px-3 py-2.5 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
