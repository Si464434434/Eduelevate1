import React from 'react'
import Card from '../components/Card'

const seedEvents = [
  { id: 'ev1', title: 'Resume Review Bootcamp', date: '2026-03-18', mode: 'Online' },
  { id: 'ev2', title: 'Hackathon Prep Session', date: '2026-03-25', mode: 'Offline' },
  { id: 'ev3', title: 'Scholarship Q&A Live', date: '2026-04-02', mode: 'Online' },
  { id: 'ev4', title: 'Placement Interview Simulation', date: '2026-04-10', mode: 'Hybrid' }
]

export default function Events({ rsvps, toggleRsvp }) {
  const modeEmojis = { 'Online': '💻', 'Offline': '📍', 'Hybrid': '🔀' }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Event Calendar</h1>
        <p className="mt-1 text-slate-600">Discover and RSVP to upcoming events</p>
      </div>

      {/* Events Grid */}
      <div className="grid gap-4">
        {seedEvents.map((ev) => (
          <div key={ev.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 group-hover:text-brand transition">
                    {ev.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-slate-600">
                      📅 {ev.date}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      {modeEmojis[ev.mode] || '📍'} {ev.mode}
                    </span>
                  </div>
                </div>
                
                {/* RSVP Button */}
                <button
                  onClick={() => toggleRsvp(ev.id)}
                  className={`flex-shrink-0 rounded-full px-6 py-2.5 font-semibold transition active:scale-[0.98] ${
                    rsvps.includes(ev.id)
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {rsvps.includes(ev.id) ? '✓ RSVPed' : 'RSVP'}
                </button>
              </div>
              
              {/* Registration Info */}
              {rsvps.includes(ev.id) && (
                <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 border border-emerald-200">
                  ✓ You are registered for this event
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {seedEvents.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">No events scheduled right now 📆</p>
          <p className="mt-1 text-sm text-slate-500">Check back soon for upcoming events</p>
        </div>
      )}
    </div>
  )
}
