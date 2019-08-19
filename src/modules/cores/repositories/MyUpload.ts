import {
  Request as IRequest,
  Response as IResponse,
  NextFunction as INextFunction
} from 'express'
import multer from 'multer'
import randomString from 'randomstring'
import path from 'path'
import fs from 'fs'
import Moment from 'moment'
// Services
import Response from '../../../services/Response'
// Models
import expressesModel from '../../../models/expresses'
// Repositories
import Auth from '../../../modules/cores/repositories/Auth'

const MyUpload = {
  expressImage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    const response = new Response()
    try {
      const user = await Auth.getMemberLogin(req.header(
        'Authorization'
      ) as string)
      const express = await expressesModel.findOne({
        _id: req.params.id,
        userId: user._id
      })

      if (express === null) {
        throw {
          message: 'Data tidak ditemukan',
          errors: {}
        }
      }

      // start uploading
      const folder = Moment().format('YYYY-MM')
      const maxSize = Number(process.env.EXPRESS_IMAGE_MAX_FILESIZE)
      const storageConfig = multer.diskStorage({
        destination: (req, file, cb) => {
          const destinationPath = `${process.env
            .EXPRESS_IMAGE_PATH as string}/${folder}/`
          if (fs.existsSync(`public/${destinationPath}`) === false) {
            fs.mkdirSync(`public/${destinationPath}`)
          }
          cb(null, `public/${destinationPath}`)
        },
        filename: (req, file, cb) => {
          const fileName =
            randomString.generate(8) +
            '-' +
            Date.now() +
            path.extname(file.originalname)
          cb(null, fileName)
        }
      })
      const upload = multer({
        storage: storageConfig,
        limits: { fileSize: maxSize },
        fileFilter: (req, file, cb) => {
          const mimeType = ['image/jpg', 'image/jpeg', 'image/png']
          if (!mimeType.includes(file.mimetype)) {
            throw {
              message: 'Format file tidak diijinkan',
              errors: {}
            }
          }
          cb(null, true)
        }
      })
      const uploader = upload.single('image')
      uploader(req, res, err => {
        if (err) {
          res.status(400)
          res.json({
            message: 'Terjadi kesalahan',
            errors: {
              image: [err.message]
            }
          })
        } else {
          if (req.file === undefined) {
            throw {
              message: 'Request tidak didukung',
              errors: {}
            }
          } else {
            next()
          }
        }
      })
    } catch (e) {
      res.status(400)
      response.setStatus(false)
      response.setMessage(e.message)
      response.setErrors(e.errors)
    }
  }
}

export default MyUpload
