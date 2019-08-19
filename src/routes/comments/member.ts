import express from 'express'
// Middlewares
import memberMiddleware from '../../middlewares/member'
// Controllers
import * as commentController from '../../modules/expresses/controllers/commentController'

const member = express.Router()

member.post('/comments/:expressId/list', memberMiddleware, commentController.list)
member.post('/comments/:expressId/create', memberMiddleware, commentController.create)
member.put('/comments/:expressId/update/:id', memberMiddleware, commentController.update)
member.get(
  '/comments/:expressId/love/:id',
  memberMiddleware,
  commentController.love
)

export default member
