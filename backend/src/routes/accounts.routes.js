const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { superAdminOnly } = require('../middleware/role')
const dashboardController = require('../controllers/dashboardController')
const router = Router()

router.use(authenticate, superAdminOnly)
router.get('/summary', dashboardController.accountsSummary)
router.get('/profit-loss', dashboardController.profitLoss)

module.exports = router