import { getAvatarUrl, getInitials } from '../lib/avatar'

interface ProfileAvatarProps {
  avatar?: string
  name: string
  size?: 'xs' | 'sm' | 'lg'
  fallback?: 'emoji' | 'initials'
  className?: string
}

const sizeClasses = {
  xs: 'h-9 w-9',
  sm: 'h-24 w-24',
  lg: 'h-56 w-56 sm:h-72 sm:w-72',
} as const

export function ProfileAvatar({
  avatar,
  name,
  size = 'lg',
  fallback = 'emoji',
  className = '',
}: ProfileAvatarProps) {
  const src = getAvatarUrl(avatar)
  const emojiClass = size === 'lg' ? 'text-7xl sm:text-8xl' : 'text-4xl'
  const ringClass = size === 'xs' ? 'border-2 border-accent-teal/70' : 'profile-ring'

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full bg-slate-800 ${ringClass} ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : fallback === 'initials' ? (
        <span className="gradient-text text-xs font-bold tracking-tight">{getInitials(name)}</span>
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 ${emojiClass}`}
        >
          👨‍💻
        </div>
      )}
    </div>
  )
}
