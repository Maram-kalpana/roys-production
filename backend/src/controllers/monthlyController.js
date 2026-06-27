const monthlyService = require('../services/monthlyService')
const { asyncHandler, success } = require('../utils/helpers')
const list = asyncHandler(async (req, res) => {
  success(res, await monthlyService.listTenants(req.query))
})

const listPending = asyncHandler(async (_req, res) => {
  await monthlyService.refreshPendingStatuses()
  success(res, await monthlyService.listPending())
})

const listPaid = asyncHandler(async (_req, res) => {
  success(res, await monthlyService.listPaid())
})

const listDues = asyncHandler(async (req, res) => {
  await monthlyService.refreshPendingStatuses()
  success(res, await monthlyService.listDues(req.query))
})

const getById = asyncHandler(async (req, res) => {
  success(res, await monthlyService.getTenant(req.params.id))
})

const create = asyncHandler(async (req, res) => {
  success(res, await monthlyService.createTenant(req.body), 201)
})

const addPayment = asyncHandler(async (req, res) => {
  success(res, await monthlyService.addSplitPayment(req.params.id, req.body))
})

const markPaid = asyncHandler(async (req, res) => {
  success(res, await monthlyService.markTenantPaid(req.params.id, req.body))
})

const update = asyncHandler(async (req, res) => {
  success(res, await monthlyService.updateTenant(req.params.id, req.body))
})

const remove = asyncHandler(async (req, res) => {
  await monthlyService.deleteTenant(req.params.id)
  success(res, { deleted: true })
})

const collectionSummary = asyncHandler(async (req, res) => {
  success(res, await monthlyService.getCollectionSummary(req.query))
})

const exportCsv = asyncHandler(async (req, res) => {
  const data = await monthlyService.listDues(req.query)
  const headers = ['Customer', 'Phone', 'Room', 'Month', 'Rent', 'Paid', 'Balance', 'Status']
  const rows = data.map((d) => [
    d.customerName, d.phone, d.roomNumber, d.month,
    d.totalRent, d.totalPaid, d.balanceAmount, d.paymentStatus,
  ])
  const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=monthly-dues.csv')
  res.send(csv)
})

module.exports = {
  monthlyService,
  list,
  listPending,
  listPaid,
  listDues,
  getById,
  create,
  addPayment,
  markPaid,
  update,
  remove,
  collectionSummary,
  exportCsv,
}
