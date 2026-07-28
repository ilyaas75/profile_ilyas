import express from 'express'
import mongoose from 'mongoose'
import Profile from '../models/Profile.js'
import { defaultProfile } from '../data/defaultProfile.js'
import { deleteAvatarFile, uploadAvatar } from '../middleware/upload.js'

const router = express.Router()

function dbReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: 'Database unavailable. Start MongoDB or check MONGODB_URI.' })
    return false
  }
  return true
}

/** GET /api/profile — list all, or ?primary=true for the active portfolio profile */
router.get('/', async (req, res) => {
  if (!dbReady(res)) return

  try {
    if (req.query.primary === 'true') {
      let profile = await Profile.findOne({ isPrimary: true }).sort({ updatedAt: -1 })
      if (!profile) {
        profile = await Profile.findOne().sort({ createdAt: -1 })
      }
      if (!profile) {
        return res.status(404).json({ error: 'No profile found. Create one via POST /api/profile' })
      }
      return res.json(profile)
    }

    const profiles = await Profile.find().sort({ isPrimary: -1, updatedAt: -1 })
    res.json(profiles)
  } catch {
    res.status(500).json({ error: 'Failed to fetch profiles' })
  }
})

/** POST /api/profile/seed/default — seed default profile if collection is empty */
router.post('/seed/default', async (req, res) => {
  if (!dbReady(res)) return

  try {
    const count = await Profile.countDocuments()
    if (count > 0) {
      return res.status(409).json({ error: 'Profiles already exist. Seed skipped.' })
    }
    const profile = await Profile.create(defaultProfile)
    res.status(201).json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to seed profile' })
  }
})

/** GET /api/profile/:id */
router.get('/:id', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid profile id' })
  }

  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) return res.status(404).json({ error: 'Profile not found' })
    res.json(profile)
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

/** POST /api/profile — create */
router.post('/', async (req, res) => {
  if (!dbReady(res)) return

  const { name, title, tagline, email } = req.body
  if (!name?.trim() || !title?.trim() || !tagline?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'name, title, tagline, and email are required' })
  }

  try {
    if (req.body.isPrimary) {
      await Profile.updateMany({}, { isPrimary: false })
    }

    const profile = await Profile.create(req.body)
    res.status(201).json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create profile' })
  }
})

/** PUT /api/profile/:id — update */
router.put('/:id', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid profile id' })
  }

  try {
    if (req.body.isPrimary) {
      await Profile.updateMany({ _id: { $ne: req.params.id } }, { isPrimary: false })
    }

    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!profile) return res.status(404).json({ error: 'Profile not found' })
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update profile' })
  }
})

/** POST /api/profile/:id/avatar — upload profile image */
router.post('/:id/avatar', uploadAvatar.single('avatar'), async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid profile id' })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided. Use field name "avatar".' })
  }

  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) return res.status(404).json({ error: 'Profile not found' })

    deleteAvatarFile(profile.avatar)
    profile.avatar = `/uploads/${req.file.filename}`
    await profile.save()
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to upload avatar' })
  }
})

/** DELETE /api/profile/:id/avatar — remove profile image */
router.delete('/:id/avatar', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid profile id' })
  }

  try {
    const profile = await Profile.findById(req.params.id)
    if (!profile) return res.status(404).json({ error: 'Profile not found' })

    deleteAvatarFile(profile.avatar)
    profile.avatar = ''
    await profile.save()
    res.json(profile)
  } catch {
    res.status(500).json({ error: 'Failed to remove avatar' })
  }
})

/** DELETE /api/profile/:id */
router.delete('/:id', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid profile id' })
  }

  try {
    const profile = await Profile.findByIdAndDelete(req.params.id)
    if (!profile) return res.status(404).json({ error: 'Profile not found' })

    deleteAvatarFile(profile.avatar)

    if (profile.isPrimary) {
      const next = await Profile.findOne().sort({ updatedAt: -1 })
      if (next) {
        next.isPrimary = true
        await next.save()
      }
    }

    res.json({ success: true, message: 'Profile deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete profile' })
  }
})

export default router
