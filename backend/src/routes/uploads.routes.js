const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const { upload } = require('../middleware/upload')
const uploadController = require('../controllers/uploadController')
const router = Router()

router.use(authenticate, anyAdmin)
router.post('/', upload.single('file'), uploadController.uploadFile)

module.exports = router