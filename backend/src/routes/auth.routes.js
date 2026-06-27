const { Router } = require('express')
const { body } = require('express-validator')
const { validate } = require('../middleware/errorHandler')
const { authenticate } = require('../middleware/auth')
const authController = require('../controllers/authController')
const router = Router()

router.post('/login', [
  body('username').trim().notEmpty(),
  body('password').notEmpty(),
  validate,
], authController.login)

router.post('/register', [
  body('username').trim().notEmpty(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  validate,
], authController.register)

router.get('/me', authenticate, authController.me)
router.post('/logout', authenticate, authController.logout)

module.exports = router