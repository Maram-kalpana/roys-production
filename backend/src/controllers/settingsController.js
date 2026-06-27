const settingsService = require('../services/settingsService')
const { asyncHandler, success } = require('../utils/helpers')
const get = asyncHandler(async (_req, res) => {
  success(res, await settingsService.getSettings())
})

const update = asyncHandler(async (req, res) => {
  success(res, await settingsService.updateSettings(req.body))
})

module.exports = {
  settingsService,
  get,
  update,
}
