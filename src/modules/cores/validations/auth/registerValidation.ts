import validator from 'validator'
// Services
import Validator, {
  IFields as IFieldsValidator
} from '../../../../services/Validator'
// Models
import usersModel, { IUser } from '../../../../models/users'
// Constants
import { genderList } from '../../../../constants'

export default async (args: IUser) => {
  const rules: IFieldsValidator[] = [
    {
      key: 'name',
      value: args.name,
      rules: [{ rule: 'required', message: 'Nama tidak boleh kosong' }]
    },
    {
      key: 'username',
      value: args.username,
      rules: [
        { rule: 'required', message: 'Username tidak boleh kosong' },
        {
          rule: 'unique',
          on_collection: usersModel,
          query: { username: args.username },
          message: 'Username tidak tersedia'
        }
      ]
    },
    {
      key: 'password',
      value: args.password,
      rules: [{ rule: 'required', message: 'Password tidak boleh kosong' }]
    },
    {
      key: 'passwordConfirmation',
      value: args.passwordConfirmation,
      rules: [
        { rule: 'required', message: 'Konfirmasi Password tidak boleh kosong' },
        {
          rule: 'equals_with',
          equals_with: args.password,
          message: 'Konfirmasi Password tidak sama'
        }
      ]
    }
  ]
  const valid = await Validator.check(rules)

  const validUsername = validator.isAlphanumeric(args.username)
  if (!validUsername || args.username !== args.username.toLowerCase()) {
    throw {
      message: 'Terjadi kesalahan',
      errors: {
        username: [
          'Username harus huruf dan angka',
          'Username harus huruf kecil'
        ]
      }
    }
  }
  return true
}
