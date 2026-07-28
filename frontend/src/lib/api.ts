import type { Profile, ProfileDocument, Project, ProjectDocument } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
  getPrimary: () => request<ProfileDocument>('/api/profile?primary=true'),

  getAll: () => request<ProfileDocument[]>('/api/profile'),

  getById: (id: string) => request<ProfileDocument>(`/api/profile/${id}`),

  create: (profile: Profile) =>
    request<ProfileDocument>('/api/profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),

  update: (id: string, profile: Partial<Profile>) =>
    request<ProfileDocument>(`/api/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    }),

  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/profile/${id}`, {
      method: 'DELETE',
    }),

  seedDefault: () =>
    request<ProfileDocument>('/api/profile/seed/default', { method: 'POST' }),

  uploadAvatar: async (id: string, file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await fetch(`${API_URL}/api/profile/${id}/avatar`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data as ProfileDocument
  },

  removeAvatar: (id: string) =>
    request<ProfileDocument>(`/api/profile/${id}/avatar`, { method: 'DELETE' }),
}

export const projectsApi = {
  getAll: (includeUnpublished = false) =>
    request<ProjectDocument[]>(
      includeUnpublished ? '/api/projects?all=true' : '/api/projects',
    ),

  getById: (id: string) => request<ProjectDocument>(`/api/projects/${id}`),

  create: (project: Project) =>
    request<ProjectDocument>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),

  update: (id: string, project: Partial<Project>) =>
    request<ProjectDocument>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }),

  delete: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  seedDefault: () =>
    request<ProjectDocument[]>('/api/projects/seed/default', { method: 'POST' }),

  uploadImage: async (id: string, file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch(`${API_URL}/api/projects/${id}/image`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data as ProjectDocument
  },

  removeImage: (id: string) =>
    request<ProjectDocument>(`/api/projects/${id}/image`, { method: 'DELETE' }),
}
