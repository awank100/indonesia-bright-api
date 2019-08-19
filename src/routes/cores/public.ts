import express from 'express'

import * as publicController from '../../modules/cores/controllers/publicController'
import * as expressController from '../../modules/expresses/controllers/expressController'
import * as commentController from '../../modules/expresses/controllers/commentController'

const main = express.Router()

// public
main.get('/', publicController.hello)
main.post('/expresses/list', expressController.list)
main.post('/comments/:expressId/list', commentController.list)

export default main
