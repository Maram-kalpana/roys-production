const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const bookingController = require('../controllers/bookingController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/', bookingController.list)
router.post('/', bookingController.create)
router.put('/:id', bookingController.update)
router.delete('/:id', bookingController.remove)

module.exports = router