import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import './expresses'
import './users'

const ObjectId = Schema.Types.ObjectId

export interface IExpressSupport {
  expressId: string
  userId: string
}

export interface IExpressSupportModel extends IExpressSupport, Document {}

const expressSupportSchema = new Schema(
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
    }
  },
  {
    timestamps: true
  }
)

expressSupportSchema.plugin(mongoosePaginate)

const expressSupports = model<IExpressSupportModel>(
  'express_supports',
  expressSupportSchema
)

export default expressSupports
