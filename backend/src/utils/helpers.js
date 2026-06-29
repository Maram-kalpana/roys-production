const bcrypt = require('bcrypt')
const { randomUUID } = require('crypto')
const generateId = (prefix = '') => {
  const id = randomUUID()
  return prefix ? `${prefix}-${id.split('-')[0]}` : id
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

const success = (res, data, status = 200) => {
  res.status(status).json({ success: true, data })
}

const paginate = (items, page = 1, limit = 50) => {
  const start = (page - 1) * limit
  return items.slice(start, start + limit)
}

const hashPassword = async (password) => bcrypt.hash(password, 12)

const comparePassword = async (password, hash) => bcrypt.compare(password, hash)

const mapExpenseToFrontend = (row) => {
  let date = row.expense_date
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    date = date.toISOString().split('T')[0]
  } else if (date != null) {
    date = String(date).split('T')[0]
  } else {
    date = null
  }

  return {
    id: row.id,
    type: row.category || row.expense_name || 'miscellaneous',
    date,
    amount: Number(row.amount) || 0,
    description: row.notes || row.expense_name || '',
    receipt: row.receipt_url || null,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }
}

const mapExpenseFromFrontend = (body) => ({
  expense_name: body.type || body.expenseName || body.description || 'Expense',
  category: body.type || body.category || 'miscellaneous',
  amount: Number(body.amount),
  expense_date: body.date || body.expenseDate,
  notes: body.description || body.notes || '',
  receipt_url: body.receipt || body.receiptUrl || null,
})

const getMonthYearLabel = (date = new Date()) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

const formatDateOnly = (d) => {
  if (!d) return null
  if (d instanceof Date) return d.toISOString().split('T')[0]
  return String(d).split('T')[0]
}

module.exports = {
  generateId,
  asyncHandler,
  success,
  paginate,
  hashPassword,
  comparePassword,
  mapExpenseToFrontend,
  mapExpenseFromFrontend,
  getMonthYearLabel,
  formatDateOnly,
}
