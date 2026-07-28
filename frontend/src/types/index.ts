export type ProjectCategory =
  | 'Web'
  | 'Backend'
  | 'Mobile'
  | 'Full-Stack'
  | 'AI / ML'
  | 'Desktop'
  | 'Other'

export interface Project {
  title: string
  description: string
  image: string
  tech: string[]
  githubLink: string
  category: ProjectCategory
  stats?: string
  order?: number
  published?: boolean
}

export interface ProjectDocument extends Project {
  _id: string
  createdAt?: string
  updatedAt?: string
}

/** @deprecated use Project with githubLink */
export interface LegacyProject extends Project {
  id: number
  link: string
}

export interface Experience {
  role: string
  company: string
  date: string
  description: string
  achievements: string[]
}

export interface Certification {
  name: string
  issuer: string
  date: string
  icon: string
}

export interface Service {
  icon: string
  title: string
  description: string
  price: string
}

export interface Profile {
  name: string
  title: string
  tagline: string
  stackFocus: string[]
  specialties: string[]
  availability: string
  email: string
  location: string
  social: {
    github: string
    linkedin: string
    twitter?: string
  }
  bio: string[]
  philosophy: string
  stats: {
    projects: number
    experience: number
    certifications: number
    technologies: number
  }
  facts: string[]
  avatar?: string
  isPrimary?: boolean
}

export interface ProfileDocument extends Profile {
  _id: string
  createdAt?: string
  updatedAt?: string
}