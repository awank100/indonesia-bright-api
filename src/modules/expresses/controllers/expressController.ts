import { Request as IRequest, Response as IResponse } from 'express'
// Services
import Response from '../../../services/Response'
// Repositories
import Auth from '../../cores/repositories/Auth'
import Express from '../repositories/Express'

export async function list(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    let user = null
    if (req.header('Authorization')) {
      user = await Auth.getMemberLogin(req.header('Authorization') as string)
    }
    const result = await Express.list(req.body, user)
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

export async function firstStep(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await Express.firstStep(user)
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

export async function saveImage(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const result = await Express.saveImage(req.params.id, req.file)
    response.setData(result.data)
    response.setMessage(result.message)
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
    const result = await Express.update(user, req.params.id, req.body)
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

export async function support(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await Express.support(user, req.params.id)
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

export async function notRelevan(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    const user = await Auth.getMemberLogin(req.header('Authorization') as string)
    const result = await Express.notRelevan(user, req.params.id)
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