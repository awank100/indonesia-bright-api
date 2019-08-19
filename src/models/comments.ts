import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import './expresses'
import './users'
import './comment_loves'
import './comment_stats'

const ObjectId = Schema.Types.ObjectId

export interface IComment {
  expressId: string
  userId: string
  message: string
  loveCount: number
  commentLoves: string[]
  commentStatId: number
}

export interface ICommentModel extends IComment, Document {}

const commentSchema = new Schema(
  {
    expressId: {
      type: ObjectId,
      required: true,
      ref: 'expresses'
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: 'users'
    },
    message: {
      type: String,
      required: true
    },
    loveCount: {
      type: Number,
      required: false,
      default: 0
    },
    commentLoves: [
      {
        type: ObjectId,
        required: true,
        ref: 'comment_loves'
      }
    ],
    commentStatId: {
      type: Number,
      required: true,
      ref: 'comment_stats'
    }
  },
  {
    timestamps: true
  }
)

commentSchema.plugin(mongoosePaginate)

const comments = model<ICommentModel>('comments', commentSchema)

export default comments
