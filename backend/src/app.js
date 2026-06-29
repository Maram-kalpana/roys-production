const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const { env } = require('./config/env')
const routes = require('./routes/index')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const logger = require('./config/logger')
const app = express()

app.set('trust proxy', 1)

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

app.use(cors({
  origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(','),
  credentials: true,
}))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
}))

app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true }))

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`)
  next()
})

app.use('/uploads', express.static(env.uploadRoot))
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

module.exports = app