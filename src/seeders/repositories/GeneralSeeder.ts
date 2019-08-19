import categoryData from '../data/categoryData'
import expressStatData from '../data/expressStatData'
import commentStatData from '../data/commentStatData'
// Models
import categoriesModel from '../../models/categories'
import expressStatsModel from '../../models/express_stats'
import commentStatsModel from '../../models/comment_stats'

const GeneralSeeder = {
  categorySeeder: async () => {
    await categoriesModel.insertMany(categoryData)
  },

  expressStatSeeder: async () => {
    await expressStatsModel.insertMany(expressStatData)
  },

  commentStatSeeder: async () => {
    await commentStatsModel.insertMany(commentStatData)
  }
}

export default GeneralSeeder
