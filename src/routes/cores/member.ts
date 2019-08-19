import express from 'express'
// Middlewares
import memberMiddleware from '../../middlewares/member'
// Controllers
import * as userController from '../../modules/cores/controllers/userController'

const routes = express.Router()

// public
routes.post('/member/set-fire', memberMiddleware, userController.setFire)
routes.post('/member/set-interests', memberMiddleware, userController.setInterests)
routes.get('/member/profile', memberMiddleware, userController.getProfile)

export default routes

