const roomService = require('../services/roomService')
const { asyncHandler, success } = require('../utils/helpers')
const getOne = asyncHandler(async (req, res) => {
  const data = await roomService.getRoomById(req.params.id)
  if (!data) return res.status(404).json({ success: false, message: 'Room not found' })
  success(res, data)
})

const listRooms = asyncHandler(async (req, res) => {
  success(res, await roomService.listRooms(req.query))
})

const listBeds = asyncHandler(async (req, res) => {
  success(res, await roomService.listBeds(req.query))
})

const createRoom = asyncHandler(async (req, res) => {
  success(res, await roomService.createRoom(req.body), 201)
})

const updateRoom = asyncHandler(async (req, res) => {
  success(res, await roomService.updateRoom(req.params.id, req.body))
})

const deleteRoom = asyncHandler(async (req, res) => {
  await roomService.deleteRoom(req.params.id)
  success(res, { deleted: true })
})

const updateBed = asyncHandler(async (req, res) => {
  success(res, await roomService.updateBed(req.params.id, req.body))
})

const deleteBed = asyncHandler(async (req, res) => {
  await roomService.deleteBed(req.params.id)
  success(res, { deleted: true })
})

module.exports = {
  roomService,
  getOne,
  listRooms,
  listBeds,
  createRoom,
  updateRoom,
  deleteRoom,
  updateBed,
  deleteBed,
}
