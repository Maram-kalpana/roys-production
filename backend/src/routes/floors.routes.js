const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const floorController = require('../controllers/floorController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/', floorController.list)

module.exports = router