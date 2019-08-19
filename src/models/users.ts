import { Schema, Document, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'
import './user_types'
import './categories'
// Constants
import { EnumGender } from '../constants'

const ObjectId = Schema.Types.ObjectId

export interface IUser {
  username: string
  phone: string
  email: string
  name: string
  gender: EnumGender
  avatar: string
  password: string
  passwordConfirmation: string
  userTypeId: number
  categoryInterests: string[]
  token: string
  firebaseToken: string
  isActive: boolean
}

export interface IUserModel extends IUser, Document {}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      required: false,
      default: null
    },
    email: {
      type: String,
      required: false,
      default: null
    },
    name: {
      type: String,
      required: false,
      default: null
    },
    gender: {
      type: String,
      required: false,
      default: EnumGender.male
    },
    avatar: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    userTypeId: {
      type: Number,
      required: true,
      ref: 'user_types'
    },
    categoryInterests: [
      {
        type: ObjectId,
        required: true,
        ref: 'categories'
      }
    ],
    token: {
      type: String,
      required: false,
      default: null
    },
    firebaseToken: {
      type: String,
      required: false,
      default: null
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  {
    timestamps: true
  }
)

userSchema.plugin(mongoosePaginate)

const users = model<IUserModel>('users', userSchema)

export default users
