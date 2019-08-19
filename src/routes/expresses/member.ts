import express from 'express'
// Middlewares
import memberMiddleware from '../../middlewares/member'
// Controllers
import * as expressController from '../../modules/expresses/controllers/expressController'
// Repositories
import MyUpload from '../../modules/cores/repositories/MyUpload'

const member = express.Router()

member.post('/expresses/list', memberMiddleware, expressController.list)
member.get(
  '/expresses/first-step',
  memberMiddleware,
  expressController.firstStep
)
member.put(
  '/expresses/:id/upload-image',
  memberMiddleware,
  MyUpload.expressImage,
  expressController.saveImage
)
member.put('/expresses/:id/update', memberMiddleware, expressController.update)
member.get(
  '/expresses/:id/support',
  memberMiddleware,
  expressController.support
)
member.get(
  '/expresses/:id/not-relevan',
  memberMiddleware,
  expressController.notRelevan
)

export default member
