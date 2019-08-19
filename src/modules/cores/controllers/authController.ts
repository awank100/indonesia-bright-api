import { Request as IRequest, Response as IResponse } from 'express'
// Services
import Response from '../../../services/Response'
// Repositories
import Auth from '../repositories/Auth'
import User from '../repositories/User'

export async function register(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const result = await User.register(req.body)
    response.setMessage(result.message)
    response.setData(result.data)
  } catch (e) {
    res.status(400)
    response.setStatus(false)
    response.setMessage(e.message)
    response.setErrors(e.errors)
  }
  res.json(response)
}

export async function login(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const result = await Auth.login(req.body)
    response.setMessage(result.message)
    response.setData(result.data)
  } catch (e) {
    res.status(400)
    response.setStatus(false)
    response.setMessage(e.message)
    response.setErrors(e.errors)
  }
  res.json(response)
}