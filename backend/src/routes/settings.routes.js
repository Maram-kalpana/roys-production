const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const settingsController = require('../controllers/settingsController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/', settingsController.get)
router.put('/', settingsController.update)

module.exports = router