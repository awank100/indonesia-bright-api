import { Request as IRequest, Response as IResponse } from 'express'
// Services
import Response from '../../../services/Response'
// Repositories
import Auth from '../../cores/repositories/Auth'
import Comment from '../repositories/Comment'

export async function list(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    let user = null
    if (req.header('Authorization')) {
      user = await Auth.getMemberLogin(req.header('Authorization') as string)
    }
    const result = await Comment.list(req.body, req.params.expressId, user)
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

export async function create(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await Comment.create(user, req.params.expressId, req.body)
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

export async function update(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await Comment.update(user, req.params.expressId, req.params.id, req.body)
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

export async function love(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await Comment.love(user, req.params.expressId, req.params.id)
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