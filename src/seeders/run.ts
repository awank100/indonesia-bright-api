import mongoose from 'mongoose'

import connectMongoose from '../configs/Mongo'
connectMongoose(mongoose)
// Repositories
import GeneralSeeder from './repositories/GeneralSeeder'

const main = {
  general: async () => {
    await GeneralSeeder.categorySeeder()
    await GeneralSeeder.expressStatSeeder()
    await GeneralSeeder.commentStatSeeder()
    process.exit()
  }
}

main.general()
