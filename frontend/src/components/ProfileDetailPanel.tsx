import { ProfileAvatar } from './ProfileAvatar'
import type { ProfileDocument } from '../types'

interface ProfileDetailPanelProps {
  profile: ProfileDocument
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-200">{value}</dd>
    </div>
  )
}

export function ProfileDetailPanel({ profile, onEdit, onDelete, onClose }: ProfileDetailPanelProps) {
  return (
    <div className="surface-card mb-10 p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProfileAvatar avatar={profile.avatar} name={profile.name} size="sm" fallback="initials" />
          <div>
            <h2 className="text-xl font-semibold text-white">
              {profile.name}
              {profile.isPrimary && (
                <span className="ml-2 rounded bg-accent-teal/20 px-2 py-0.5 text-xs text-accent-teal">
                  Primary
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-400">{profile.title}</p>
            <p className="text-sm text-accent-teal">{profile.tagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onEdit} className="btn-primary text-sm">
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
          >
            Delete
          </button>
          <button type="button" onClick={onClose} className="btn-outline text-sm">
            Close
          </button>
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <DetailRow label="Email" value={profile.email} />
        <DetailRow label="Location" value={profile.location} />
        <DetailRow label="Availability" value={profile.availability} />
        {profile.stackFocus.length > 0 && (
          <DetailRow label="Stack" value={profile.stackFocus.join(' · ')} />
        )}
        {profile.specialties.length > 0 && (
          <DetailRow label="Specialties" value={profile.specialties.join(' · ')} />
        )}
        <DetailRow label="GitHub" value={profile.social.github} />
        <DetailRow label="LinkedIn" value={profile.social.linkedin} />
        <DetailRow label="Twitter" value={profile.social.twitter} />
      </dl>

      {profile.bio.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Bio</h3>
          {profile.bio.map((paragraph, i) => (
            <p key={i} className="mb-2 text-sm leading-relaxed text-slate-300">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {profile.philosophy && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Philosophy
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">{profile.philosophy}</p>
        </div>
      )}

      {profile.facts.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Facts</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-300">
            {profile.facts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['projects', 'experience', 'certifications', 'technologies'] as const).map((key) => (
          <div key={key} className="rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-center">
            <p className="text-lg font-semibold text-white">{profile.stats[key]}</p>
            <p className="text-xs capitalize text-slate-500">{key}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-600">
        ID: {profile._id}
        {profile.updatedAt && ` · Updated ${new Date(profile.updatedAt).toLocaleString()}`}
      </p>
    </div>
  )
}
