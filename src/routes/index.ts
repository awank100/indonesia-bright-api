import express from 'express'
// cores
import publicRoutes from './cores/public'
import authRoutes from './cores/auth'
import memberRoutes from './cores/member'
import expressRoutes from './expresses'
import commentsRoutes from './comments'

const routes = express.Router()

const version = '/v1'

routes.use(version, publicRoutes)
routes.use(version, authRoutes)
routes.use(version, memberRoutes)
routes.use(version, expressRoutes)
routes.use(version, commentsRoutes)

export default routes
