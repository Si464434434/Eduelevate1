import React from 'react'
export default function Card({ children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      {children}
    </div>
  )
}
