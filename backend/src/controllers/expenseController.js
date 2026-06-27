const expenseService = require('../services/expenseService')
const { asyncHandler, success } = require('../utils/helpers')
const list = asyncHandler(async (req, res) => {
  const data = await expenseService.listExpenses(req.query)
  success(res, data)
})

const getOne = asyncHandler(async (req, res) => {
  const data = await expenseService.getExpenseById(req.params.id)
  if (!data) return res.status(404).json({ success: false, message: 'Expense not found' })
  success(res, data)
})

const create = asyncHandler(async (req, res) => {
  const data = await expenseService.createExpense(req.body, req.user.id)
  success(res, data, 201)
})

const update = asyncHandler(async (req, res) => {
  const data = await expenseService.updateExpense(req.params.id, req.body)
  if (!data) return res.status(404).json({ success: false, message: 'Expense not found' })
  success(res, data)
})

const remove = asyncHandler(async (req, res) => {
  const ok = await expenseService.deleteExpense(req.params.id)
  if (!ok) return res.status(404).json({ success: false, message: 'Expense not found' })
  success(res, { deleted: true })
})

module.exports = {
  expenseService,
  list,
  getOne,
  create,
  update,
  remove,
}
