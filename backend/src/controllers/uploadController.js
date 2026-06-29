const path = require('path')
const { asyncHandler, success } = require('../utils/helpers')
const { env } = require('../config/env')
const uploadRoot = env.uploadRoot

const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file || req.files?.file?.[0]

  if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' })

  const field = req.body?.field || req.query?.field || 'photo'
  const relative = path.relative(uploadRoot, file.path).split(path.sep).join('/')
  const url = `/uploads/${relative}`

  success(res, {
    url,
    imageUrl: url,
    filename: file.filename,
    mimeType: file.mimetype,
    field,
  })
})

module.exports = {
  uploadFile,
}
