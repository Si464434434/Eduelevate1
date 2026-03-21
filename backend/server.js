import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Support env files from both backend/.env and project-root/.env.
dotenv.config({ path: path.resolve(__dirname, '.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000
const isVercel = Boolean(process.env.VERCEL)
const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.DATABASE_URL ||
  ''
const useDb = Boolean(mongoUri)
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production'
const distPath = path.resolve(__dirname, '../dist')

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV === 'production' && !isVercel) {
  app.use(express.static(distPath))
}

const opportunitiesSeed = [
  { id: 'op1', title: 'Frontend Intern', type: 'Internship', org: 'CodeSpark', location: 'Remote', deadline: '2026-04-15', stipend: '₹15,000/month', description: 'Work on React UI and performance optimization.' },
  { id: 'op2', title: 'AI Scholarship 2026', type: 'Scholarship', org: 'FutureMinds Foundation', location: 'India', deadline: '2026-03-30', stipend: '₹1,00,000 grant', description: 'Scholarship for AI/ML students with strong project portfolio.' },
  { id: 'op3', title: 'National Hack Sprint', type: 'Hackathon', org: 'HackNation', location: 'Bangalore', deadline: '2026-05-01', stipend: 'Prize pool ₹5,00,000', description: '48-hour hackathon focused on climate tech and social impact.' },
  { id: 'op4', title: 'Backend Intern', type: 'Internship', org: 'CloudNova', location: 'Pune', deadline: '2026-04-20', stipend: '₹18,000/month', description: 'Build APIs, write tests, and work with cloud deployments.' },
  { id: 'op5', title: 'Women in STEM Scholarship', type: 'Scholarship', org: 'RiseTogether', location: 'Pan India', deadline: '2026-06-10', stipend: '₹75,000 grant', description: 'Support for women pursuing engineering and research careers.' },
  { id: 'op6', title: 'Campus Innovate Challenge', type: 'Hackathon', org: 'TechBridge', location: 'Delhi', deadline: '2026-05-22', stipend: 'Top 3 internships + rewards', description: 'Build campus-focused products and pitch to industry mentors.' }
]

let users = []
let opportunities = [...opportunitiesSeed]
const applications = []
const bookmarksByEmail = {}
const materials = []
const eventRsvpsByEmail = {}
const resumesByEmail = {}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true })

const opportunitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  org: { type: String, required: true },
  location: { type: String, default: 'TBD' },
  deadline: { type: String, default: '' },
  stipend: { type: String, default: '' },
  description: { type: String, default: '' }
}, { timestamps: true })

const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  title: { type: String, required: true },
  org: { type: String, required: true },
  status: { type: String, default: 'Applied' },
  date: { type: String, required: true }
}, { timestamps: true })

const materialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  stream: { type: String, required: true },
  semester: { type: String, required: true },
  link: { type: String, default: '' }
}, { timestamps: true })

const profileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  bookmarks: { type: [String], default: [] },
  eventRsvps: { type: [String], default: [] },
  resume: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: { type: String, default: '' },
    education: { type: String, default: '' },
    projects: { type: String, default: '' }
  }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)
const Opportunity = mongoose.models.Opportunity || mongoose.model('Opportunity', opportunitySchema)
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema)
const Material = mongoose.models.Material || mongoose.model('Material', materialSchema)
const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema)

let dataReadyPromise
let mongoConnectPromise

const createToken = (user) => jwt.sign(
  { id: user.id || user._id?.toString(), email: user.email, role: user.role, name: user.name },
  JWT_SECRET,
  { expiresIn: '7d' }
)

const parseAuthToken = (req) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) return ''
  return header.slice(7)
}

const requireAuth = (req, res, next) => {
  const token = parseAuthToken(req)
  if (!token) return res.status(401).json({ message: 'Missing auth token' })

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  return next()
}

const ensureMongoConnected = async () => {
  if (!useDb) return
  if (mongoose.connection.readyState === 1) return
  if (!mongoConnectPromise) {
    mongoConnectPromise = mongoose.connect(mongoUri)
  }
  await mongoConnectPromise
}

const ensureSeedData = async () => {
  if (useDb) {
    await ensureMongoConnected()

    const [studentExists, adminExists] = await Promise.all([
      User.exists({ email: 'student@test.com' }),
      User.exists({ email: 'admin@test.com' })
    ])

    if (!studentExists) {
      await User.create({
        name: 'Student Demo',
        email: 'student@test.com',
        passwordHash: await bcrypt.hash('pass123', 10),
        role: 'student'
      })
    }

    if (!adminExists) {
      await User.create({
        name: 'Admin Demo',
        email: 'admin@test.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'admin'
      })
    }

    const dbOpCount = await Opportunity.countDocuments()
    if (!dbOpCount) {
      await Opportunity.insertMany(opportunitiesSeed)
    }

    return
  }

  if (!users.length) {
    users = [
      { id: 'u1', name: 'Student Demo', email: 'student@test.com', passwordHash: await bcrypt.hash('pass123', 10), role: 'student' },
      { id: 'u2', name: 'Admin Demo', email: 'admin@test.com', passwordHash: await bcrypt.hash('admin123', 10), role: 'admin' }
    ]
  }
}

const ensureDataReady = async () => {
  if (!dataReadyPromise) {
    dataReadyPromise = ensureSeedData().catch((err) => {
      dataReadyPromise = undefined
      throw err
    })
  }
  await dataReadyPromise
}

app.use((req, res, next) => {
  ensureDataReady().then(() => next()).catch(next)
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'eduelevate-backend', database: useDb ? 'mongodb' : 'in-memory' })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  const normalizedEmail = String(email || '').toLowerCase().trim()

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  const user = useDb
    ? await User.findOne({ email: normalizedEmail }).lean()
    : users.find((u) => u.email === normalizedEmail)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const matched = await bcrypt.compare(password, user.passwordHash)
  if (!matched) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  res.json({
    user: {
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: createToken(user)
  })
})

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {}
  const normalizedEmail = String(email || '').toLowerCase().trim()

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ message: 'name, email, password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  if (useDb) {
    const exists = await User.exists({ email: normalizedEmail })
    if (exists) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const created = await User.create({
      name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'student'
    })

    return res.status(201).json({
      user: { id: created._id.toString(), name: created.name, email: created.email, role: created.role }
    })
  }

  if (users.some((u) => u.email === normalizedEmail)) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'student'
  }

  users.push(newUser)

  return res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
  })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  })
})

app.get('/api/opportunities', async (req, res) => {
  const { q = '', type = 'All' } = req.query
  const keyword = String(q).toLowerCase()

  const source = useDb ? await Opportunity.find().lean() : opportunities
  const filtered = source.filter((item) => {
    const hit = `${item.title} ${item.org} ${item.description}`.toLowerCase().includes(keyword)
    const typeHit = type === 'All' || item.type === type
    return hit && typeHit
  })

  res.json(filtered)
})

app.get('/api/opportunities/:id', async (req, res) => {
  const found = useDb
    ? await Opportunity.findOne({ id: req.params.id }).lean()
    : opportunities.find((o) => o.id === req.params.id)

  if (!found) return res.status(404).json({ message: 'Opportunity not found' })
  res.json(found)
})

app.post('/api/opportunities', requireAuth, requireAdmin, async (req, res) => {
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

  if (useDb) {
    await Opportunity.create(created)
  } else {
    opportunities.unshift(created)
  }

  res.status(201).json(created)
})

app.get('/api/bookmarks', requireAuth, async (req, res) => {
  const email = req.user.email

  if (useDb) {
    const profile = await Profile.findOne({ email }).lean()
    return res.json(profile?.bookmarks || [])
  }

  return res.json(bookmarksByEmail[email] || [])
})

app.post('/api/bookmarks/toggle', requireAuth, async (req, res) => {
  const email = req.user.email
  const { opportunityId } = req.body || {}
  if (!opportunityId) {
    return res.status(400).json({ message: 'opportunityId is required' })
  }

  if (useDb) {
    const profile = await Profile.findOneAndUpdate(
      { email },
      { $setOnInsert: { email } },
      { new: true, upsert: true }
    )

    const hasBookmark = profile.bookmarks.includes(opportunityId)
    profile.bookmarks = hasBookmark
      ? profile.bookmarks.filter((id) => id !== opportunityId)
      : [...profile.bookmarks, opportunityId]

    await profile.save()
    return res.json(profile.bookmarks)
  }

  const current = bookmarksByEmail[email] || []
  bookmarksByEmail[email] = current.includes(opportunityId)
    ? current.filter((id) => id !== opportunityId)
    : [...current, opportunityId]

  return res.json(bookmarksByEmail[email])
})

app.get('/api/applications', requireAuth, async (req, res) => {
  const email = req.user.email

  if (useDb) {
    const items = await Application.find({ email }).sort({ createdAt: -1 }).lean()
    return res.json(items)
  }

  return res.json(applications.filter((a) => a.email === email))
})

app.post('/api/applications', requireAuth, async (req, res) => {
  const payload = req.body || {}
  const email = req.user.email

  if (!payload.title || !payload.org) {
    return res.status(400).json({ message: 'title and org are required' })
  }

  const appItem = {
    id: `app_${Date.now()}`,
    email,
    status: 'Applied',
    date: new Date().toISOString().slice(0, 10),
    ...payload
  }

  appItem.email = email

  if (useDb) {
    await Application.create(appItem)
  } else {
    applications.unshift(appItem)
  }

  return res.status(201).json(appItem)
})

app.patch('/api/applications/:id', requireAuth, async (req, res) => {
  const email = req.user.email

  if (useDb) {
    const updated = await Application.findOneAndUpdate(
      { id: req.params.id, email },
      { $set: req.body || {} },
      { new: true }
    ).lean()

    if (!updated) return res.status(404).json({ message: 'Application not found' })
    return res.json(updated)
  }

  const idx = applications.findIndex((a) => a.id === req.params.id && a.email === email)
  if (idx === -1) return res.status(404).json({ message: 'Application not found' })

  applications[idx] = { ...applications[idx], ...req.body }
  return res.json(applications[idx])
})

app.delete('/api/applications/:id', requireAuth, async (req, res) => {
  const email = req.user.email

  if (useDb) {
    const result = await Application.deleteOne({ id: req.params.id, email })
    if (!result.deletedCount) return res.status(404).json({ message: 'Application not found' })
    return res.status(204).send()
  }

  const idx = applications.findIndex((a) => a.id === req.params.id && a.email === email)
  if (idx === -1) return res.status(404).json({ message: 'Application not found' })

  applications.splice(idx, 1)
  return res.status(204).send()
})

app.get('/api/materials', async (req, res) => {
  const { stream = 'All', semester = 'All' } = req.query

  const source = useDb ? await Material.find().lean() : materials
  const filtered = source.filter(
    (m) => (stream === 'All' || m.stream === stream) && (semester === 'All' || m.semester === semester)
  )
  res.json(filtered)
})

app.post('/api/materials', requireAuth, requireAdmin, async (req, res) => {
  const payload = req.body || {}
  if (!payload.title || !payload.stream || !payload.semester) {
    return res.status(400).json({ message: 'title, stream, semester are required' })
  }

  const entry = { id: `mat_${Date.now()}`, ...payload }
  if (useDb) {
    await Material.create(entry)
  } else {
    materials.unshift(entry)
  }

  return res.status(201).json(entry)
})

app.get('/api/events/rsvp', requireAuth, async (req, res) => {
  const email = req.user.email

  if (useDb) {
    const profile = await Profile.findOne({ email }).lean()
    return res.json(profile?.eventRsvps || [])
  }

  return res.json(eventRsvpsByEmail[email] || [])
})

app.post('/api/events/rsvp/toggle', requireAuth, async (req, res) => {
  const email = req.user.email
  const { eventId } = req.body || {}
  if (!eventId) {
    return res.status(400).json({ message: 'eventId is required' })
  }

  if (useDb) {
    const profile = await Profile.findOneAndUpdate(
      { email },
      { $setOnInsert: { email } },
      { new: true, upsert: true }
    )

    const hasRsvp = profile.eventRsvps.includes(eventId)
    profile.eventRsvps = hasRsvp
      ? profile.eventRsvps.filter((id) => id !== eventId)
      : [...profile.eventRsvps, eventId]

    await profile.save()
    return res.json(profile.eventRsvps)
  }

  const current = eventRsvpsByEmail[email] || []
  eventRsvpsByEmail[email] = current.includes(eventId)
    ? current.filter((id) => id !== eventId)
    : [...current, eventId]

  return res.json(eventRsvpsByEmail[email])
})

app.get('/api/resume', requireAuth, async (req, res) => {
  const email = req.user.email

  if (useDb) {
    const profile = await Profile.findOne({ email }).lean()
    return res.json(
      profile?.resume || {
        name: '',
        email,
        phone: '',
        summary: '',
        skills: '',
        education: '',
        projects: ''
      }
    )
  }

  return res.json(
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

app.post('/api/resume', requireAuth, async (req, res) => {
  const payload = req.body || {}
  const email = req.user.email

  const resumePayload = {
    name: payload.name || '',
    email,
    phone: payload.phone || '',
    summary: payload.summary || '',
    skills: payload.skills || '',
    education: payload.education || '',
    projects: payload.projects || ''
  }

  if (useDb) {
    const profile = await Profile.findOneAndUpdate(
      { email },
      { $setOnInsert: { email }, $set: { resume: resumePayload } },
      { new: true, upsert: true }
    ).lean()

    return res.status(201).json(profile.resume)
  }

  resumesByEmail[email] = {
    ...resumePayload
  }

  return res.status(201).json(resumesByEmail[email])
})

if (process.env.NODE_ENV === 'production' && !isVercel) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`EduElevate backend running on http://127.0.0.1:${PORT}`)
    console.log(`Database mode: ${useDb ? 'mongodb' : 'in-memory'}`)
    if (!useDb) {
      console.log('MongoDB env not found. Set MONGODB_URI (or MONGO_URI) in backend/.env or project .env')
    }
  })
}

app.use((err, req, res, next) => {
  const message = err?.message || 'Server error'
  res.status(500).json({ message })
})

export default app
