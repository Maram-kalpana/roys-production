const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin, superAdminOnly } = require('../middleware/role')
const dashboardController = require('../controllers/dashboardController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/stats', dashboardController.stats)
router.get('/monthly-payments/stats', dashboardController.monthlyStats)
router.get('/vacancy/stats', dashboardController.vacancyStats)

module.exports = router