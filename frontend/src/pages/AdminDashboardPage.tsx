import { Link } from 'react-router-dom'
import { ExternalLink, Eye, FolderKanban, Pencil, Plus, Trash2, User } from 'lucide-react'
import { ThemeToggle } from '../context/ThemeContext'

const crudItems = [
  {
    action: 'Create',
    icon: Plus,
    description: 'Add a new profile with name, title, bio, social links, and photo.',
    color: 'text-emerald-500',
  },
  {
    action: 'Read',
    icon: Eye,
    description: 'View your profile details and list all saved profiles.',
    color: 'text-accent-teal',
  },
  {
    action: 'Update',
    icon: Pencil,
    description: 'Edit any field, upload a new picture, and save — site updates instantly.',
    color: 'text-accent-blue',
  },
  {
    action: 'Delete',
    icon: Trash2,
    description: 'Remove a profile permanently (with confirmation).',
    color: 'text-red-400',
  },
]

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-theme-page pt-20 pb-16 transition-colors duration-300">
      <div className="section-container max-w-3xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent-teal">
              Administrator
            </p>
            <h1 className="font-display text-3xl font-bold text-theme-primary">
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="mt-2 text-sm text-theme-muted">
              Maamul profile-kaaga iyo mashruucyadaada portfolio-ga.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="btn-outline flex items-center gap-1.5 text-sm">
              <ExternalLink size={14} />
              View site
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {crudItems.map(({ action, icon: Icon, description, color }) => (
            <div key={action} className="theme-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <Icon size={18} className={color} />
                <h2 className="font-semibold text-theme-primary">{action}</h2>
              </div>
              <p className="text-sm text-theme-muted">{description}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/admin/profile"
            className="btn-primary flex items-center justify-center gap-2 py-4 text-base"
          >
            <User size={20} />
            Manage Profile
          </Link>
          <Link
            to="/admin/projects"
            className="btn-outline flex items-center justify-center gap-2 border-accent-teal py-4 text-base text-accent-teal hover:bg-accent-teal/10"
          >
            <FolderKanban size={20} />
            Manage Projects
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-theme-faint">
          Requires MongoDB + backend running · Changes sync to web &amp; mobile app
        </p>
      </div>
    </div>
  )
}
