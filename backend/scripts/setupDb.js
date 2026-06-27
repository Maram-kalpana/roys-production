const dotenv = require('dotenv')
const { initializeDatabase } = require('../src/config/initDb')

dotenv.config()

const run = async () => {
  console.log('setupDb: initializeDatabase called')
  await initializeDatabase()
  console.log('Database setup complete.')
  console.log('Super Admin: superadmin / SuperAdmin@123')
  console.log('Admin: admin / Admin@123')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

module.exports = {
  dotenv,
  run,
}
