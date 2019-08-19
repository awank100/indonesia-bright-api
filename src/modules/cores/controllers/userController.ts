import { Request as IRequest, Response as IResponse } from 'express'
// Services
import Response from '../../../services/Response'
// Repositories
import Auth from '../repositories/Auth'
import User from '../repositories/User'

export async function setFire(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await User.setFire(user, req.body)
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

export async function getProfile(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await User.getProfile(user._id)
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

export async function setInterests(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await User.setInterests(user, req.body)
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