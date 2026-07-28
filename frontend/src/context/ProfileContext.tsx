import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { profile as fallbackProfile } from '../data/profile'
import { profileApi } from '../lib/api'
import type { Profile, ProfileDocument } from '../types'

interface ProfileContextValue {
  profile: Profile
  profileDoc: ProfileDocument | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileDoc, setProfileDoc] = useState<ProfileDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileApi.getPrimary()
      setProfileDoc(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      setProfileDoc(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const profile: Profile = profileDoc ?? fallbackProfile

  return (
    <ProfileContext.Provider value={{ profile, profileDoc, loading, error, refresh }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
