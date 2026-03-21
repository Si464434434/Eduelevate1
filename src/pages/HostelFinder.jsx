import React from 'react'
import { useState } from 'react'
import Card from '../components/Card'

const seedHostels = [
  { id: 1, name: 'Skyline Boys Hostel', gender: 'Boys', fee: 4500, area: 'Sector 18' },
  { id: 2, name: 'Serene Girls Residency', gender: 'Girls', fee: 5200, area: 'City Center' },
  { id: 3, name: 'Metro Co-Living', gender: 'Unisex', fee: 8000, area: 'IT Park' },
  { id: 4, name: 'Budget Stay Boys', gender: 'Boys', fee: 3500, area: 'Near Station' },
  { id: 5, name: 'Lotus Girls Hostel', gender: 'Girls', fee: 6000, area: 'University Road' },
  { id: 6, name: 'Study Nest Residency', gender: 'Unisex', fee: 7000, area: 'Library Circle' }
]

export default function HostelFinder() {
  const [gender, setGender] = useState('All')
  const [budget, setBudget] = useState(8000)
  const list = seedHostels.filter((h) => (gender === 'All' || h.gender === gender || h.gender === 'Unisex') && h.fee <= budget)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Hostel Finder</h1>
        <p className="mt-1 text-slate-600">Find the perfect accommodation for your student life</p>
      </div>

      {/* Filter Card */}
      <Card>
        <h2 className="font-heading text-lg font-semibold mb-4 text-slate-900">Filter Hostels</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Gender Filter */}
          <div>
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <select 
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
            >
              <option>All</option>
              <option>Boys</option>
              <option>Girls</option>
              <option>Unisex</option>
            </select>
          </div>
          
          {/* Budget Slider */}
          <div className="md:col-span-2">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700">Max Budget: ₹{budget.toLocaleString()}</label>
                <input 
                  type="range" 
                  min="3500" 
                  max="8000" 
                  step="500" 
                  value={budget} 
                  onChange={(e) => setBudget(Number(e.target.value))} 
                  className="mt-2 w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">Showing {list.length} hostel{list.length !== 1 ? 's' : ''}</p>
      </Card>

      {/* Hostels Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((h) => (
          <div key={h.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-heading font-semibold text-slate-900 group-hover:text-brand transition flex-1">{h.name}</h3>
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{h.gender}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">📍 {h.area}</p>
              <div className="mb-4 pt-4 border-t border-slate-100">
                <p className="text-2xl font-bold text-brand">₹{h.fee}</p>
                <p className="text-xs text-slate-600">per month</p>
              </div>
              <button 
                onClick={() => alert(`✓ Booked demo: ${h.name}`)} 
                className="w-full rounded-lg bg-brand px-3 py-2.5 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {list.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-600">No hostels match your criteria 🏠</p>
          <button 
            onClick={() => { setGender('All'); setBudget(8000); }} 
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
