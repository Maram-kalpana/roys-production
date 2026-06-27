const customerService = require('../services/customerService')
const { asyncHandler, success } = require('../utils/helpers')
const list = asyncHandler(async (req, res) => {
  success(res, await customerService.listCustomers(req.query))
})

const getOne = asyncHandler(async (req, res) => {
  const data = await customerService.getCustomerById(req.params.id)
  if (!data) return res.status(404).json({ success: false, message: 'Customer not found' })
  success(res, data)
})

const create = asyncHandler(async (req, res) => {
  success(res, await customerService.createCustomer(req.body), 201)
})

const update = asyncHandler(async (req, res) => {
  success(res, await customerService.updateCustomer(req.params.id, req.body))
})

const checkout = asyncHandler(async (req, res) => {
  success(res, await customerService.checkoutCustomer(req.params.id))
})

const remove = asyncHandler(async (req, res) => {
  const ok = await customerService.deleteCustomer(req.params.id)
  if (!ok) return res.status(404).json({ success: false, message: 'Customer not found' })
  success(res, { deleted: true })
})

module.exports = {
  customerService,
  list,
  getOne,
  create,
  update,
  checkout,
  remove,
}
