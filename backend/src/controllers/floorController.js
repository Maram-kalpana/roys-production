const floorService = require('../services/floorService')
const { asyncHandler, success } = require('../utils/helpers')
const list = asyncHandler(async (_req, res) => {
  success(res, await floorService.listFloors())
})

module.exports = {
  floorService,
  list,
}
