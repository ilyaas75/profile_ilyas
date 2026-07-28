# Ilyas Hassan Mohamed — Portfolio Website (Frontend)

React + TypeScript + Tailwind CSS portfolio. Part of the **profile_ilyas** monorepo.

> See root [README](../README.md) for backend (`backend/`) and mobile app (`app/`).

**Primary stack showcased:** React · Node.js · MongoDB · Flutter

## Sections (multi-page)

| Route | Page |
|-------|------|
| `/` | Home — hero + featured preview |
| `/about` | About Me |
| `/skills` | Technical Skills |
| `/projects` | Projects gallery |
| `/experience` | Experience & certifications |
| `/services` | Services |
| `/contact` | Contact form |
| `/admin/profile` | Profile CRUD admin panel |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Customize Your Content

Edit files in `src/data/`:

| File | Content |
|------|---------|
| `profile.ts` | Name, bio, email, social links, stats |
| `skills.ts` | Skill categories and items |
| `projects.ts` | Project cards |
| `experience.ts` | Work history |
| `certifications.ts` | Credentials |
| `services.ts` | Service offerings |

## Contact Form

By default, the form opens a `mailto:` link. To use Formspree:

1. Create a form at [formspree.io](https://formspree.io)
2. Create `.env` in the project root:

```
VITE_FORMSPREE_ID=your_form_id
```

## Deploy

### Vercel (recommended)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Build command: `npm run build` · Output: `dist`

### Netlify

1. `npm run build`
2. Deploy the `dist` folder

## Build

```bash
npm run build
npm run preview
```
