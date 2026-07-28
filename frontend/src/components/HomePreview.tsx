import { Code2, Database, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { useProjects } from '../context/ProjectsContext'
import { SectionTitle } from './SectionTitle'

const expertise = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'Building responsive, modern UIs with React, TypeScript, and Tailwind CSS.',
    to: '/skills',
  },
  {
    icon: Database,
    title: 'Backend Development',
    description: 'Scalable REST APIs, authentication, and MongoDB database solutions with Node.js.',
    to: '/skills',
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Cross-platform Flutter apps for iOS and Android with polished native-like UX.',
    to: '/skills',
  },
]

export function HomePreview() {
  const { profile } = useProfile()
  const { projects } = useProjects()
  const featured = projects.slice(0, 3)

  return (
    <>
      <section className="section-padding border-t border-theme bg-theme-page-alt">
        <div className="section-container">
          <SectionTitle
            title="Technical"
            highlight="Expertise"
            subtitle="Primary stack: React · Node.js · MongoDB · Flutter"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {expertise.map((item) => (
              <Link key={item.title} to={item.to} className="expertise-card group">
                <item.icon className="expertise-icon mb-4 h-8 w-8 text-accent-teal" strokeWidth={1.5} />
                <h3 className="mb-2 font-semibold text-theme-primary group-hover:text-accent-teal">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-theme-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Projects', value: `${profile.stats.projects}+`, to: '/projects' },
              { label: 'Experience', value: `${profile.stats.experience}+ yrs`, to: '/experience' },
              { label: 'Skills', value: `${profile.stats.technologies}+`, to: '/skills' },
              { label: 'Certifications', value: `${profile.stats.certifications}`, to: '/experience' },
            ].map((item) => (
              <Link
                key={item.to + item.label}
                to={item.to}
                className="surface-card card-hover p-5 text-center"
              >
                <p className="text-3xl font-bold text-accent-teal">{item.value}</p>
                <p className="mt-1 text-sm text-theme-muted">{item.label}</p>
              </Link>
            ))}
          </div>

          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-theme-primary">
              Featured <span className="gradient-text">Projects</span>
            </h3>
            <Link to="/projects" className="text-sm font-medium text-accent-teal hover:text-accent-blue">
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, index) => (
              <Link key={`${project.title}-${index}`} to="/projects" className="surface-card card-hover p-5">
                <span className="text-3xl">{project.image.startsWith('/') || project.image.startsWith('http') ? '🖼️' : project.image}</span>
                <h4 className="mt-3 font-semibold text-theme-primary">{project.title}</h4>
                <p className="mt-2 line-clamp-2 text-sm text-theme-muted">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 3).map((t: string) => (
                    <span
                      key={t}
                      className="rounded bg-[var(--surface-hover)] px-2 py-0.5 text-xs text-theme-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-primary">
              Let&apos;s Work Together
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
