import { ExternalLink } from 'lucide-react'
import { getProjectImageUrl, isProjectImageUrl } from '../lib/projectImage'
import type { Project, ProjectCategory } from '../types'
import { GitHubIcon } from './SocialIcons'

const categoryColors: Record<ProjectCategory, string> = {
  Web: 'bg-accent-blue/15 text-accent-blue',
  Backend: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Mobile: 'bg-accent-teal/15 text-accent-teal',
  'Full-Stack': 'bg-accent-purple/15 text-accent-purple',

  'AI / ML': 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
  Desktop: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
  Other: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
}

interface ProjectCardProps {
  project: Project
  compact?: boolean
  asLink?: boolean
}

export function ProjectImage({
  image,
  title,
  className = 'h-40 w-full object-cover rounded-lg',
  emojiClass = 'text-4xl',
}: {
  image: string
  title: string
  className?: string
  emojiClass?: string
}) {
  const src = getProjectImageUrl(image)

  if (src) {
    return <img src={src} alt={title} className={className} loading="lazy" />
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-[var(--surface-hover)] ${emojiClass.includes('h-') ? '' : 'h-40'}`}
    >
      <span className={emojiClass}>{image || '📁'}</span>
    </div>
  )
}

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const imageUrl = isProjectImageUrl(project.image)

  return (
    <article
      className={`card-hover theme-card flex flex-col overflow-hidden ${compact ? 'p-5' : 'p-0'}`}
    >
      {!compact && imageUrl && (
        <ProjectImage image={project.image} title={project.title} className="h-44 w-full object-cover" />
      )}

      <div className={compact ? '' : 'flex flex-1 flex-col p-6'}>
        <div className="mb-4 flex items-start justify-between">
          {compact ? (
            imageUrl ? (
              <ProjectImage
                image={project.image}
                title={project.title}
                className="h-16 w-16 rounded-lg object-cover"
                emojiClass="text-3xl"
              />
            ) : (
              <span className="text-3xl">{project.image}</span>
            )
          ) : !imageUrl ? (
            <span className="text-4xl">{project.image}</span>
          ) : (
            <span />
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[project.category]}`}
          >
            {project.category}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-theme-primary">{project.title}</h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-theme-muted">{project.description}</p>

        {project.stats && (
          <p className="mb-4 text-xs text-theme-faint">{project.stats}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-xs text-theme-secondary"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-teal transition-colors hover:text-accent-blue"
        >
          <GitHubIcon size={14} />
          View on GitHub
          <ExternalLink size={12} className="opacity-70" />
        </a>
      </div>
    </article>
  )
}
