const bookingService = require('../services/bookingService')
const { asyncHandler, success } = require('../utils/helpers')
const list = asyncHandler(async (req, res) => {
  success(res, await bookingService.listBookings({ ...req.query, role: req.user.role }))
})

const create = asyncHandler(async (req, res) => {
  success(res, await bookingService.createBooking(req.body), 201)
})

const update = asyncHandler(async (req, res) => {
  success(res, await bookingService.updateBooking(req.params.id, req.body))
})

const remove = asyncHandler(async (req, res) => {
  await bookingService.deleteBooking(req.params.id)
  success(res, { deleted: true })
})

module.exports = {
  bookingService,
  list,
  create,
  update,
  remove,
}
