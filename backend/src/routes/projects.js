import express from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'
import { defaultProjects } from '../data/defaultProjects.js'
import { deleteUploadFile, uploadProjectImage } from '../middleware/upload.js'

const router = express.Router()

function dbReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ error: 'Database unavailable. Start MongoDB or check MONGODB_URI.' })
    return false
  }
  return true
}

/** GET /api/projects — list published projects (public) */
router.get('/', async (req, res) => {
  if (!dbReady(res)) return

  try {
    const query = req.query.all === 'true' ? {} : { published: true }
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })
    res.json(projects)
  } catch {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

/** POST /api/projects/seed/default */
router.post('/seed/default', async (req, res) => {
  if (!dbReady(res)) return

  try {
    const count = await Project.countDocuments()
    if (count > 0) {
      return res.status(409).json({ error: 'Projects already exist. Seed skipped.' })
    }
    const projects = await Project.insertMany(defaultProjects)
    res.status(201).json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to seed projects' })
  }
})

/** GET /api/projects/:id */
router.get('/:id', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid project id' })
  }

  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch {
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

/** POST /api/projects */
router.post('/', async (req, res) => {
  if (!dbReady(res)) return

  const { title, description, githubLink } = req.body
  if (!title?.trim() || !description?.trim() || !githubLink?.trim()) {
    return res.status(400).json({ error: 'title, description, and githubLink are required' })
  }

  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create project' })
  }
})

/** PUT /api/projects/:id */
router.put('/:id', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid project id' })
  }

  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update project' })
  }
})

/** POST /api/projects/:id/image — upload project image */
router.post('/:id/image', uploadProjectImage.single('image'), async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid project id' })
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided. Use field name "image".' })
  }

  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    deleteUploadFile(project.image)
    project.image = `/uploads/${req.file.filename}`
    await project.save()
    res.json(project)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to upload image' })
  }
})

/** DELETE /api/projects/:id/image */
router.delete('/:id/image', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid project id' })
  }

  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    deleteUploadFile(project.image)
    project.image = '📁'
    await project.save()
    res.json(project)
  } catch {
    res.status(500).json({ error: 'Failed to remove image' })
  }
})

/** DELETE /api/projects/:id */
router.delete('/:id', async (req, res) => {
  if (!dbReady(res)) return

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid project id' })
  }

  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })

    deleteUploadFile(project.image)
    res.json({ success: true, message: 'Project deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete project' })
  }
})

export default router
