const app = require('./src/app')
const { env } = require('./src/config/env')
const { initializeDatabase } = require('./src/config/initDb')
const logger = require('./src/config/logger')
const start = async () => {
  try {
    const tables = await initializeDatabase()
    logger.info('Tables ready:', tables.join(', '))

    app.listen(env.port, () => {
      logger.info(`Roys Hotel API running on port ${env.port} [${env.nodeEnv}]`)
      logger.info(`Health check: http://localhost:${env.port}/api/health`)
    })
  } catch (err) {
    logger.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
