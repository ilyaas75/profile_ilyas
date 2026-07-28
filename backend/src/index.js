import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import contactRoutes from './routes/contact.js'
import profileRoutes from './routes/profile.js'
import projectRoutes from './routes/projects.js'
import { seedProfileIfEmpty } from './seed/seedProfile.js'
import { seedProjectsIfEmpty } from './seed/seedProjects.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/profile_ilyas'

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
]

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(null, true)
      }
    },
  }),
)
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Ilyas Hassan Mohamed API is running',
    stack: ['Node.js', 'Express', 'MongoDB'],
  })
})

app.use('/api/contact', contactRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/projects', projectRoutes)

async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')
    await seedProfileIfEmpty()
    await seedProjectsIfEmpty()
  } catch (err) {
    console.warn('MongoDB not connected — API runs without database:', err.message)
  }

  const server = app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `Port ${PORT} is already in use. Stop the other process or set PORT in .env (e.g. PORT=5001)`,
      )
      process.exit(1)
    }
    throw err
  })
}

start()
