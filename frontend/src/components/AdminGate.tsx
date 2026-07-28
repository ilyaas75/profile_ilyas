import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'

const STORAGE_KEY = 'profile_admin_auth'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim()

interface AdminGateProps {
  children: React.ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const [authed, setAuthed] = useState(
    () => !ADMIN_PASSWORD || sessionStorage.getItem(STORAGE_KEY) === 'true',
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!ADMIN_PASSWORD || authed) {
    return <>{children}</>
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setError('')
      setAuthed(true)
      return
    }
    setError('Incorrect password')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="surface-card w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-teal/20 text-accent-teal">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Admin Access</h1>
            <p className="text-xs text-slate-400">Enter your password to manage your profile</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            required
            autoFocus
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-accent-teal"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>
        <Link to="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-accent-teal">
          ← Back to site
        </Link>
      </div>
    </div>
  )
}
