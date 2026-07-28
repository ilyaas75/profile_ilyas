import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: '📁' },
    tech: { type: [String], default: [] },
    githubLink: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Web', 'Backend', 'Mobile', 'Full-Stack'],
      default: 'Web',
    },
    stats: { type: String, default: '' },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.Project || mongoose.model('Project', projectSchema)
