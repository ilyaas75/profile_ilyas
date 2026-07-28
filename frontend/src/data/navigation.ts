export const navItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/experience', label: 'Experience' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
] as const

export type NavPath = (typeof navItems)[number]['path']
