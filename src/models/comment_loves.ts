import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import './expresses'
import './comments'
import './users'

const ObjectId = Schema.Types.ObjectId

export interface ICommentLove {
  expressId: string
  commentId: string
  userId: string
}

export interface ICommentLoveModel extends ICommentLove, Document {}

const commentLoveSchema = new Schema(
  {
    expressId: {
      type: ObjectId,
      required: true,
      ref: 'expresses'
    },
    commentId: {
      type: ObjectId,
      required: true,
      ref: 'comments'
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: 'users'
    }
  },
  {
    timestamps: true
  }
)

commentLoveSchema.plugin(mongoosePaginate)

const commentLoves = model<ICommentLoveModel>(
  'comment_loves',
  commentLoveSchema
)

export default commentLoves
