import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SESSION_KEY, API_BASE } from './utils/api'
import Layout from './components/Layout'
import AdminOnlyRoute from './components/AdminOnlyRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Opportunities from './pages/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail'
import ResumeBuilder from './pages/ResumeBuilder'
import Tracker from './pages/Tracker'
import HostelFinder from './pages/HostelFinder'
import Mentors from './pages/Mentors'
import StudyMaterials from './pages/StudyMaterials'
import Events from './pages/Events'
import Admin from './pages/Admin'

// Seed data for opportunities
const seedOpportunities = [
  {
    id: 'o1',
    title: 'Frontend Developer Intern',
    type: 'Internship',
    org: 'Google',
    location: 'Bangalore',
    deadline: '2026-03-31',
    stipend: '₹35,000/month',
    description: 'Build responsive UI components. Experience with React/Vue required.'
  },
  {
    id: 'o2',
    title: 'Data Science Hackathon',
    type: 'Hackathon',
    org: 'Microsoft',
    location: 'Remote',
    deadline: '2026-04-15',
    stipend: '₹5,00,000 in prizes',
    description: 'Solve real-world data challenges. 48-hour online hackathon.'
  },
  {
    id: 'o3',
    title: 'Merit Scholarship',
    type: 'Scholarship',
    org: 'EduTech Foundation',
    location: 'Pan-India',
    deadline: '2026-05-20',
    stipend: 'Up to ₹2,00,000',
    description: 'For high-achieving engineering students across all streams.'
  }
]

export default function App() {
  // Authentication state
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const saved = window.localStorage.getItem(SESSION_KEY)
      if (!saved) return null
      const parsed = JSON.parse(saved)
      return parsed?.user || null
    } catch {
      return null
    }
  })

  // Data state management
  const [opportunities, setOpportunities] = useState(seedOpportunities)
  const [bookmarks, setBookmarks] = useState([])
  const [applications, setApplications] = useState([])
  const [rsvps, setRsvps] = useState([])

  // API health state
  const [apiDown, setApiDown] = useState(false)
  const [apiChecking, setApiChecking] = useState(false)
  const [apiErrorMessage, setApiErrorMessage] = useState('')
  const [apiBannerDismissed, setApiBannerDismissed] = useState(false)

  // Authentication handlers
  const handleLogin = (loggedInUser, token) => {
    setUser(loggedInUser)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify({ user: loggedInUser, token }))
    }
  }

  const handleLogout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_KEY)
    }
  }

  // API health monitoring
  const checkHealth = async () => {
    setApiChecking(true)
    try {
      const response = await fetch(`${API_BASE}/health`)
      if (response.ok) {
        setApiDown(false)
        setApiErrorMessage('')
        setApiBannerDismissed(false)
      } else {
        setApiDown(true)
        setApiErrorMessage('API returned error')
      }
    } catch (err) {
      setApiDown(true)
      setApiErrorMessage(err?.message || 'Unable to connect')
    } finally {
      setApiChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  // Opportunity management
  const toggleBookmark = (id) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const addApplication = (id) => {
    if (!applications.find((a) => a.opp_id === id)) {
      setApplications((prev) => [
        ...prev,
        { opp_id: id, status: 'Applied', date: new Date().toLocaleDateString() }
      ])
    }
  }

  const updateApplicationStatus = (id, status) => {
    setApplications((prev) =>
      prev.map((a) => (a.opp_id === id ? { ...a, status } : a))
    )
  }

  const removeApplication = (id) => {
    setApplications((prev) => prev.filter((a) => a.opp_id !== id))
  }

  // RSVP management
  const toggleRsvp = (id) => {
    setRsvps((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <Layout 
      apiDown={apiDown} 
      apiChecking={apiChecking}
      apiErrorMessage={apiErrorMessage}
      apiBannerDismissed={apiBannerDismissed}
      onRetryApi={checkHealth}
      onDismissApiBanner={() => setApiBannerDismissed(true)}
      user={user} 
      onLogout={handleLogout}
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Landing
              opportunities={opportunities}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} mode="student" />} />
        <Route path="/admin-login" element={<Login onLogin={handleLogin} mode="admin" />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated Routes */}
        <Route
          path="/opportunities"
          element={
            <Opportunities
              opportunities={opportunities}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              addApplication={addApplication}
            />
          }
        />
        <Route
          path="/opportunity/:id"
          element={
            <OpportunityDetail
              opportunities={opportunities}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              addApplication={addApplication}
              user={user}
            />
          }
        />
        <Route path="/resume-builder" element={<ResumeBuilder user={user} />} />
        <Route
          path="/tracker"
          element={
            <Tracker
              applications={applications}
              addApplication={addApplication}
              updateApplicationStatus={updateApplicationStatus}
              removeApplication={removeApplication}
            />
          }
        />
        <Route path="/hostel-finder" element={<HostelFinder />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route
          path="/study-materials"
          element={<StudyMaterials materials={[]} addMaterial={() => {}} refreshMaterials={() => {}} />}
        />
        <Route path="/events" element={<Events rsvps={rsvps} toggleRsvp={toggleRsvp} />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminOnlyRoute user={user}>
              <Admin
                opportunities={opportunities}
                setOpportunities={setOpportunities}
                applications={applications}
              />
            </AdminOnlyRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
