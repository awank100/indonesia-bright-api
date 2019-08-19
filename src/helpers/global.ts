import mongoose from 'mongoose'
import CurrencyFormatter from 'currency-formatter'
import Randomstring from 'randomstring'
// Models
// import userModel from '../models/m_user'

export const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(String(id))
}

export const isEmail = (mail: string) => {
  const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm
  if (re.test(mail)) {
    return true
  }
  return false
}

// export const checkStandarUsername = async (username: string) => {
//   const notStandarUsername = []
//   const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
//   if (format.test(username)) {
//     notStandarUsername.push(
//       'Username tidak boleh memiliki spasi atau simbol.'
//       )
//   }
//   if (username !== username.toLowerCase()) {
//     notStandarUsername.push('Username harus huruf kecil.')
//   }
//   const usernameRegex = new RegExp(`^${username}$`, 'i')
//   const countDuplicate = await userModel
//     .find({
//       username: usernameRegex
//     })
//     .count()
//   if (countDuplicate > 1) {
//     notStandarUsername.push('Username tidak unik.')
//   }
//   return notStandarUsername
// }

export const validPhone = (phone: string) => {
  const arPhone = phone.split('')
  if (arPhone[0] !== '0') {
    return false
  }
  if (arPhone.length >= 10 && arPhone.length <= 12) {
    return true
  }
  return false
}

export const formatPrice = (value: number) => {
  const result = CurrencyFormatter.format(value, {
    symbol: 'Rp',
    decimal: ',',
    thousand: '.',
    precision: 0,
    format: '%s %v' // %s is the symbol and %v is the value
  })
  return result
}

export const genRandomstring = (length: number) => {
  return Randomstring.generate(length)
}
