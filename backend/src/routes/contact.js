import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
)

const Contact =
  mongoose.models.Contact || mongoose.model('Contact', contactSchema)

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable. Start MongoDB or check MONGODB_URI.',
    })
  }

  try {
    const entry = await Contact.create({ name, email, subject, message })
    res.status(201).json({ success: true, id: entry._id })
  } catch {
    res.status(500).json({ error: 'Failed to save message' })
  }
})

router.get('/', async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database unavailable' })
  }

  try {
    const messages = await Contact.find().sort({ createdAt: -1 }).limit(50)
    res.json(messages)
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

export default router
