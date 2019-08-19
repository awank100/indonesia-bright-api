import Validator, {
  IFields as IFieldsValidator
} from '../../../../services/Validator'
// Models
import { IUser } from '../../../../models/users'

export default async (args: IUser) => {
  const rules: IFieldsValidator[] = [
    {
      key: 'email',
      value: args.email,
      rules: [
        { rule: 'required', message: 'Telepon / Username / Email tidak boleh kosong' }
      ]
    },
    {
      key: 'password',
      value: args.password,
      rules: [{ rule: 'required', message: 'Password tidak boleh kosong' }]
    }
  ]
  return await Validator.check(rules)
}
