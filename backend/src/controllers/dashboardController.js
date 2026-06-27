const dashboardService = require('../services/dashboardService')
const accountsService = require('../services/accountsService')
const { asyncHandler, success } = require('../utils/helpers')
const stats = asyncHandler(async (_req, res) => {
  success(res, await dashboardService.getDashboardStats())
})

const monthlyStats = asyncHandler(async (_req, res) => {
  success(res, await dashboardService.getMonthlyPaymentStats())
})

const vacancyStats = asyncHandler(async (_req, res) => {
  success(res, await dashboardService.getVacancyStats())
})

const accountsSummary = asyncHandler(async (req, res) => {
  success(res, await accountsService.getAccountsSummary(req.query))
})

const profitLoss = asyncHandler(async (req, res) => {
  success(res, await accountsService.getProfitLossReport(req.query))
})

module.exports = {
  dashboardService,
  accountsService,
  stats,
  monthlyStats,
  vacancyStats,
  accountsSummary,
  profitLoss,
}
