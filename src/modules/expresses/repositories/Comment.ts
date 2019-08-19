import expressesModel from '../../../models/expresses'
import commentsModel, { IComment } from '../../../models/comments'
import commentLovesModel from '../../../models/comment_loves'
import { IUserModel } from '../../../models/users'
// Interfaces
import { IListArgs } from '../../../interfaces'
// Constants
import { expressStatConstant, commentStatConstant } from '../../../constants'
// Validations
import createValidation from '../validations/comment/createValidation'

const Comment = {
  list: async (args: IListArgs, expressId: string, user: IUserModel | null) => {
    const page = args && args.page ? args.page : 1
    const limit = args && args.limit ? args.limit : 10
    const query = args && args.query ? args.query : ''
    const filter = args && args.filter ? args.filter : ''
    const sort = args && args.sort ? args.sort : { joinDate: -1 }

    interface IFinalQuery {
      expressId: string
      commentStatId: number
      $or?: any
      $and?: any
    }
    let finalQuery: IFinalQuery = {
      expressId,
      commentStatId: commentStatConstant.COMMENT_STAT_ACTIVE
    }

    const queryString: any = { $or: [] }
    // if (query) {
    //   const regex = new RegExp(query, 'i')
    //   queryString['$or'].push({ message: regex })
    // }

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
      select: '-__v -commentStatId -expressId -commentLoves',
      populate: [
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
      options.select = '-__v -commentStatId -expressId',
      options.populate = [
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'commentLoves',
          select: 'userId',
          match: { userId: user._id }
        }
      ]
    }
    const result = await commentsModel.paginate(finalQuery, options)
    return {
      message: 'Berhasil',
      data: result
    }
  },

  check: async (expressId: string) => {
    const express = await expressesModel.findOne({
      _id: expressId,
      isDraft: false
    })

    if (express === null) {
      throw {
        message: 'Data tidak ditemukan',
        errors: {}
      }
    }

    if (express.expressStatId !== expressStatConstant.EXPRESS_STAT_ACTIVE) {
      let message: string = 'Status ini sudah dihapus'
      switch (express.expressStatId) {
        case expressStatConstant.EXPRESS_STAT_DELETED:
          message = 'Status ini sudah dihapus'
          break

        case expressStatConstant.EXPRESS_STAT_NOT_RELEVAN:
          message = 'Status ini sudah dijadikan Tidak Relevan'
          break

        case expressStatConstant.EXPRESS_STAT_NOT_RELEVAN:
          message = 'Status ini sudah diblock'
          break
      }
      throw {
        message,
        errors: {}
      }
    }

    return express
  },

  create: async (user: IUserModel, expressId: string, args: IComment) => {
    const express = await Comment.check(expressId)

    const valid = await createValidation(args)

    const comment = new commentsModel()
    comment.expressId = express._id
    comment.userId = user._id
    comment.message = args.message
    comment.commentStatId = commentStatConstant.COMMENT_STAT_ACTIVE
    await comment.save()

    // update express
    const arCommentId = await commentsModel.find({
      expressId: express._id,
      commentStatId: commentStatConstant.COMMENT_STAT_ACTIVE
    })
    express.commentCount = arCommentId.length
    await express.save()

    const data = await commentsModel
      .findById(comment._id)
      .select('-__v -commentStatId -expressId')
      .populate([
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'commentLoves',
          select: 'userId',
          match: { userId: user._id }
        }
      ])

    return {
      message: 'Berhasil',
      data
    }
  },

  update: async (
    user: IUserModel,
    expressId: string,
    id: string,
    args: IComment
  ) => {
    const comment = await commentsModel.findOne({
      _id: id,
      expressId,
      userId: user._id,
      commentStatId: commentStatConstant.COMMENT_STAT_ACTIVE
    })
    if (comment === null) {
      throw {
        message: 'Komentar tidak ditemukan',
        errors: {}
      }
    }

    const valid = await createValidation(args)

    comment.message = args.message
    await comment.save()

    const data = await commentsModel
      .findById(comment._id)
      .select('-__v -commentStatId -expressId')
      .populate([
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'commentLoves',
          select: 'userId',
          match: { userId: user._id }
        }
      ])

    return {
      message: 'Berhasil',
      data
    }
  },

  love: async (user: IUserModel, expressId: string, id: string) => {
    const comment = await commentsModel.findOne({
      _id: id,
      expressId,
      commentStatId: commentStatConstant.COMMENT_STAT_ACTIVE
    })
    if (comment === null) {
      throw {
        message: 'Komentar tidak ditemukan',
        errors: {}
      }
    }

    const check = await commentLovesModel.findOne({
      expressId,
      commentId: id,
      userId: user._id
    })


    if (check === null) {
      const commentLove = new commentLovesModel()
      commentLove.expressId = expressId
      commentLove.commentId = id
      commentLove.userId = user._id
      await commentLove.save()

      // update comment
      const arCommentLoveId = await commentLovesModel
        .find({
          expressId,
          commentId: id
        })
        .distinct('_id')

      comment.commentLoves = arCommentLoveId
      comment.loveCount = arCommentLoveId.length
      await comment.save()
    }

    const data = await commentsModel
      .findById(id)
      .select('-__v -commentStatId -expressId')
      .populate([
        {
          path: 'userId',
          select: 'username name avatar'
        },
        {
          path: 'commentLoves',
          select: 'userId',
          match: { userId: user._id }
        }
      ])
    
    // console.log(data)
    return {
      message: 'Berhasil',
      data
    }
  }
}

export default Comment
