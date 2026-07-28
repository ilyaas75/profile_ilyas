import { CheckCircle, MapPin } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { SectionTitle } from './SectionTitle'

const statColors = [
  'from-accent-teal/20 to-accent-teal/5 text-accent-teal',
  'from-accent-blue/20 to-accent-blue/5 text-accent-blue',
  'from-accent-purple/20 to-accent-purple/5 text-accent-purple',
  'from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-400',
]

export function AboutSection() {
  const { profile } = useProfile()
  const statEntries = [
    { label: 'Projects', value: profile.stats.projects },
    { label: 'Years Experience', value: profile.stats.experience },
    { label: 'Certifications', value: profile.stats.certifications },
    { label: 'Technologies', value: profile.stats.technologies },
  ]

  return (
    <section className="section-padding bg-theme-page-alt">
      <div className="section-container">
        <SectionTitle
          title="About"
          highlight="Me"
          subtitle="Get to know the developer behind the code"
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            {profile.bio.map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed text-theme-secondary">
                {paragraph}
              </p>
            ))}

            <div className="surface-card mt-6 border-l-2 border-accent-teal p-5">
              <p className="text-sm leading-relaxed text-theme-muted italic">
                &ldquo;{profile.philosophy}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-theme-muted">
              <MapPin size={16} className="text-accent-teal" />
              {profile.location}
            </div>

            <span className="mt-4 inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {profile.availability}
            </span>
          </div>

          <div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              {statEntries.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`card-hover rounded-xl bg-gradient-to-br p-5 ${statColors[i]}`}
                >
                  <p className="text-3xl font-bold">{stat.value}+</p>
                  <p className="mt-1 text-sm text-theme-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="surface-card p-6">
              <h3 className="mb-4 font-semibold text-theme-primary">Quick Facts</h3>
              <ul className="space-y-3">
                {profile.facts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3 text-sm text-theme-secondary">
                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent-teal" />
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
