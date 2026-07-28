import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fallbackProjects } from '../data/projects'
import { projectsApi } from '../lib/api'
import type { Project, ProjectDocument } from '../types'

interface ProjectsContextValue {
  projects: Project[]
  projectsDoc: ProjectDocument[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projectsDoc, setProjectsDoc] = useState<ProjectDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectsApi.getAll()
      setProjectsDoc(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      setProjectsDoc([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const projects: Project[] =
    projectsDoc.length > 0 ? projectsDoc : fallbackProjects

  return (
    <ProjectsContext.Provider value={{ projects, projectsDoc, loading, error, refresh }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider')
  return ctx
}
