import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, FolderKanban } from 'lucide-react'
import { ProjectImage } from '../components/ProjectCard'
import { ThemeToggle } from '../context/ThemeContext'
import { useProjects } from '../context/ProjectsContext'
import { projectsApi } from '../lib/api'
import { getProjectImageUrl, isProjectImageUrl } from '../lib/projectImage'
import type { Project, ProjectCategory, ProjectDocument } from '../types'

const categories: ProjectCategory[] = ['Web', 'Backend', 'Mobile', 'Full-Stack']

const emptyProject = (): Project => ({
  title: '',
  description: '',
  image: '📁',
  tech: [],
  githubLink: '',
  category: 'Web',
  stats: '',
  order: 0,
  published: true,
})

export function AdminProjectsPage() {
  const { refresh } = useProjects()
  const [projects, setProjects] = useState<ProjectDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Project>(emptyProject())
  const [techText, setTechText] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await projectsApi.getAll(true)
      setProjects(data)
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Failed to load projects' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const resetForm = () => {
    setEditingId(null)
    setShowForm(false)
    setForm(emptyProject())
    setTechText('')
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  const startCreate = () => {
    resetForm()
    setShowForm(true)
    setForm({ ...emptyProject(), order: projects.length + 1 })
  }

  const startEdit = (doc: ProjectDocument) => {
    setShowForm(true)
    setEditingId(doc._id)
    setForm({
      title: doc.title,
      description: doc.description,
      image: doc.image,
      tech: doc.tech,
      githubLink: doc.githubLink,
      category: doc.category,
      stats: doc.stats || '',
      order: doc.order ?? 0,
      published: doc.published ?? true,
    })
    setTechText(doc.tech.join(', '))
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImagePreview(isProjectImageUrl(doc.image) ? doc.image : null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'err', text: 'Please select an image file (JPG, PNG, WebP, GIF)' })
      return
    }

    const blobUrl = URL.createObjectURL(file)
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImagePreview(blobUrl)

    if (!editingId) {
      setMessage({ type: 'err', text: 'Save the project first, then upload an image.' })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const updated = await projectsApi.uploadImage(editingId, file)
      setForm((prev) => ({ ...prev, image: updated.image }))
      URL.revokeObjectURL(blobUrl)
      setImagePreview(updated.image)
      await loadProjects()
      await refresh()
      setMessage({ type: 'ok', text: 'Project image updated!' })
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = async () => {
    if (editingId && isProjectImageUrl(form.image)) {
      try {
        await projectsApi.removeImage(editingId)
        setForm((prev) => ({ ...prev, image: '📁' }))
        if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
        await loadProjects()
        await refresh()
        setMessage({ type: 'ok', text: 'Image removed' })
      } catch (err) {
        setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Remove failed' })
      }
      return
    }
    if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setForm((prev) => ({ ...prev, image: '📁' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)

    const payload: Project = {
      ...form,
      tech: techText.split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      if (editingId) {
        await projectsApi.update(editingId, payload)
        setMessage({ type: 'ok', text: 'Project updated — visible on Projects page.' })
      } else {
        const created = await projectsApi.create(payload)
        setEditingId(created._id)
        setMessage({ type: 'ok', text: 'Project created! You can now upload an image.' })
      }
      await loadProjects()
      await refresh()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete project "${title}"?`)) return
    setMessage(null)
    try {
      await projectsApi.delete(id)
      if (editingId === id) resetForm()
      setMessage({ type: 'ok', text: 'Project deleted' })
      await loadProjects()
      await refresh()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Delete failed' })
    }
  }

  const handleSeed = async () => {
    setMessage(null)
    try {
      await projectsApi.seedDefault()
      setMessage({ type: 'ok', text: 'Default projects loaded' })
      await loadProjects()
      await refresh()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Seed failed' })
    }
  }

  const previewSrc = imagePreview?.startsWith('blob:')
    ? imagePreview
    : getProjectImageUrl(form.image)

  return (
    <div className="min-h-screen bg-theme-page pt-20 pb-16 transition-colors duration-300">
      <div className="section-container max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/admin/dashboard" className="mb-2 inline-block text-xs text-accent-teal hover:underline">
              ← Admin dashboard
            </Link>
            <h1 className="font-display text-3xl font-bold text-theme-primary">
              Manage <span className="gradient-text">Projects</span>
            </h1>
            <p className="mt-1 text-sm text-theme-muted">
              Add, edit, or delete projects — image, GitHub link, and technologies.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/projects" className="btn-outline flex items-center gap-1.5 text-sm">
              <ExternalLink size={14} />
              View Projects page
            </Link>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'ok'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-500'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          <button type="button" onClick={startCreate} className="btn-primary text-sm">
            + Add Project
          </button>
          <button type="button" onClick={handleSeed} className="btn-outline text-sm">
            Load Default Projects
          </button>
          <button type="button" onClick={loadProjects} className="btn-outline text-sm">
            Refresh
          </button>
        </div>

        <div className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-theme-primary">
            All Projects ({projects.length})
          </h2>
          {loading ? (
            <p className="text-theme-muted">Loading...</p>
          ) : projects.length === 0 ? (
            <div className="theme-card p-6 text-center">
              <FolderKanban className="mx-auto mb-3 text-accent-teal" size={32} />
              <p className="text-theme-muted">No projects yet. Click &quot;+ Add Project&quot; or &quot;Load Default&quot;.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p._id}
                  className={`theme-card card-hover flex flex-wrap items-center justify-between gap-3 p-4 ${
                    editingId === p._id ? 'ring-1 ring-accent-teal/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isProjectImageUrl(p.image) ? (
                      <ProjectImage
                        image={p.image}
                        title={p.title}
                        className="h-12 w-12 rounded-lg object-cover"
                        emojiClass="text-2xl"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-2xl">
                        {p.image}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-theme-primary">
                        {p.title}
                        {!p.published && (
                          <span className="ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-600">
                            Hidden
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-theme-muted">
                        {p.category} · {p.tech.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="rounded-lg border border-theme px-3 py-1.5 text-xs text-theme-secondary hover:border-accent-teal hover:text-theme-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id, p.title)}
                      className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="theme-card space-y-5 p-6">
            <h2 className="text-lg font-semibold text-theme-primary">
              {editingId ? 'Edit Project' : 'New Project'}
            </h2>

            <div className="theme-card rounded-xl p-5">
              <label className="mb-3 block text-sm font-medium text-theme-primary">Project Image</label>
              <div className="flex flex-wrap items-start gap-6">
                {previewSrc ? (
                  <img src={previewSrc} alt={form.title || 'Project'} className="h-28 w-40 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-28 w-40 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-5xl">
                    {form.image || '📁'}
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    disabled={uploading || !editingId}
                    className="text-sm text-theme-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent-teal file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white disabled:opacity-50"
                  />
                  <div>
                    <label className="form-label text-xs">Or emoji (if no image)</label>
                    <input
                      className="form-input text-sm"
                      placeholder="📊"
                      value={isProjectImageUrl(form.image) ? '' : form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value || '📁' })}
                      disabled={isProjectImageUrl(form.image)}
                    />
                  </div>
                  {(isProjectImageUrl(form.image) || imagePreview) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="w-fit rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Remove image
                    </button>
                  )}
                  <p className="text-xs text-theme-faint">
                    {!editingId
                      ? 'Save the project first, then upload an image.'
                      : uploading
                        ? 'Uploading...'
                        : 'Image appears on the Projects page.'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Title *</label>
              <input
                required
                className="form-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="TaskFlow Dashboard"
              />
            </div>

            <div>
              <label className="form-label">Description *</label>
              <textarea
                required
                rows={3}
                className="form-input resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">GitHub Link *</label>
                <input
                  required
                  type="url"
                  className="form-input"
                  value={form.githubLink}
                  onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Technologies (comma-separated)</label>
              <input
                className="form-input"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Stats (optional)</label>
                <input
                  className="form-input"
                  value={form.stats || ''}
                  onChange={(e) => setForm({ ...form, stats: e.target.value })}
                  placeholder="15+ components · Responsive"
                />
              </div>
              <div>
                <label className="form-label">Display order</label>
                <input
                  type="number"
                  min={0}
                  className="form-input"
                  value={form.order ?? 0}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-theme-secondary">
              <input
                type="checkbox"
                checked={form.published ?? true}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-teal-400"
              />
              Show on portfolio (Published)
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Project'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
