import fs from 'fs'
// Models
import expressesModel, {
  IExpress,
  IExpressModel
} from '../../../models/expresses'
import usersModel, { IUserModel } from '../../../models/users'
import categoriesModel, { ICategoryModel } from '../../../models/categories'
import expressSupportsModel from '../../../models/express_supports'
import expressNotRelevansModel from '../../../models/express_not_relevans'
// Interfaces
import { IListArgs } from '../../../interfaces'
// Constants
import { expressStatConstant } from '../../../constants'
// Validations
import updateValidation from '../validations/express/updateValidation'

const Express = {
  list: async (args: IListArgs, user: IUserModel | null) => {
    const page = args && args.page ? args.page : 1
    const limit = args && args.limit ? args.limit : 10
    const query = args && args.query ? args.query : ''
    const filter = args && args.filter ? args.filter : ''
    const sort = args && args.sort ? args.sort : { createdAt: -1 }

    interface IFinalQuery {
      expressStatId: number
      isDraft: boolean
      $or?: any
      $and?: any
    }
    let finalQuery: IFinalQuery = {
      expressStatId: expressStatConstant.EXPRESS_STAT_ACTIVE,
      isDraft: false
    }

    const queryString: any = { $or: [] }
    if (query) {
      const regex = new RegExp(query, 'i')
      const arUserId = await usersModel
        .find({ isActive: true, $or: [{ username: regex }, { name: regex }] })
        .distinct('_id')

      queryString['$or'].push({ userId: { $in: arUserId } })
      queryString['$or'].push({ message: regex })
    }

    const queryFilter: any = { $and: [] }
    // if (filter) {
    //   if (filter.arCategoryId) {
    //     queryFilter['$and'].push({
    //       categoryId: { $in: filter.arCategoryId }
    //     })
    //   } else {
    //     if (user) {
    //       queryFilter['$and'].push({
    //         categoryId: { $in: user.categoryInterests }
    //       })
    //     }
    //   }
    // }

    // finalquery
    if (queryString['$or'].length > 0) {
      if (!('$and' in finalQuery)) {
        finalQuery = {
          ...finalQuery,
          $and: []
        }
      }
      finalQuery['$and'].push(queryString)
    }
    if (queryFilter['$and'].length > 0) {
      if (!('$and' in finalQuery)) {
        finalQuery = {
          ...finalQuery,
          $and: []
        }
      }
      finalQuery['$and'].push(queryFilter)
    }

    const options: any = {
      select:
        '-__v -expressStatId -isDraft -expressSupports -expressNotRelevans',
      populate: [
        {
          path: 'categoryId',
          select: 'code name'
        },
        {
          path: 'userId',
          select: 'username name avatar'
        }
      ],
      sort,
      page,
      limit
    }

    if (user !== null) {
      options.select = '-__v -expressStatId -isDraft'
      options.populate = [
        {
          path: 'categoryId',
          select: 'code name'
        },
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'expressSupports',
          select: 'userId',
          match: { userId: user._id }
        },
        {
          path: 'expressNotRelevans',
          select: 'userId',
          match: { userId: user._id }
        }
      ]
    }
    const result = await expressesModel.paginate(finalQuery, options)

    return {
      message: 'Berhasil',
      data: result
    }
  },

  firstStep: async (user: IUserModel) => {
    let newExpress = new expressesModel()
    const check = await expressesModel.findOne({
      userId: user._id,
      isDraft: true
    })

    if (check !== null) {
      newExpress = check
    }

    const generalCategory = (await categoriesModel.findOne({
      code: 'general'
    })) as ICategoryModel
    newExpress.userId = user._id
    newExpress.categoryId = generalCategory._id
    newExpress.expressStatId = expressStatConstant.EXPRESS_STAT_ACTIVE
    newExpress.isDraft = true
    await newExpress.save()

    return {
      message: 'Berhasil',
      data: newExpress
    }
  },

  saveImage: async (id: string, file: any) => {
    const express = (await expressesModel.findById(id)) as IExpressModel

    const lastImageUrl = express.imageUrl
    if (lastImageUrl !== null && fs.existsSync(`public/${lastImageUrl}`)) {
      fs.unlink(`public/${lastImageUrl}`, (err: any) => {
        if (err) {
          throw {
            message: 'Gagal hapus image',
            errors: {}
          }
        }
      })
    }

    const path = file.path
    const arPath = path.split('public/')
    express.image = file.filename
    express.imageUrl = arPath[1]
    await express.save()

    return {
      message: 'Berhasil',
      data: express
    }
  },

  update: async (user: IUserModel, id: string, args: IExpress) => {
    const express = await expressesModel.findOne({
      _id: id,
      userId: user._id
    })
    if (express === null) {
      throw {
        message: 'Data tidak ditemukan',
        errors: {}
      }
    }

    const valid = await updateValidation(args)

    // express.categoryId = args.categoryId
    express.message = args.message
    express.expressStatId = expressStatConstant.EXPRESS_STAT_ACTIVE
    express.isDraft = false
    await express.save()

    return {
      message: 'Berhasil',
      data: express
    }
  },

  support: async (user: IUserModel, id: string) => {
    const express = await expressesModel.findOne({
      _id: id,
      isDraft: false,
      expressStatId: expressStatConstant.EXPRESS_STAT_ACTIVE
    })

    if (express === null) {
      throw {
        message: 'Data tidak ditemukan',
        errors: {}
      }
    }

    const check = await expressSupportsModel.findOne({
      expressId: id,
      userId: user._id
    })

    if (check === null) {
      // create express support
      const expressSupport = new expressSupportsModel()
      expressSupport.expressId = express._id
      expressSupport.userId = user._id
      await expressSupport.save()

      // remove not relevan
      const notRelevan = await expressNotRelevansModel.findOne({
        expressId: express._id,
        userId: user._id
      })
      if (notRelevan !== null) {
        await notRelevan.remove()
      }

      // update express
      const arExpressSupportId = await expressSupportsModel
        .find({
          expressId: express._id
        })
        .distinct('_id')
      const arExpressNotRelevanId = await expressNotRelevansModel
        .find({
          expressId: express._id
        })
        .distinct('_id')
      express.supportCount = arExpressSupportId.length
      express.notRelevanCount = arExpressNotRelevanId.length
      express.expressSupports = arExpressSupportId
      express.expressNotRelevans = arExpressNotRelevanId
      await express.save()
    }

    const data = await expressesModel
      .findById(id)
      .select('-__v -isDraft -expressStatId')
      .populate([
        {
          path: 'categoryId',
          select: 'code name'
        },
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'expressSupports',
          select: 'userId',
          match: { userId: user._id }
        },
        {
          path: 'expressNotRelevans',
          select: 'userId',
          match: { userId: user._id }
        }
      ])

    return {
      message: 'Berhasil',
      data
    }
  },

  notRelevan: async (user: IUserModel, id: string) => {
    const express = await expressesModel.findOne({
      _id: id,
      isDraft: false,
      expressStatId: expressStatConstant.EXPRESS_STAT_ACTIVE
    })

    if (express === null) {
      throw {
        message: 'Data tidak ditemukan',
        errors: {}
      }
    }

    const check = await expressNotRelevansModel.findOne({
      expressId: id,
      userId: user._id
    })

    if (check === null) {
      // create express not relevan
      const expressNotRelevan = new expressNotRelevansModel()
      expressNotRelevan.expressId = express._id
      expressNotRelevan.userId = user._id
      await expressNotRelevan.save()

      // remove support
      const support = await expressSupportsModel.findOne({
        expressId: express._id,
        userId: user._id
      })
      if (support !== null) {
        await support.remove()
      }

      // update express
      const arExpressSupportId = await expressSupportsModel
        .find({
          expressId: express._id
        })
        .distinct('_id')
      const arExpressNotRelevanId = await expressNotRelevansModel
        .find({
          expressId: express._id
        })
        .distinct('_id')
      express.supportCount = arExpressSupportId.length
      express.notRelevanCount = arExpressNotRelevanId.length
      express.expressSupports = arExpressSupportId
      express.expressNotRelevans = arExpressNotRelevanId
      await express.save()
    }

    const data = await expressesModel
      .findById(id)
      .select('-__v -isDraft -expressStatId')
      .populate([
        {
          path: 'categoryId',
          select: 'code name'
        },
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'expressSupports',
          select: 'userId',
          match: { userId: user._id }
        },
        {
          path: 'expressNotRelevans',
          select: 'userId',
          match: { userId: user._id }
        }
      ])

    return {
      message: 'Berhasil',
      data
    }
  }
}

export default Express
