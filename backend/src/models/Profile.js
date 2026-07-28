import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, required: true, trim: true },
    stackFocus: { type: [String], default: [] },
    specialties: { type: [String], default: [] },
    availability: { type: String, default: 'Open to Opportunities' },
    email: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    social: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    bio: { type: [String], default: [] },
    philosophy: { type: String, default: '' },
    stats: {
      projects: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
      technologies: { type: Number, default: 0 },
    },
    facts: { type: [String], default: [] },
    avatar: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema)
