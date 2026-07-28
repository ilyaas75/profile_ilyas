import { certifications } from '../data/certifications'
import { experience } from '../data/experience'
import { SectionTitle } from './SectionTitle'

export function ExperienceSection() {
  return (
    <section className="section-padding bg-theme-page">
      <div className="section-container">
        <SectionTitle
          title="Experience &"
          highlight="Certifications"
          subtitle="My professional journey and credentials"
        />

        <div className="relative mb-16">
          {experience.map((job, index) => (
            <div key={job.role + job.company} className="relative flex gap-6 pb-12 last:pb-0">
              {index < experience.length - 1 && (
                <div className="absolute top-10 left-5 h-full w-px bg-gradient-to-b from-accent-teal/50 to-[var(--border-default)]" />
              )}

              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-teal to-accent-blue text-sm font-bold text-white">
                {index + 1}
              </div>

              <div className="card-hover theme-card flex-1 p-6">
                <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-theme-primary">{job.role}</h3>
                    <p className="text-accent-teal">{job.company}</p>
                  </div>
                  <span className="rounded-full bg-[var(--surface-hover)] px-3 py-1 text-xs text-theme-muted">
                    {job.date}
                  </span>
                </div>

                <p className="mb-4 text-sm text-theme-muted">{job.description}</p>

                <ul className="space-y-2">
                  {job.achievements.map((achievement) => (
                    <li
                      key={achievement}
                      className="flex items-start gap-2 text-sm text-theme-secondary"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-teal" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="mb-6 text-center font-display text-2xl font-bold">
            <span className="gradient-text">Certifications</span>
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div key={cert.name} className="card-hover theme-card flex items-start gap-4 p-5">
                <span className="text-2xl">{cert.icon}</span>
                <div>
                  <h4 className="font-semibold text-theme-primary">{cert.name}</h4>
                  <p className="text-sm text-theme-muted">{cert.issuer}</p>
                  <p className="mt-1 text-xs text-accent-teal">{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
