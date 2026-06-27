const mysql = require('mysql2/promise')
const { env } = require('./env')

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  timezone: '+00:00',
})

// Save the real driver method before we shadow it
const rawGetConnection = pool.getConnection.bind(pool)

const query = (sql, params = []) => pool.execute(sql, params)
const getConnection = () => rawGetConnection()

module.exports = pool
module.exports.query = query
module.exports.getConnection = getConnection