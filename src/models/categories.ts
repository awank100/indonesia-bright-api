import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

export interface ICategory {
  code: string
  name: string
  image: string
  imageUrl: string
}

export interface ICategoryModel extends ICategory, Document {}

const categorySchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
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
  }
})

categorySchema.plugin(mongoosePaginate)

const categories = model<ICategoryModel>('categories', categorySchema)

export default categories
