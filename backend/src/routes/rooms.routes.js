const { Router } = require('express')
const { authenticate } = require('../middleware/auth')
const { anyAdmin } = require('../middleware/role')
const roomController = require('../controllers/roomController')
const router = Router()

router.use(authenticate, anyAdmin)
router.get('/', roomController.listRooms)
router.get('/:id', roomController.getOne)
router.post('/', roomController.createRoom)
router.put('/:id', roomController.updateRoom)
router.delete('/:id', roomController.deleteRoom)

module.exports = router