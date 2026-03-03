import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../dist')

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath))
}

const users = [
  { id: 1, name: 'Student Demo', email: 'student@test.com', password: 'pass123', role: 'student' },
  { id: 2, name: 'Admin Demo', email: 'admin@test.com', password: 'admin123', role: 'admin' }
]

const opportunities = [
  { id: 'op1', title: 'Frontend Intern', type: 'Internship', org: 'CodeSpark', location: 'Remote', deadline: '2026-04-15', stipend: '₹15,000/month', description: 'Work on React UI and performance optimization.' },
  { id: 'op2', title: 'AI Scholarship 2026', type: 'Scholarship', org: 'FutureMinds Foundation', location: 'India', deadline: '2026-03-30', stipend: '₹1,00,000 grant', description: 'Scholarship for AI/ML students with strong project portfolio.' },
  { id: 'op3', title: 'National Hack Sprint', type: 'Hackathon', org: 'HackNation', location: 'Bangalore', deadline: '2026-05-01', stipend: 'Prize pool ₹5,00,000', description: '48-hour hackathon focused on climate tech and social impact.' },
  { id: 'op4', title: 'Backend Intern', type: 'Internship', org: 'CloudNova', location: 'Pune', deadline: '2026-04-20', stipend: '₹18,000/month', description: 'Build APIs, write tests, and work with cloud deployments.' },
  { id: 'op5', title: 'Women in STEM Scholarship', type: 'Scholarship', org: 'RiseTogether', location: 'Pan India', deadline: '2026-06-10', stipend: '₹75,000 grant', description: 'Support for women pursuing engineering and research careers.' },
  { id: 'op6', title: 'Campus Innovate Challenge', type: 'Hackathon', org: 'TechBridge', location: 'Delhi', deadline: '2026-05-22', stipend: 'Top 3 internships + rewards', description: 'Build campus-focused products and pitch to industry mentors.' }
]

const applications = []
const bookmarksByEmail = {}
const materials = []
const eventRsvpsByEmail = {}
const resumesByEmail = {}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'eduelevate-backend' })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: `demo-token-${user.id}`
  })
})

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, password are required' })
  }

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: 'student'
  }

  users.push(newUser)

  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  })
})

app.get('/api/opportunities', (req, res) => {
  const { q = '', type = 'All' } = req.query
  const keyword = String(q).toLowerCase()

  const filtered = opportunities.filter((item) => {
    const hit = `${item.title} ${item.org} ${item.description}`.toLowerCase().includes(keyword)
    const typeHit = type === 'All' || item.type === type
    return hit && typeHit
  })

  res.json(filtered)
})

app.get('/api/opportunities/:id', (req, res) => {
  const found = opportunities.find((o) => o.id === req.params.id)
  if (!found) return res.status(404).json({ message: 'Opportunity not found' })
  res.json(found)
})

app.post('/api/opportunities', (req, res) => {
  const payload = req.body || {}
  if (!payload.title || !payload.type || !payload.org) {
    return res.status(400).json({ message: 'title, type, org are required' })
  }

  const created = {
    id: `op_${Date.now()}`,
    location: payload.location || 'TBD',
    deadline: payload.deadline || '',
    stipend: payload.stipend || '',
    description: payload.description || '',
    ...payload
  }

  opportunities.unshift(created)
  res.status(201).json(created)
})

app.get('/api/bookmarks', (req, res) => {
  const email = String(req.query.email || '')
  res.json(bookmarksByEmail[email] || [])
})

app.post('/api/bookmarks/toggle', (req, res) => {
  const { email, opportunityId } = req.body || {}
  if (!email || !opportunityId) {
    return res.status(400).json({ message: 'email and opportunityId are required' })
  }

  const current = bookmarksByEmail[email] || []
  bookmarksByEmail[email] = current.includes(opportunityId)
    ? current.filter((id) => id !== opportunityId)
    : [...current, opportunityId]

  res.json(bookmarksByEmail[email])
})

app.get('/api/applications', (req, res) => {
  const email = String(req.query.email || '')
  res.json(applications.filter((a) => a.email === email || !email))
})

app.post('/api/applications', (req, res) => {
  const payload = req.body || {}

  if (!payload.title || !payload.org) {
    return res.status(400).json({ message: 'title and org are required' })
  }

  const appItem = {
    id: `app_${Date.now()}`,
    status: 'Applied',
    date: new Date().toISOString().slice(0, 10),
    ...payload
  }

  applications.unshift(appItem)
  res.status(201).json(appItem)
})

app.patch('/api/applications/:id', (req, res) => {
  const idx = applications.findIndex((a) => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Application not found' })

  applications[idx] = { ...applications[idx], ...req.body }
  res.json(applications[idx])
})

app.delete('/api/applications/:id', (req, res) => {
  const idx = applications.findIndex((a) => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Application not found' })

  applications.splice(idx, 1)
  res.status(204).send()
})

app.get('/api/materials', (req, res) => {
  const { stream = 'All', semester = 'All' } = req.query
  const filtered = materials.filter(
    (m) => (stream === 'All' || m.stream === stream) && (semester === 'All' || m.semester === semester)
  )
  res.json(filtered)
})

app.post('/api/materials', (req, res) => {
  const payload = req.body || {}
  if (!payload.title || !payload.stream || !payload.semester) {
    return res.status(400).json({ message: 'title, stream, semester are required' })
  }

  const entry = { id: `mat_${Date.now()}`, ...payload }
  materials.unshift(entry)
  res.status(201).json(entry)
})

app.get('/api/events/rsvp', (req, res) => {
  const email = String(req.query.email || '')
  res.json(eventRsvpsByEmail[email] || [])
})

app.post('/api/events/rsvp/toggle', (req, res) => {
  const { email, eventId } = req.body || {}
  if (!email || !eventId) {
    return res.status(400).json({ message: 'email and eventId are required' })
  }

  const current = eventRsvpsByEmail[email] || []
  eventRsvpsByEmail[email] = current.includes(eventId)
    ? current.filter((id) => id !== eventId)
    : [...current, eventId]

  res.json(eventRsvpsByEmail[email])
})

app.get('/api/resume', (req, res) => {
  const email = String(req.query.email || '')
  res.json(
    resumesByEmail[email] || {
      name: '',
      email,
      phone: '',
      summary: '',
      skills: '',
      education: '',
      projects: ''
    }
  )
})

app.post('/api/resume', (req, res) => {
  const payload = req.body || {}
  const email = String(payload.email || '')

  if (!email) {
    return res.status(400).json({ message: 'email is required' })
  }

  resumesByEmail[email] = {
    name: payload.name || '',
    email,
    phone: payload.phone || '',
    summary: payload.summary || '',
    skills: payload.skills || '',
    education: payload.education || '',
    projects: payload.projects || ''
  }

  res.status(201).json(resumesByEmail[email])
})

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`EduElevate backend running on http://127.0.0.1:${PORT}`)
})
