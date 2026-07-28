import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { ProfileDetailPanel } from '../components/ProfileDetailPanel'
import { ProfileAvatar } from '../components/ProfileAvatar'
import { useProfile } from '../context/ProfileContext'
import { ThemeToggle } from '../context/ThemeContext'
import { profileApi } from '../lib/api'
import { arrayToLines, emptyProfile, linesToArray } from '../lib/profileForm'
import type { Profile, ProfileDocument } from '../types'

const inputClass = 'form-input text-sm'

function populateFormFromDoc(doc: ProfileDocument) {
  return {
    form: {
      name: doc.name,
      title: doc.title,
      tagline: doc.tagline,
      stackFocus: doc.stackFocus,
      specialties: doc.specialties,
      availability: doc.availability,
      email: doc.email,
      location: doc.location,
      social: { ...doc.social },
      bio: doc.bio,
      philosophy: doc.philosophy,
      stats: { ...doc.stats },
      facts: doc.facts,
      avatar: doc.avatar || '',
      isPrimary: doc.isPrimary ?? false,
    },
    bioText: arrayToLines(doc.bio),
    factsText: arrayToLines(doc.facts),
    stackText: doc.stackFocus.join(', '),
    specialtiesText: doc.specialties.join(', '),
    avatarPreview: doc.avatar || null,
  }
}

export function AdminProfilePage() {
  const { refresh, profileDoc } = useProfile()
  const [profiles, setProfiles] = useState<ProfileDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [viewLoading, setViewLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [viewingProfile, setViewingProfile] = useState<ProfileDocument | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [form, setForm] = useState<Profile>(emptyProfile())
  const [bioText, setBioText] = useState('')
  const [factsText, setFactsText] = useState('')
  const [stackText, setStackText] = useState('')
  const [specialtiesText, setSpecialtiesText] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoLoadedRef = useRef(false)

  const applyDocToForm = (doc: ProfileDocument) => {
    const data = populateFormFromDoc(doc)
    setEditingId(doc._id)
    setForm(data.form)
    setBioText(data.bioText)
    setFactsText(data.factsText)
    setStackText(data.stackText)
    setSpecialtiesText(data.specialtiesText)
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(data.avatarPreview)
  }

  const loadProfiles = async () => {
    setLoading(true)
    try {
      const data = await profileApi.getAll()
      setProfiles(data)

      if (!autoLoadedRef.current && data.length > 0) {
        const primary = data.find((p) => p.isPrimary) ?? data[0]
        applyDocToForm(primary)
        autoLoadedRef.current = true
      }
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const startCreate = () => {
    setViewingProfile(null)
    setEditingId(null)
    setForm({ ...emptyProfile(), isPrimary: profiles.length === 0 })
    setBioText('')
    setFactsText('')
    setStackText('')
    setSpecialtiesText('')
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
  }

  const startEdit = (doc: ProfileDocument) => {
    setViewingProfile(null)
    applyDocToForm(doc)
    setShowAdvanced(false)
  }

  const startView = async (id: string) => {
    setMessage(null)
    setViewLoading(true)
    try {
      const profile = await profileApi.getById(id)
      setViewingProfile(profile)
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Failed to load profile' })
    } finally {
      setViewLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'err', text: 'Please select an image file (JPG, PNG, WebP, GIF)' })
      return
    }

    const blobUrl = URL.createObjectURL(file)
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(blobUrl)

    if (!editingId) {
      setMessage({ type: 'err', text: 'Save your profile first, then upload a picture.' })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const updated = await profileApi.uploadAvatar(editingId, file)
      setForm((prev) => ({ ...prev, avatar: updated.avatar }))
      URL.revokeObjectURL(blobUrl)
      setAvatarPreview(updated.avatar || null)
      await loadProfiles()
      await refresh()
      setMessage({ type: 'ok', text: 'Profile picture updated — visible on your site now.' })
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    setMessage(null)
    if (editingId && form.avatar) {
      try {
        await profileApi.removeAvatar(editingId)
        setForm((prev) => ({ ...prev, avatar: '' }))
        if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
        setAvatarPreview(null)
        await loadProfiles()
        await refresh()
        setMessage({ type: 'ok', text: 'Profile picture removed' })
      } catch (err) {
        setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Remove failed' })
      }
      return
    }
    if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
  }

  const buildPayload = (): Profile => ({
    ...form,
    stackFocus: stackText.split(',').map((s) => s.trim()).filter(Boolean),
    specialties: specialtiesText.split(',').map((s) => s.trim()).filter(Boolean),
    bio: linesToArray(bioText),
    facts: linesToArray(factsText),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    const payload = buildPayload()

    try {
      if (editingId) {
        await profileApi.update(editingId, payload)
        setMessage({ type: 'ok', text: 'Profile saved — your site is updated.' })
      } else {
        const created = await profileApi.create(payload)
        setEditingId(created._id)
        autoLoadedRef.current = true
        setMessage({ type: 'ok', text: 'Profile created. You can now upload a profile picture.' })
      }

      await loadProfiles()
      await refresh()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete profile "${name}"? This cannot be undone.`)) return
    setMessage(null)
    try {
      await profileApi.delete(id)
      setMessage({ type: 'ok', text: 'Profile deleted' })
      if (editingId === id) {
        autoLoadedRef.current = false
        startCreate()
      }
      if (viewingProfile?._id === id) setViewingProfile(null)
      await loadProfiles()
      await refresh()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Delete failed' })
    }
  }

  const handleSeed = async () => {
    setMessage(null)
    try {
      await profileApi.seedDefault()
      autoLoadedRef.current = false
      setMessage({ type: 'ok', text: 'Default profile created — edit it below.' })
      await loadProfiles()
      await refresh()
    } catch (err) {
      setMessage({ type: 'err', text: err instanceof Error ? err.message : 'Seed failed' })
    }
  }

  const isNewProfile = !editingId

  return (
    <div className="min-h-screen bg-theme-page pt-20 pb-16 transition-colors duration-300">
      <div className="section-container max-w-4xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/admin/dashboard"
              className="mb-2 inline-block text-xs text-accent-teal hover:underline"
            >
              ← Admin dashboard
            </Link>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent-teal">
              Administrator
            </p>
            <h1 className="font-display text-3xl font-bold text-theme-primary">
              Manage <span className="gradient-text">My Profile</span>
            </h1>
            <p className="mt-1 text-sm text-theme-muted">
              Upload your photo, edit your details, and update your portfolio anytime.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="btn-outline flex items-center gap-1.5 text-sm">
              <ExternalLink size={14} />
              View site
            </Link>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'ok'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="text-theme-muted">Loading your profile...</p>
        ) : profiles.length === 0 && isNewProfile ? (
          <div className="surface-card mb-8 p-8 text-center">
            <p className="text-theme-secondary">No profile found yet.</p>
            <p className="mt-1 text-sm text-theme-muted">
              Create your profile below or load the default portfolio data.
            </p>
            <button type="button" onClick={handleSeed} className="btn-primary mt-4 text-sm">
              Load Default Profile
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="surface-card space-y-6 p-6">
          <div className="theme-card rounded-xl p-5">
            <label className="mb-3 block text-sm font-medium text-theme-primary">Profile Picture</label>
            <div className="flex flex-wrap items-center gap-6">
              <ProfileAvatar
                avatar={avatarPreview || form.avatar}
                name={form.name || 'Profile'}
                size="sm"
              />
              <div className="flex flex-1 flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  disabled={uploading || isNewProfile}
                  className="text-sm text-theme-label file:mr-3 file:rounded-lg file:border-0 file:bg-accent-teal file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-theme-primary disabled:opacity-50"
                />
                <div>
                  <label className="mb-1 block text-xs text-theme-faint">
                    Or paste an image URL (saved when you click Save)
                  </label>
                  <input
                    className={inputClass}
                    placeholder="https://example.com/photo.jpg"
                    value={form.avatar?.startsWith('/uploads/') ? '' : form.avatar || ''}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  />
                </div>
                {(avatarPreview || form.avatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className="w-fit rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Remove picture
                  </button>
                )}
                <p className="text-xs text-theme-faint">
                  {isNewProfile
                    ? 'Save your profile first, then upload a picture (JPG, PNG, WebP, GIF — max 5MB).'
                    : uploading
                      ? 'Uploading...'
                      : 'Picture uploads immediately. Shown in the navigation bar and hero section.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-theme-label font-medium">Full name *</label>
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label text-xs">Email *</label>
              <input
                required
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-theme-label">Job title *</label>
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-theme-label">Tagline *</label>
              <input
                required
                className={inputClass}
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-theme-label">Location</label>
              <input
                className={inputClass}
                placeholder="e.g. Available Worldwide"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-theme-label">Availability</label>
              <input
                className={inputClass}
                placeholder="e.g. Open to Opportunities"
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-theme-label">Tech stack (comma-separated)</label>
            <input
              className={inputClass}
              placeholder="React, Node.js, MongoDB, Flutter"
              value={stackText}
              onChange={(e) => setStackText(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-theme-label">Specialties (comma-separated)</label>
            <input
              className={inputClass}
              placeholder="UI/UX, Mobile Development"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-theme-label">GitHub URL</label>
              <input
                className={inputClass}
                value={form.social.github}
                onChange={(e) =>
                  setForm({ ...form, social: { ...form.social, github: e.target.value } })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-theme-label">LinkedIn URL</label>
              <input
                className={inputClass}
                value={form.social.linkedin}
                onChange={(e) =>
                  setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-theme-label">Twitter / X URL</label>
              <input
                className={inputClass}
                value={form.social.twitter || ''}
                onChange={(e) =>
                  setForm({ ...form, social: { ...form.social, twitter: e.target.value } })
                }
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-theme-label">About me (one paragraph per line)</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-theme-label">Philosophy</label>
            <textarea
              rows={2}
              className={`${inputClass} resize-none`}
              value={form.philosophy}
              onChange={(e) => setForm({ ...form, philosophy: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-theme-label">Quick facts (one per line)</label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={factsText}
              onChange={(e) => setFactsText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(['projects', 'experience', 'certifications', 'technologies'] as const).map((key) => (
              <div key={key}>
                <label className="mb-1 block text-xs capitalize text-theme-label">{key}</label>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.stats[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stats: { ...form.stats, [key]: Number(e.target.value) },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-theme pt-4">
            <label className="flex items-center gap-2 text-sm text-theme-secondary">
              <input
                type="checkbox"
                checked={form.isPrimary ?? false}
                onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                className="accent-teal-400"
              />
              Show this profile on my portfolio site
            </label>
            <button type="submit" disabled={saving} className="btn-primary min-w-[140px]">
              {saving ? 'Saving...' : isNewProfile ? 'Create Profile' : 'Save Changes'}
            </button>
          </div>

          {profileDoc?.updatedAt && editingId && (
            <p className="text-xs text-theme-faint">
              Last updated: {new Date(profileDoc.updatedAt).toLocaleString()}
            </p>
          )}
        </form>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between rounded-lg border border-theme bg-[var(--surface-hover)] px-4 py-3 text-sm text-theme-label hover:text-theme-primary"
          >
            <span>Advanced — all profiles ({profiles.length})</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={startCreate} className="btn-outline text-xs">
                  + New profile
                </button>
                <button type="button" onClick={loadProfiles} className="btn-outline text-xs">
                  Refresh
                </button>
              </div>

              {profiles.map((p) => (
                <div
                  key={p._id}
                  className={`surface-card flex flex-wrap items-center justify-between gap-3 p-4 ${
                    editingId === p._id ? 'ring-1 ring-accent-teal/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ProfileAvatar avatar={p.avatar} name={p.name} size="xs" fallback="initials" />
                    <div>
                      <p className="font-medium text-theme-primary">
                        {p.name}
                        {p.isPrimary && (
                          <span className="ml-2 rounded bg-accent-teal/20 px-2 py-0.5 text-xs text-accent-teal">
                            Live on site
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-theme-label">
                        {p.title} · {p.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startView(p._id)}
                      className="rounded-lg border border-theme px-3 py-1.5 text-xs text-theme-secondary hover:border-accent-teal hover:text-theme-primary"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="rounded-lg border border-theme px-3 py-1.5 text-xs text-theme-secondary hover:border-accent-teal hover:text-theme-primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id, p.name)}
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

        {viewLoading && <p className="mt-6 text-theme-label">Loading profile...</p>}

        {viewingProfile && !viewLoading && (
          <div className="mt-6">
            <ProfileDetailPanel
              profile={viewingProfile}
              onEdit={() => startEdit(viewingProfile)}
              onDelete={() => handleDelete(viewingProfile._id, viewingProfile.name)}
              onClose={() => setViewingProfile(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
