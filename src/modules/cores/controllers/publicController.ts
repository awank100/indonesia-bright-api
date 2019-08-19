import { Request as IRequest, Response as IResponse } from 'express'
import Response from '../../../services/Response'
// Repositories

export async function hello(req: IRequest, res: IResponse) {
  const response = new Response()
  try {
    response.setMessage('Berhasil')
    response.setData({
      msg: 'hello'
    })
  } catch (e) {
    res.status(400)
    response.setStatus(false)
    response.setMessage(e.message)
    response.setErrors(e.errors)
  }
  res.json(response)
}