import {
  Request as IRequest,
  Response as IResponse,
  NextFunction as INextFunction
} from 'express'
// Services
import Response from '../services/Response'
// Repositories
import Auth from '../modules/cores/repositories/Auth'
import { userTypeConstant } from '../constants'

export default async (req: IRequest, res: IResponse, next: INextFunction) => {
  const response = new Response()
  try {
    const isAuthorized = await Auth.checkAuthorization(
      req.header('Authorization') as string,
      userTypeConstant.USER_TYPE_MEMBER
    )
    next()
  } catch (e) {
    response.setStatus(false)
    response.setMessage(e.message)
    response.setErrors(e.errors)
    res.status(403).json(response)
  }
}
