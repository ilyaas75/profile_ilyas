import Profile from '../models/Profile.js'
import { defaultProfile } from '../data/defaultProfile.js'

export async function seedProfileIfEmpty() {
  const count = await Profile.countDocuments()
  if (count === 0) {
    await Profile.create(defaultProfile)
    console.log('Default profile seeded')
  }
}
