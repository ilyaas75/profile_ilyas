import { Link } from 'react-router-dom'
import { services } from '../data/services'
import { SectionTitle } from './SectionTitle'

export function ServicesSection() {
  return (
    <section className="section-padding bg-theme-page-alt">
      <div className="section-container">
        <SectionTitle title="My" highlight="Services" subtitle="What I can build for you" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="card-hover theme-card flex flex-col p-6">
              <span className="mb-4 text-3xl">{service.icon}</span>
              <h3 className="mb-2 text-lg font-semibold text-theme-primary">{service.title}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-theme-muted">
                {service.description}
              </p>
              <p className="mb-4 text-sm font-medium text-accent-teal">{service.price}</p>
              <Link to="/contact" className="btn-outline w-full text-center">
                Get in Touch
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
