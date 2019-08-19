import Validator, {
  IFields as IFieldsValidator
} from '../../../../services/Validator'
// Models
import { IComment } from '../../../../models/comments'

export default async (args: IComment) => {
  const rules: IFieldsValidator[] = [
    {
      key: 'message',
      value: args.message,
      rules: [
        { rule: 'required', message: 'Komentarmu tidak boleh kosong' }
      ]
    }
  ]
  return await Validator.check(rules)
}
