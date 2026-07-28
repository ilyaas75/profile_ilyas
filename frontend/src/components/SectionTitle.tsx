interface SectionTitleProps {
  title: string
  highlight: string
  subtitle?: string
}

export function SectionTitle({ title, highlight, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-12 text-center">
      <h2 className="font-display mb-3 text-3xl font-bold md:text-4xl">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
      {subtitle && <p className="mx-auto max-w-2xl text-theme-muted">{subtitle}</p>}
    </div>
  )
}
