const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const customerController = require('../controllers/customerController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/', customerController.list)
router.get('/:id', customerController.getOne)
router.post('/', customerController.create)
router.put('/:id', customerController.update)
router.delete('/:id', customerController.remove)
router.post('/:id/checkout', customerController.checkout)

module.exports = router