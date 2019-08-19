import { Schema, Document, model } from 'mongoose'

export interface IExpressStat {
  name: string
}

export interface IExpressStatModel extends IExpressStat, Document {}

const expressStatsSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const expressStats = model<IExpressStatModel>(
  'express_stats',
  expressStatsSchema
)

export default expressStats
