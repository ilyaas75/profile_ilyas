import { profile as defaultProfile } from '../data/profile'
import type { Profile } from '../types'

export function emptyProfile(): Profile {
  return {
    ...defaultProfile,
    name: '',
    title: '',
    tagline: '',
    email: '',
    stackFocus: [],
    specialties: [],
    bio: [''],
    facts: [''],
    avatar: '',
    isPrimary: false,
  }
}

export function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function arrayToLines(arr: string[]): string {
  return arr.join('\n')
}
