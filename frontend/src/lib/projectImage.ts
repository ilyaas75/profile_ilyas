const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/** True if image is a URL path or uploaded file, not an emoji */
export function isProjectImageUrl(image?: string): boolean {
  if (!image?.trim()) return false
  return (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:') ||
    image.startsWith('/uploads/') ||
    image.startsWith('/')
  )
}

export function getProjectImageUrl(image?: string): string | null {
  if (!image?.trim() || !isProjectImageUrl(image)) return null
  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:') ||
    image.startsWith('blob:')
  )
    return image
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`
  if (image.startsWith('/')) return image
  return `${API_URL}/${image}`
}
