const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const roomController = require('../controllers/roomController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/', roomController.listBeds)
router.get('/vacant', (req, res, next) => {
  req.query.status = 'vacant'
  roomController.listBeds(req, res, next)
})
router.patch('/:id', roomController.updateBed)
router.delete('/:id', roomController.deleteBed)

module.exports = router