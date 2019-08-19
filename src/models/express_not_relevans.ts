import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import './expresses'
import './users'

const ObjectId = Schema.Types.ObjectId

export interface IExpressNotRelevan {
  expressId: string
  userId: string
}

export interface IExpressNotRelevanModel extends IExpressNotRelevan, Document {}

const expressNotRelevanSchema = new Schema(
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

expressNotRelevanSchema.plugin(mongoosePaginate)

const expressNotRelevans = model<IExpressNotRelevanModel>(
  'express_not_relevans',
  expressNotRelevanSchema
)

export default expressNotRelevans
