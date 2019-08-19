import express from 'express'
import memberRoutes from './member'

const routes = express.Router()

routes.use('/member', memberRoutes)

export default routes
