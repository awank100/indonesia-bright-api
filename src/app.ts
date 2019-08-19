import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import mongoose from 'mongoose'
import morgan from 'morgan'
// Configs
import connectMongoose from './configs/Mongo'
// Routes
import routes from './routes'

// dotenv config
dotenv.config()

// connect to mongodb
connectMongoose(mongoose)

const app = express()
app.use(bodyParser.json({ strict: false }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan('tiny'))
app.use(routes)

// ddos protection
app.enable('trust proxy')
const limiter = new rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

app.use(express.static('public'))

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
