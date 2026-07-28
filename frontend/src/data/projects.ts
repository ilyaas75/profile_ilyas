import type { Project } from '../types'

/** Static fallback when API is unavailable */
export const fallbackProjects: Project[] = [
  {
    title: 'LoanFlow Approval System',
    category: 'Full-Stack',
    description:
      'A MERN web application for banking institutions to manage loan approval workflows, borrower profiles, document verification, and repayment tracking.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
    image: '🏦',
    githubLink: 'https://github.com/ilyaas75/Loan-Approval-System-',
    stats: 'MERN Stack · Role-based Auth',
    order: 1,
    published: true,
  },
  {
    title: 'FoodExpress Delivery App',
    category: 'Full-Stack',
    description:
      'A complete food delivery platform with restaurant browsing, shopping cart, checkout with WaafiPay (EVC/ZAAD/SAHAL) integration, order tracking, and admin dashboard.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'WaafiPay'],
    image: '🍔',
    githubLink: 'https://github.com/ilyaas75/food-',
    stats: '2 ⭐ · 1 Fork · Full-Stack',
    order: 2,
    published: true,
  },
  {
    title: 'Badbaado — Family Emergency App',
    category: 'Full-Stack',
    description:
      'Full-stack emergency SOS app for families & couples. Features one-tap SOS with GPS, live location tracking via Socket.IO, audio/video recording, interactive map, JWT auth, and trilingual support (Somali / Arabic RTL / English).',
    tech: ['React', 'Node.js', 'Socket.IO', 'Flutter', 'MongoDB', 'MapLibre'],
    image: '🆘',
    githubLink: 'https://github.com/ilyaas75/Emergance-family-web-and-app',
    stats: 'Web + Mobile + Backend · 3 Languages',
    order: 3,
    published: true,
  },
  {
    title: 'Smart Kutobs — Smart Library',
    category: 'Full-Stack',
    description:
      'A smart digital library and book management platform built with JavaScript. Enables users to browse, manage, and interact with a book catalog through a clean, modern interface.',
    tech: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
    image: '📚',
    githubLink: 'https://github.com/ilyaas75/Smart_kutobs',
    stats: 'Full-Stack · Book Management',
    order: 4,
    published: true,
  },
  {
    title: 'DS & ML Bootcamp',
    category: 'AI / ML',
    description:
      'Data Science and Machine Learning bootcamp notebooks and projects covering Python, pandas, NumPy, Matplotlib, Scikit-learn, and real-world datasets. 2 Stars on GitHub.',
    tech: ['Python', 'pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'],
    image: '🤖',
    githubLink: 'https://github.com/ilyaas75/ds-ml-bootcamp',
    stats: '2 ⭐ · Python · Data Science',
    order: 5,
    published: true,
  },
  {
    title: 'Personal Portfolio',
    category: 'Full-Stack',
    description:
      'This portfolio website — built with React, TypeScript, and Vite. Features an Admin Dashboard, dynamic project management, LocalStorage sync, and a stunning modern UI.',
    tech: ['React', 'TypeScript', 'Vite', 'Node.js', 'MongoDB'],
    image: '🌐',
    githubLink: 'https://github.com/ilyaas75/profile_ilyas',
    stats: 'TypeScript · Admin Panel · Responsive',
    order: 6,
    published: true,
  },
  {
    title: 'Employee Management System',
    category: 'Web',
    description:
      'A React-based employee management dashboard with Tailwind CSS. Allows HR teams to add, view, edit, and delete employee records with a clean and responsive UI.',
    tech: ['React', 'Tailwind CSS', 'JavaScript', 'Create React App'],
    image: '👥',
    githubLink: 'https://github.com/ilyaas75/employee-management',
    stats: 'React · HR Dashboard · CRUD',
    order: 7,
    published: true,
  },
  {
    title: 'Coffee Shop Website',
    category: 'Web',
    description:
      'A stylish coffee shop landing page built with pure HTML, CSS, and JavaScript. Features a beautiful product showcase, animated sections, and a fully responsive design.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '☕',
    githubLink: 'https://github.com/ilyaas75/Coffee',
    stats: 'HTML/CSS/JS · Responsive Design',
    order: 8,
    published: true,
  },
  {
    title: 'Fruits Store Website',
    category: 'Web',
    description:
      'A vibrant fruit store web page with product listings, image gallery, and smooth JavaScript interactions. Built with vanilla HTML, CSS, and JavaScript.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '🍎',
    githubLink: 'https://github.com/ilyaas75/fruits',
    stats: 'HTML/CSS/JS · Product Gallery',
    order: 9,
    published: true,
  },
  {
    title: 'Movies Browser',
    category: 'Web',
    description:
      'A dynamic movies browsing website with a visual card layout, built using vanilla HTML, CSS, and JavaScript. Browse and explore movie collections with a modern UI.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: '🎬',
    githubLink: 'https://github.com/ilyaas75/Moveis',
    stats: 'HTML/CSS/JS · Movie Cards',
    order: 10,
    published: true,
  },
  {
    title: 'University Management System',
    category: 'Desktop',
    description:
      'A C# WinForms desktop application for university management. Built with the Guna UI2 library for a premium modern interface, handling student records, courses, and database operations.',
    tech: ['C#', 'WinForms', 'Guna UI2', 'SQL Server'],
    image: '🎓',
    githubLink: 'https://github.com/ilyaas75/project-university-system-C-',
    stats: 'C# · Desktop App · WinForms',
    order: 11,
    published: true,
  },
  {
    title: 'Programming Languages Practice',
    category: 'Other',
    description:
      'A C++ practice repository covering core programming language concepts, algorithms, and data structures. Built to strengthen foundational computer science skills.',
    tech: ['C++'],
    image: '💻',
    githubLink: 'https://github.com/ilyaas75/languages',
    stats: 'C++ · Algorithms · Data Structures',
    order: 12,
    published: true,
  },
]
