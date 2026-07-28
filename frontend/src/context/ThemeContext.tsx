import { Moon, Sun } from 'lucide-react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
const STORAGE_KEY = 'portfolio-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const setTheme = (next: Theme) => setThemeState(next)

  const toggleTheme = () => {
    setAnimating(true)
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
    window.setTimeout(() => setAnimating(false), 450)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
      {/* expose animating via data attribute for icon spin — handled in ThemeToggle */}
      <span data-theme-animating={animating} className="hidden" aria-hidden />
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()
  const [spin, setSpin] = useState(false)

  const handleClick = () => {
    setSpin(true)
    toggleTheme()
    window.setTimeout(() => setSpin(false), 450)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`icon-btn-hover rounded-lg p-2 transition-colors ${
        isDark
          ? 'text-slate-400 hover:bg-slate-800 hover:text-accent-teal'
          : 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode ☀️' : 'Dark mode 🌙'}
    >
      <span className={`inline-flex ${spin ? 'theme-icon-spin' : ''}`}>
        {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
      </span>
    </button>
  )
}
