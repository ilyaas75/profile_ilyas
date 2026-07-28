import { Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { ProfileAvatar } from './ProfileAvatar'
import { GitHubIcon, LinkedInIcon } from './SocialIcons'

export function HeroSection() {
  const { profile } = useProfile()
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-via), var(--hero-gradient-from))`,
        }}
      />
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-accent-teal/10 blur-3xl transition-transform duration-700 hover:scale-110" />
      <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-accent-blue/10 blur-3xl transition-transform duration-700 hover:scale-110" />

      <div className="section-container relative z-10 grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="text-left">
          <p className="animate-slide-up availability-badge mb-4 text-sm font-medium tracking-widest text-accent-teal uppercase">
            {profile.availability}
          </p>

          <h1 className="animate-slide-up-delay-1 font-display gradient-text-hover mb-2 text-5xl leading-tight font-bold sm:text-6xl lg:text-7xl">
            <span className="gradient-text">Full-Stack</span>
            <br />
            <span className="text-theme-primary">Developer</span>
          </h1>

          <p className="animate-slide-up-delay-2 mt-4 text-lg text-theme-secondary md:text-xl">
            {profile.tagline} — specializing in{' '}
            <span className="hover-tech text-accent-teal">React</span>,{' '}
            <span className="hover-tech text-accent-teal">Node.js</span>,{' '}
            <span className="hover-tech text-accent-teal">MongoDB</span> &{' '}
            <span className="hover-tech text-accent-teal">Flutter</span>.
          </p>

          <p className="animate-slide-up-delay-2 mt-3 text-sm text-theme-muted">
            {profile.title} · {profile.specialties.join(' · ')}
          </p>

          <div className="animate-slide-up-delay-3 mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary">
              Hire Me
            </Link>
            <Link to="/projects" className="btn-outline">
              View Projects
            </Link>
          </div>

          <div className="animate-slide-up-delay-4 mt-8 flex items-center gap-3">
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-hover social-hover-github text-theme-muted"
              aria-label="GitHub"
            >
              <GitHubIcon size={20} />
            </a>
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-hover social-hover-linkedin text-theme-muted"
              aria-label="LinkedIn"
            >
              <LinkedInIcon size={20} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="social-hover social-hover-email text-theme-muted"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="animate-slide-up-delay-2 flex justify-center lg:justify-end">
          <div className="avatar-hover-group relative">
            <div className="animate-pulse-glow">
              <ProfileAvatar avatar={profile.avatar} name={profile.name} />
            </div>
            <div className="hero-badge-hover absolute -right-2 -bottom-2 rounded-lg border border-theme theme-card px-4 py-2 shadow-sm">
              <p className="text-xs text-theme-muted">Based in</p>
              <p className="text-sm font-semibold text-accent-teal">{profile.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
