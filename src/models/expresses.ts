import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import './users'
import './categories'
import './express_supports'
import './express_not_relevans'
import './express_stats'

const ObjectId = Schema.Types.ObjectId

export interface IExpress {
  userId: string
  categoryId: string
  message: string
  image: string
  imageUrl: string
  supportCount: number
  commentCount: number
  notRelevanCount: number
  expressSupports: string[]
  expressNotRelevans: string[]
  expressStatId: number
  isDraft: boolean
}

export interface IExpressModel extends IExpress, Document {}

const expressSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: 'users'
    },
    categoryId: {
      type: ObjectId,
      required: true,
      ref: 'categories'
    },
    message: {
      type: String,
      required: false,
      default: null
    },
    image: {
      type: String,
      required: false,
      default: null
    },
    imageUrl: {
      type: String,
      required: false,
      default: null
    },
    supportCount: {
      type: Number,
      required: false,
      default: 0
    },
    commentCount: {
      type: Number,
      required: false,
      default: 0
    },
    notRelevanCount: {
      type: Number,
      required: false,
      default: 0
    },
    expressSupports: [
      {
        type: ObjectId,
        required: true,
        ref: 'express_supports'
      }
    ],
    expressNotRelevans: [
      {
        type: ObjectId,
        required: true,
        ref: 'express_not_relevans'
      }
    ],
    expressStatId: {
      type: Number,
      required: true,
      ref: 'express_stats'
    },
    isDraft: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  {
    timestamps: true
  }
)

expressSchema.plugin(mongoosePaginate)

const expresses = model<IExpressModel>('expresses', expressSchema)

export default expresses
