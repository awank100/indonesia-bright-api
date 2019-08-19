import dotenv from 'dotenv'
import Mongoose from 'mongoose'

dotenv.config()

export default (mongoose: typeof Mongoose) => {
  const url = process.env.MONGODB_URL
  return mongoose.connect((url as string), { useNewUrlParser: true })
}
