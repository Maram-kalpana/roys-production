const { Router } = require('express')
const { body } = require('express-validator')
const { authenticate } = require('../middleware/auth')
const { anyAdmin, superAdminOnly } = require('../middleware/role')
const { validate } = require('../middleware/errorHandler')
const expenseController = require('../controllers/expenseController')
const router = Router()

router.use(authenticate, anyAdmin)

router.get('/', expenseController.list)
router.get('/:id', expenseController.getOne)
router.post('/', [
  body('type').optional().trim(),
  body('amount').isNumeric(),
  body('date').notEmpty(),
  validate,
], expenseController.create)
router.put('/:id', expenseController.update)
router.delete('/:id', expenseController.remove)

module.exports = router