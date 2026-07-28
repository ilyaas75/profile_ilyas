import { profile as fallbackProfile } from '../data/profile'
import { fallbackProjects } from '../data/projects'
import type { Profile, ProfileDocument, Project, ProjectDocument } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const PROFILE_KEY = 'portfolio_local_profiles'
const PROJECTS_KEY = 'portfolio_local_projects'
const PROJECTS_VERSION_KEY = 'portfolio_projects_version'

// Bump this string whenever fallbackProjects changes to auto-clear stale localStorage
const CURRENT_PROJECTS_VERSION = `v${fallbackProjects.length}-${fallbackProjects.map((p) => p.title).join('|')}`

function clearStaleProjectsCache() {
  const stored = localStorage.getItem(PROJECTS_VERSION_KEY)
  if (stored !== CURRENT_PROJECTS_VERSION) {
    localStorage.removeItem(PROJECTS_KEY)
    localStorage.setItem(PROJECTS_VERSION_KEY, CURRENT_PROJECTS_VERSION)
  }
}

// Run on module load
try { clearStaleProjectsCache() } catch { /* ignore */ }

// ── Helpers for LocalStorage offline storage ──

function getLocalProfiles(): ProfileDocument[] {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  const defaultDoc: ProfileDocument = {
    _id: 'default-profile-id',
    ...fallbackProfile,
    isPrimary: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  saveLocalProfiles([defaultDoc])
  return [defaultDoc]
}

function saveLocalProfiles(profiles: ProfileDocument[]) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles))
  } catch {
    // ignore
  }
}

function getLocalProjects(): ProjectDocument[] {
  try {
    clearStaleProjectsCache()
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  const defaultDocs: ProjectDocument[] = fallbackProjects.map((p, idx) => ({
    _id: `project-local-${idx + 1}`,
    ...p,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
  saveLocalProjects(defaultDocs)
  return defaultDocs
}

function saveLocalProjects(projects: ProjectDocument[]) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  } catch {
    // ignore
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data as T
}

export const profileApi = {
  getPrimary: async (): Promise<ProfileDocument> => {
    try {
      const data = await request<ProfileDocument>('/api/profile?primary=true')
      return data
    } catch {
      const list = getLocalProfiles()
      return list.find((p) => p.isPrimary) || list[0]
    }
  },

  getAll: async (): Promise<ProfileDocument[]> => {
    try {
      const data = await request<ProfileDocument[]>('/api/profile')
      if (Array.isArray(data) && data.length > 0) {
        saveLocalProfiles(data)
        return data
      }
    } catch {
      // offline fallback
    }
    return getLocalProfiles()
  },

  getById: async (id: string): Promise<ProfileDocument> => {
    try {
      return await request<ProfileDocument>(`/api/profile/${id}`)
    } catch {
      const list = getLocalProfiles()
      const found = list.find((p) => p._id === id)
      if (found) return found
      throw new Error('Profile not found')
    }
  },

  create: async (profileData: Profile): Promise<ProfileDocument> => {
    try {
      const created = await request<ProfileDocument>('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      })
      return created
    } catch {
      const list = getLocalProfiles()
      const newDoc: ProfileDocument = {
        _id: `profile-${Date.now()}`,
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      if (newDoc.isPrimary) {
        list.forEach((p) => (p.isPrimary = false))
      }
      list.push(newDoc)
      saveLocalProfiles(list)
      return newDoc
    }
  },

  update: async (id: string, profileData: Partial<Profile>): Promise<ProfileDocument> => {
    try {
      return await request<ProfileDocument>(`/api/profile/${id}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      })
    } catch {
      const list = getLocalProfiles()
      const idx = list.findIndex((p) => p._id === id)
      if (idx === -1) throw new Error('Profile not found')

      if (profileData.isPrimary) {
        list.forEach((p) => (p.isPrimary = false))
      }
      list[idx] = {
        ...list[idx],
        ...profileData,
        updatedAt: new Date().toISOString(),
      }
      saveLocalProfiles(list)
      return list[idx]
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await request<{ success: boolean; message: string }>(`/api/profile/${id}`, {
        method: 'DELETE',
      })
    } catch {
      let list = getLocalProfiles()
      list = list.filter((p) => p._id !== id)
      if (list.length > 0 && !list.some((p) => p.isPrimary)) {
        list[0].isPrimary = true
      }
      saveLocalProfiles(list)
      return { success: true, message: 'Deleted locally' }
    }
  },

  seedDefault: async (): Promise<ProfileDocument> => {
    try {
      return await request<ProfileDocument>('/api/profile/seed/default', { method: 'POST' })
    } catch {
      const defaultDoc: ProfileDocument = {
        _id: `profile-default-${Date.now()}`,
        ...fallbackProfile,
        isPrimary: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const list = getLocalProfiles()
      list.forEach((p) => (p.isPrimary = false))
      list.push(defaultDoc)
      saveLocalProfiles(list)
      return defaultDoc
    }
  },

  uploadAvatar: async (id: string, file: File): Promise<ProfileDocument> => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await fetch(`${API_URL}/api/profile/${id}/avatar`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) return data as ProfileDocument
    } catch {
      // offline fallback
    }

    const base64 = await fileToBase64(file)
    return profileApi.update(id, { avatar: base64 })
  },

  removeAvatar: async (id: string): Promise<ProfileDocument> => {
    try {
      return await request<ProfileDocument>(`/api/profile/${id}/avatar`, { method: 'DELETE' })
    } catch {
      return profileApi.update(id, { avatar: '' })
    }
  },
}

export const projectsApi = {
  getAll: async (includeUnpublished = false): Promise<ProjectDocument[]> => {
    try {
      const data = await request<ProjectDocument[]>(
        includeUnpublished ? '/api/projects?all=true' : '/api/projects',
      )
      if (Array.isArray(data) && data.length > 0) {
        saveLocalProjects(data)
        return data
      }
    } catch {
      // offline fallback
    }
    const list = getLocalProjects()
    return includeUnpublished ? list : list.filter((p) => p.published !== false)
  },

  getById: async (id: string): Promise<ProjectDocument> => {
    try {
      return await request<ProjectDocument>(`/api/projects/${id}`)
    } catch {
      const list = getLocalProjects()
      const found = list.find((p) => p._id === id)
      if (found) return found
      throw new Error('Project not found')
    }
  },

  create: async (projectData: Project): Promise<ProjectDocument> => {
    try {
      return await request<ProjectDocument>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      })
    } catch {
      const list = getLocalProjects()
      const newDoc: ProjectDocument = {
        _id: `project-${Date.now()}`,
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      list.unshift(newDoc)
      saveLocalProjects(list)
      return newDoc
    }
  },

  update: async (id: string, projectData: Partial<Project>): Promise<ProjectDocument> => {
    try {
      return await request<ProjectDocument>(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      })
    } catch {
      const list = getLocalProjects()
      const idx = list.findIndex((p) => p._id === id)
      if (idx === -1) throw new Error('Project not found')
      list[idx] = {
        ...list[idx],
        ...projectData,
        updatedAt: new Date().toISOString(),
      }
      saveLocalProjects(list)
      return list[idx]
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await request<{ success: boolean; message: string }>(`/api/projects/${id}`, {
        method: 'DELETE',
      })
    } catch {
      let list = getLocalProjects()
      list = list.filter((p) => p._id !== id)
      saveLocalProjects(list)
      return { success: true, message: 'Deleted locally' }
    }
  },

  seedDefault: async (): Promise<ProjectDocument[]> => {
    try {
      return await request<ProjectDocument[]>('/api/projects/seed/default', { method: 'POST' })
    } catch {
      const defaultDocs: ProjectDocument[] = fallbackProjects.map((p, idx) => ({
        _id: `project-default-${idx + 1}-${Date.now()}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      saveLocalProjects(defaultDocs)
      return defaultDocs
    }
  },

  uploadImage: async (id: string, file: File): Promise<ProjectDocument> => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch(`${API_URL}/api/projects/${id}/image`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) return data as ProjectDocument
    } catch {
      // offline fallback
    }

    const base64 = await fileToBase64(file)
    return projectsApi.update(id, { image: base64 })
  },

  removeImage: async (id: string): Promise<ProjectDocument> => {
    try {
      return await request<ProjectDocument>(`/api/projects/${id}/image`, { method: 'DELETE' })
    } catch {
      return projectsApi.update(id, { image: '📁' })
    }
  },
}
