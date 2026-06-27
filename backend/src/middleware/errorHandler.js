const { validationResult } = require('express-validator')
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    })
  }
  next()
}

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
}

const errorHandler = (err, req, res, _next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
}

module.exports = {
  validate,
  notFound,
  errorHandler,
}
