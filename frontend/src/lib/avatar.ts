const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/** Resolve avatar URL from API path, full URL, or local public path */
export function getAvatarUrl(avatar?: string): string | null {
  if (!avatar?.trim()) return null
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar
  if (avatar.startsWith('/uploads/')) return `${API_URL}${avatar}`
  if (avatar.startsWith('/')) return avatar
  return `${API_URL}/${avatar}`
}

/** First letters of first two name parts, e.g. "Ilyas Hassan Mohamed" → "IH" */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
