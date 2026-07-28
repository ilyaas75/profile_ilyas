import type { Project } from '../types'

/** Static fallback when API is unavailable */
export const fallbackProjects: Project[] = [
  {
    title: 'TaskFlow Dashboard',
    category: 'Web',
    description:
      'A modern React dashboard for task management with real-time updates, drag-and-drop boards, and responsive layouts.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    image: '📊',
    githubLink: 'https://github.com/ilyaas75',
    stats: '15+ components · Fully responsive',
    order: 1,
    published: true,
  },
  {
    title: 'ShopWave E-Commerce UI',
    category: 'Web',
    description:
      'A sleek e-commerce storefront built with React featuring product filtering, cart management, and smooth page transitions.',
    tech: ['React', 'Tailwind CSS', 'Vite'],
    image: '🛒',
    githubLink: 'https://github.com/ilyaas75',
    stats: '20+ screens · Mobile-first',
    order: 2,
    published: true,
  },
  {
    title: 'AuthAPI Service',
    category: 'Backend',
    description:
      'Secure REST API with JWT authentication, user roles, and MongoDB persistence for scalable backend services.',
    tech: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    image: '🔐',
    githubLink: 'https://github.com/ilyaas75',
    stats: '12 endpoints · Role-based auth',
    order: 3,
    published: true,
  },
  {
    title: 'DataHub API Platform',
    category: 'Backend',
    description:
      'Node.js + MongoDB API platform for CRUD operations, data validation, and third-party integrations.',
    tech: ['Node.js', 'MongoDB', 'Mongoose', 'REST'],
    image: '⚡',
    githubLink: 'https://github.com/ilyaas75',
    stats: '8 models · RESTful design',
    order: 4,
    published: true,
  },
  {
    title: 'FitTrack Mobile App',
    category: 'Mobile',
    description:
      'Cross-platform Flutter fitness tracker with workout logging, progress charts, and offline-first data sync.',
    tech: ['Flutter', 'Dart', 'Provider'],
    image: '💪',
    githubLink: 'https://github.com/ilyaas75',
    stats: 'iOS & Android · 10+ screens',
    order: 5,
    published: true,
  },
  {
    title: 'UniConnect Platform',
    category: 'Full-Stack',
    description:
      'End-to-end university portal with React frontend, Node.js/MongoDB backend, and Flutter mobile companion app.',
    tech: ['React', 'Node.js', 'MongoDB', 'Flutter'],
    image: '🎓',
    githubLink: 'https://github.com/ilyaas75',
    stats: '3 platforms · Full-stack',
    order: 6,
    published: true,
  },
]
