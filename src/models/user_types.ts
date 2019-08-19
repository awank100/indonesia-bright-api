import { Schema, Document, model } from 'mongoose'

export interface IUserType {
  name: string
}

export interface IUserTypeModel extends IUserType, Document {}

const userTypeSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const userTypes = model<IUserTypeModel>(
  'user_types',
  userTypeSchema
)

export default userTypes
