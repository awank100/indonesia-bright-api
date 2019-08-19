import express from 'express'
// Middlewares
import memberMiddleware from '../../middlewares/member'
// Controllers
import * as authController from '../../modules/cores/controllers/authController'

const routes = express.Router()

// public
routes.post('/register', authController.register)
routes.post('/login', authController.login)

export default routes

