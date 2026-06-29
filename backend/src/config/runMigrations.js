const fs = require('fs')
const path = require('path')
const MIGRATIONS_DIR = path.join(__dirname, '../../database/migrations')

const CUSTOMER_COLUMNS = [
  ['aadhaar_front_url', 'TEXT NULL'],
  ['aadhaar_back_url', 'TEXT NULL'],
  ['driving_license_url', 'TEXT NULL'],
  ['notes', 'TEXT NULL'],
]

const columnExists = async (conn, dbName, table, column) => {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS count FROM information_schema.columns
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [dbName, table, column],
  )
  return Number(rows[0].count) > 0
}

const tableExists = async (conn, dbName, table) => {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS count FROM information_schema.tables
     WHERE table_schema = ? AND table_name = ?`,
    [dbName, table],
  )
  return Number(rows[0].count) > 0
}

const EXPENSE_COLUMNS = [
  ['receipt_url', 'TEXT NULL'],
]

const ensureCustomerSoftDeleteStatus = async (conn, dbName, logger) => {
  const [rows] = await conn.query(
    `SELECT COLUMN_TYPE AS col FROM information_schema.columns
     WHERE table_schema = ? AND table_name = 'customers' AND column_name = 'status'`,
    [dbName],
  )
  const colType = rows[0]?.col || ''
  if (!colType.includes("'deleted'")) {
    logger.info?.('Adding deleted value to customers.status enum')
    await conn.query(
      `ALTER TABLE customers MODIFY COLUMN status ENUM('checked-in', 'checked-out', 'deleted') DEFAULT 'checked-in'`,
    )
  }
}

const runMigrations = async (conn, dbName, logger = console) => {
  for (const [column, definition] of CUSTOMER_COLUMNS) {
    const exists = await columnExists(conn, dbName, 'customers', column)
    if (!exists) {
      logger.info?.(`Adding column customers.${column}`)
      await conn.query(`ALTER TABLE customers ADD COLUMN ${column} ${definition}`)
    }
  }

  const splitsExists = await tableExists(conn, dbName, 'monthly_payment_splits')
  if (!splitsExists && fs.existsSync(MIGRATIONS_DIR)) {
    const migrationFile = path.join(MIGRATIONS_DIR, '001_split_payments.sql')
    if (fs.existsSync(migrationFile)) {
      logger.info?.('Running migration: 001_split_payments.sql')
      const sql = fs.readFileSync(migrationFile, 'utf8')
      await conn.query(sql)
    }
  }

  for (const [column, definition] of EXPENSE_COLUMNS) {
    const exists = await columnExists(conn, dbName, 'expenses', column)
    if (!exists) {
      logger.info?.(`Adding column expenses.${column}`)
      await conn.query(`ALTER TABLE expenses ADD COLUMN ${column} ${definition}`)
    }
  }

  await ensureCustomerSoftDeleteStatus(conn, dbName, logger)
}

module.exports = {
  fs,
  path,
  MIGRATIONS_DIR,
  CUSTOMER_COLUMNS,
  columnExists,
  tableExists,
  EXPENSE_COLUMNS,
  ensureCustomerSoftDeleteStatus,
  runMigrations,
}
