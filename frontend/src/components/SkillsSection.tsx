import { Code2, Database, Layout, Palette, Smartphone, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { skills } from '../data/skills'
import { SectionTitle } from './SectionTitle'

const categoryIcons: Record<string, LucideIcon> = {
  'Web (React)': Code2,
  'Backend (Node.js)': Database,
  'Mobile (Flutter)': Smartphone,
  'UI/UX & Design': Layout,
  'Multimedia & Creative Coding': Palette,
  'Tools & DevOps': Wrench,
}

const categoryAccents: Record<string, string> = {
  'Web (React)': 'border-accent-blue/50 hover:border-accent-blue',
  'Backend (Node.js)': 'border-emerald-500/50 hover:border-emerald-500',
  'Mobile (Flutter)': 'border-accent-teal/50 hover:border-accent-teal',
  'UI/UX & Design': 'border-accent-purple/50 hover:border-accent-purple',
  'Multimedia & Creative Coding': 'border-pink-500/50 hover:border-pink-500',
  'Tools & DevOps': 'border-[var(--border-default)] hover:border-accent-teal',
}

export function SkillsSection() {
  return (
    <section className="section-padding bg-theme-page">
      <div className="section-container">
        <SectionTitle
          title="Technical"
          highlight="Expertise"
          subtitle="Primary stack: React · Node.js · MongoDB · Flutter"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([category, items]) => {
            const Icon = categoryIcons[category] ?? Code2
            return (
              <div
                key={category}
                className={`card-hover theme-card border p-6 ${categoryAccents[category] ?? 'border-[var(--border-default)]'}`}
              >
                <Icon className="mb-4 h-7 w-7 text-accent-teal" strokeWidth={1.5} />
                <h3 className="mb-4 font-semibold text-theme-primary">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[var(--surface-hover)] px-3 py-1 text-xs text-theme-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
