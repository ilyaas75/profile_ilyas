import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { navItems } from '../data/navigation'
import { services } from '../data/services'
import { GitHubIcon, LinkedInIcon } from './SocialIcons'

export function Footer() {
  const { profile } = useProfile()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-theme bg-theme-footer py-12 transition-colors duration-300">
      <div className="section-container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="gradient-text mb-2 text-lg font-bold">{profile.name}</p>
            <p className="text-sm text-theme-muted">{profile.title}</p>
            <p className="mt-2 text-sm text-theme-faint">{profile.tagline}</p>
            <div className="mt-4 flex gap-3">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-faint transition-colors hover:text-accent-teal"
                aria-label="GitHub"
              >
                <GitHubIcon size={18} />
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-faint transition-colors hover:text-accent-teal"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={18} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="text-theme-faint transition-colors hover:text-accent-teal"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-theme-primary">Quick Links</h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-theme-muted transition-colors hover:text-accent-teal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-theme-primary">Services</h4>
            <ul className="space-y-2">
              {services.slice(0, 4).map((service) => (
                <li key={service.title} className="text-sm text-theme-muted">
                  {service.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-theme pt-6 text-center text-sm text-theme-faint">
          &copy; {year} {profile.name}. Built with React + Tailwind CSS.
          <span className="mx-2">·</span>
          <Link to="/admin/profile" className="text-theme-muted transition-colors hover:text-accent-teal">
            Manage Profile
          </Link>
        </div>
      </div>
    </footer>
  )
}
