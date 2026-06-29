const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { env } = require('../config/env')
const uploadRoot = env.uploadRoot

const SUBDIRS = {
  photo: 'customers',
  aadhaarDoc: 'identity-proofs',
  aadhaarFront: 'identity-proofs',
  aadhaarBack: 'identity-proofs',
  panDoc: 'identity-proofs',
  receipt: 'identity-proofs',
}

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

ensureDir(uploadRoot)
Object.values(SUBDIRS).forEach((sub) => ensureDir(path.join(uploadRoot, sub)))

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const field = req.body?.field || req.query?.field || 'photo'
    const subdir = SUBDIRS[field] || 'identity-proofs'
    const dest = path.join(uploadRoot, subdir)
    ensureDir(dest)
    cb(null, dest)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf']
  const ext = path.extname(file.originalname).toLowerCase()
  const isImageMime = file.mimetype?.startsWith('image/')
  if (allowed.includes(ext) || (isImageMime && !ext)) cb(null, true)
  else cb(new Error('Only JPG, PNG, and PDF files are allowed'))
}

const upload = multer({
  storage,
  limits: { fileSize: env.maxFileSize },
  fileFilter,
})

module.exports = {
  upload,
  uploadRoot,
  SUBDIRS,
}
