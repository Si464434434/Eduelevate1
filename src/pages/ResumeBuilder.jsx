import React from 'react'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import Card from '../components/Card'

export default function ResumeBuilder({ user }) {
  const [resume, setResume] = useState({ name: '', email: '', phone: '', summary: '', skills: '', education: '', projects: '' })

  useEffect(() => {
    if (!user?.email) return
    api(`/resume?email=${encodeURIComponent(user.email)}`)
      .then((data) => {
        setResume({ ...data, email: data.email || user.email })
      })
      .catch(() => {
        setResume((r) => ({ ...r, email: user.email }))
      })
  }, [user])

  const change = (k, v) => setResume((r) => ({ ...r, [k]: v }))

  const saveResume = async () => {
    if (!user?.email) {
      alert('Please login to save resume.')
      return
    }
    await api('/resume', {
      method: 'POST',
      body: JSON.stringify({ ...resume, email: user.email })
    })
    alert('✓ Resume saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Resume Builder</h1>
        <p className="mt-1 text-slate-600">Create an ATS-friendly resume with real-time preview</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Form Section */}
        <div className="space-y-4">
          {/* Contact Information Card */}
          <Card>
            <h2 className="font-heading text-xl font-semibold mb-4 text-slate-900">Contact Information</h2>
            <div className="space-y-3">
              {[
                ['name', 'Full Name', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Phone Number', 'tel']
              ].map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700">{label}</label>
                  <input 
                    placeholder={label} 
                    value={resume[key]} 
                    onChange={(e) => change(key, e.target.value)} 
                    type={type} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Professional Details Card */}
          <Card>
            <h2 className="font-heading text-xl font-semibold mb-4 text-slate-900">Professional Details</h2>
            <div className="space-y-3">
              {[
                ['summary', 'Professional Summary'],
                ['skills', 'Skills (comma separated)'],
                ['education', 'Education'],
                ['projects', 'Projects']
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-slate-700">{label}</label>
                  <textarea 
                    placeholder={label} 
                    value={resume[key]} 
                    onChange={(e) => change(key, e.target.value)} 
                    className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" 
                    rows={3} 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              className="flex-1 rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:opacity-95 active:scale-[0.98]" 
              onClick={saveResume}
            >
              Save Resume
            </button>
            <button 
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50" 
              onClick={() => alert('PDF download feature coming soon!')}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <Card>
          <h2 className="font-heading text-xl font-semibold mb-4 text-slate-900">Live Preview</h2>
          <div className="space-y-4 bg-white p-6 rounded-lg border border-slate-200">
            {/* Name and Contact */}
            <div>
              <h3 className="font-heading text-2xl font-bold text-slate-900">{resume.name || 'Your Name'}</h3>
              <p className="text-sm text-slate-600">{resume.email} {resume.phone && `• ${resume.phone}`}</p>
            </div>

            {/* Summary */}
            {resume.summary && (
              <div>
                <h4 className="font-heading font-semibold text-slate-900 text-sm uppercase tracking-wide">Professional Summary</h4>
                <p className="mt-1 text-sm text-slate-700">{resume.summary}</p>
              </div>
            )}

            {/* Skills */}
            {resume.skills && (
              <div>
                <h4 className="font-heading font-semibold text-slate-900 text-sm uppercase tracking-wide">Skills</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {resume.skills.split(',').filter(s => s.trim()).map((skill, i) => (
                    <span key={i} className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.education && (
              <div>
                <h4 className="font-heading font-semibold text-slate-900 text-sm uppercase tracking-wide">Education</h4>
                <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{resume.education}</p>
              </div>
            )}

            {/* Projects */}
            {resume.projects && (
              <div>
                <h4 className="font-heading font-semibold text-slate-900 text-sm uppercase tracking-wide">Projects</h4>
                <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{resume.projects}</p>
              </div>
            )}

            {/* Empty State */}
            {!resume.name && <p className="text-sm text-slate-500 text-center py-8">Your resume preview will appear here as you fill in the details</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
