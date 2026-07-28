import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getAvatarUrl } from '../lib/avatar'
import { useProfile } from '../context/ProfileContext'

const pageTitles: Record<string, string> = {
  '/about': 'About',
  '/skills': 'Skills',
  '/projects': 'Projects',
  '/experience': 'Experience',
  '/services': 'Services',
  '/contact': 'Contact',
  '/admin/dashboard': 'Admin Dashboard',
  '/admin/projects': 'Admin Projects',
  '/admin/profile': 'Admin Profile',
}

/** Sync browser tab title, meta tags, and favicon from profile API */
export function DocumentHead() {
  const { profile } = useProfile()
  const location = useLocation()

  useEffect(() => {
    const routeTitle = pageTitles[location.pathname]
    const fullTitle = routeTitle
      ? `${routeTitle} | ${profile.name}`
      : `${profile.name} | ${profile.title}`

    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setOg = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', `${profile.tagline}. ${profile.title}.`)
    setMeta('author', profile.name)
    setOg('og:title', fullTitle)
    setOg('og:description', profile.tagline)

    const avatarUrl = getAvatarUrl(profile.avatar)
    if (avatarUrl) {
      setOg('og:image', avatarUrl)
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.type = 'image/png'
      link.href = avatarUrl
    }
  }, [profile, location.pathname])

  return null
}
