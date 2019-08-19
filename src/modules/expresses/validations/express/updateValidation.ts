import Validator, {
  IFields as IFieldsValidator
} from '../../../../services/Validator'
// Models
import { IExpress } from '../../../../models/expresses'
import categoriesModel from '../../../../models/categories'

export default async (args: IExpress) => {
  const rules: IFieldsValidator[] = [
    // {
    //   key: 'categoryId',
    //   value: args.categoryId,
    //   rules: [
    //     { rule: 'required', message: 'Kategori tidak boleh kosong' }
    //   ]
    // },
    {
      key: 'message',
      value: args.message,
      rules: [
        { rule: 'required', message: 'Pesan tidak boleh kosong' }
      ]
    }
  ]
  const valid = await Validator.check(rules)

  // const category = await categoriesModel.findOne({ _id: args.categoryId })
  // if (category === null) {
  //   throw {
  //     message: 'Terjadi kesalahan',
  //     errors: {
  //       categoryId: ['Kategori tidak valid']
  //     }
  //   }
  // }
  return true
}
