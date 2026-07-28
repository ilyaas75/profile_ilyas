import { useState } from 'react'
import { useProjects } from '../context/ProjectsContext'
import type { ProjectCategory } from '../types'
import { ProjectCard } from './ProjectCard'
import { SectionTitle } from './SectionTitle'

const filters: Array<'All' | ProjectCategory> = [
  'All',
  'Web',
  'Backend',
  'Mobile',
  'Full-Stack',
]

export function ProjectsSection() {
  const { projects, loading } = useProjects()
  const [activeFilter, setActiveFilter] = useState<'All' | ProjectCategory>('All')

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <section className="section-padding bg-theme-page-alt">
      <div className="section-container">
        <SectionTitle
          title="Featured"
          highlight="Projects"
          subtitle="Web, backend, mobile, and full-stack work"
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-accent-teal to-accent-blue text-white'
                  : 'bg-[var(--surface-hover)] text-theme-muted hover:text-theme-primary'
              }`}
            >
              {filter === 'Web'
                ? 'Web (React)'
                : filter === 'Backend'
                  ? 'Backend (Node.js)'
                  : filter === 'Mobile'
                    ? 'Mobile (Flutter)'
                    : filter}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-theme-muted">Loading projects...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-theme-muted">No projects to display yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard
                key={'_id' in project ? (project as { _id: string })._id : `${project.title}-${index}`}
                project={project}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
