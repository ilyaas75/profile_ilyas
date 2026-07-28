import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.join(__dirname, '../../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

function createImageUploader(prefix) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg'
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg'
      cb(null, `${prefix}-${Date.now()}${safeExt}`)
    },
  })

  const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  })
}

export const uploadAvatar = createImageUploader('avatar')
export const uploadProjectImage = createImageUploader('project')

/** @deprecated use deleteUploadFile */
export function deleteAvatarFile(avatarPath) {
  deleteUploadFile(avatarPath)
}

export function deleteUploadFile(filePath) {
  if (!filePath || !filePath.startsWith('/uploads/')) return
  const fullPath = path.join(uploadsDir, path.basename(filePath))
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}
