import { Schema, Document, model } from 'mongoose'

export interface ICommentStat {
  name: string
}

export interface ICommentStatModel extends ICommentStat, Document {}

const commentStatsSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const commentStats = model<ICommentStatModel>(
  'comment_stats',
  commentStatsSchema
)

export default commentStats
