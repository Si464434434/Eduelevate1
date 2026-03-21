import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing({ opportunities = [], bookmarks = [], toggleBookmark = () => {} }) {
  const spotlight = opportunities.slice(0, 3)

  const quickStats = [
    { label: 'Live Opportunities', value: opportunities.length || 0 },
    { label: 'Saved Items', value: bookmarks.length || 0 },
    { label: 'Active Tracks', value: 6 },
    { label: 'Mentor Domains', value: 12 }
  ]

  const actionCards = [
    {
      title: 'Opportunity Radar',
      desc: 'Find internships, hackathons, and scholarships updated in one stream.',
      to: '/opportunities',
      accent: 'from-blue-500/15 to-cyan-400/10'
    },
    {
      title: 'Resume Lab',
      desc: 'Build ATS-friendly resumes and keep versions tailored for each role.',
      to: '/resume-builder',
      accent: 'from-amber-500/15 to-orange-400/10'
    },
    {
      title: 'Application Command Center',
      desc: 'Track every application status from Applied to Offer in one dashboard.',
      to: '/tracker',
      accent: 'from-emerald-500/15 to-teal-400/10'
    }
  ]

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-fuchsia-400/15 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
              Career Operating System
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Home base for your next internship, scholarship, and offer letter.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
              EduElevate brings opportunities, resume building, mentor support, and application tracking into one focused student workflow.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/opportunities"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
              >
                Explore Opportunities
              </Link>
              <Link
                to="/resume-builder"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Open Resume Lab
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {quickStats.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-slate-200">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Opportunity Spotlight</h2>
          <Link to="/opportunities" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {spotlight.map((item) => {
            const saved = bookmarks.includes(item.id)
            return (
              <article
                key={item.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {item.type}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.org} • {item.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(item.id)}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <p className="text-xs font-medium text-slate-500">Deadline: {item.deadline}</p>
                  <Link to={`/opportunity/${item.id}`} className="text-sm font-semibold text-brand hover:underline">
                    Details
                  </Link>
                </div>
              </article>
            )
          })}

          {!spotlight.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 md:col-span-2 xl:col-span-3">
              No opportunities yet. Start by opening the Opportunities page.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {actionCards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${card.accent} p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{card.desc}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900 group-hover:underline">Open</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}

