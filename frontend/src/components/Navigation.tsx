import { Menu, Settings, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { ThemeToggle } from '../context/ThemeContext'
import { navItems } from '../data/navigation'
import { ProfileAvatar } from './ProfileAvatar'

interface NavigationProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link-animated rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'active bg-[var(--surface-hover)] text-accent-teal' : 'text-[var(--nav-link)] hover:bg-[var(--surface-hover)] hover:text-[var(--nav-link-hover)]'
  }`

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[var(--surface-hover)] text-accent-teal'
      : 'text-[var(--nav-link)] hover:bg-[var(--surface-hover)] hover:text-[var(--nav-link-hover)]'
  }`

export function Navigation({ mobileMenuOpen, setMobileMenuOpen }: NavigationProps) {
  const { profile } = useProfile()
  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-theme-subtle bg-theme-nav backdrop-blur-lg transition-colors duration-300">
      <div className="section-container flex h-16 items-center justify-between">
        <NavLink to="/" className="logo-hover flex items-center" onClick={closeMobile} aria-label="Home">
          <ProfileAvatar
            avatar={profile.avatar}
            name={profile.name}
            size="xs"
            fallback="initials"
          />
        </NavLink>

        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === '/'} className={linkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <ThemeToggle />
          </li>
          <li>
            <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                `icon-btn-hover rounded-lg p-2 ${
                  isActive
                    ? 'bg-[var(--surface-hover)] text-accent-teal'
                    : 'text-[var(--nav-link)] hover:bg-[var(--surface-hover)] hover:text-accent-teal'
                }`
              }
              title="Manage my profile"
              aria-label="Manage my profile"
            >
              <Settings size={18} />
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <NavLink
            to="/admin/profile"
            className="icon-btn-hover rounded-lg p-2 text-[var(--nav-link)] hover:bg-[var(--surface-hover)] hover:text-accent-teal"
            title="Manage my profile"
            aria-label="Manage my profile"
          >
            <Settings size={20} />
          </NavLink>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="icon-btn-hover rounded-lg p-2 text-[var(--nav-link)] hover:bg-[var(--surface-hover)] hover:text-[var(--nav-link-hover)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-theme bg-theme-nav md:hidden">
          <ul className="section-container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={mobileLinkClass}
                  onClick={closeMobile}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/admin/profile"
                className={mobileLinkClass}
                onClick={closeMobile}
              >
                Manage My Profile
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
