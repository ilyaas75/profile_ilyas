import Project from '../models/Project.js'
import { defaultProjects } from '../data/defaultProjects.js'

export async function seedProjectsIfEmpty() {
  try {
    const count = await Project.countDocuments()
    if (count === 0) {
      await Project.insertMany(defaultProjects)
      console.log('Default projects seeded')
    }
  } catch (err) {
    console.warn('Project seed skipped:', err.message)
  }
}
