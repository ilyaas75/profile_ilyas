import { Mail, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useProfile } from '../context/ProfileContext'
import { GitHubIcon, LinkedInIcon } from './SocialIcons'
import { SectionTitle } from './SectionTitle'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactSection() {
  const { profile } = useProfile()
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email'
    }
    if (!form.subject.trim()) newErrors.subject = 'Subject is required'
    if (!form.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const apiUrl = import.meta.env.VITE_API_URL
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID

    if (apiUrl) {
      try {
        const res = await fetch(`${apiUrl}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setSubmitted(true)
          return
        }
      } catch {
        // fall through
      }
    }

    if (formspreeId) {
      fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).then(() => setSubmitted(true))
    } else {
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
      )
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`
      setSubmitted(true)
    }
  }

  const contactCards = [
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: LinkedInIcon,
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      href: profile.social.linkedin,
    },
    {
      icon: GitHubIcon,
      label: 'GitHub',
      value: 'View my repos',
      href: profile.social.github,
    },
  ]

  return (
    <section className="section-padding bg-theme-page">
      <div className="section-container">
        <SectionTitle
          title="Get In"
          highlight="Touch"
          subtitle="Have a project in mind? Let's talk."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            {contactCards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.label !== 'Email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="card-hover theme-card flex items-center gap-4 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-teal/15 text-accent-teal">
                  <card.icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-theme-muted">{card.label}</p>
                  <p className="text-sm font-semibold text-theme-primary">{card.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-10 text-center">
                <div>
                  <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                    Message sent!
                  </p>
                  <p className="mt-2 text-sm text-theme-muted">
                    Thank you for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="theme-card p-6 md:p-8" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="form-input"
                      placeholder="Your name"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="form-input"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="form-input"
                    placeholder="Project inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                  )}
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="form-input resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary mt-6 gap-2">
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
