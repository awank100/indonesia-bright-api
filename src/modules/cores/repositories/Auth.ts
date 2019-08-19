import validator from 'validator'
import jwt from "jsonwebtoken"
// Validations
import loginValidation from '../validations/auth/loginValidation'
// Models
import usersModel, { IUser } from '../../../models/users'
// Services
import Bcrypt from '../../../services/Bcrypt'
// Constants
import { userTypeConstant } from '../../../constants'

export const getUserIdFromJWT = async (authorization: string) => {
  if (authorization === undefined) {
    throw {
      message: "Unauthorized"
    }
  }
  const arAuthorization = authorization.split(" ")
  let userId = null
  if (arAuthorization.length !== 2) {
    throw {
      message: 'Token tidak valid',
      errors: {}
    }
  }
  const token = arAuthorization[1]
  jwt.verify(
    arAuthorization[1],
    process.env.JWT_SECRET as string,
    (err, decoded: any) => {
      if (err !== null) {
        throw {
          message: err.message
        }
      }
      userId = decoded.userId
    }
  )

  if (userId === null) {
    throw {
      message: 'Token tidak valid',
      errors: {}
    }
  }
  
  const user = await usersModel.findById(userId)
  if (user === null) {
    throw {
      message: 'User tidak ditemukan',
      errors: {}
    }
  }

  if (user.token !== token) {
    throw {
      message: 'Token kadaluarsa, silahkan login ulang',
      errors: {}
    }
  }

  return userId
}

const Auth = {
  checkAuthorization: async (authorization: string, userTypeId: number) => {
    const userId = await getUserIdFromJWT(authorization)
    const user = await usersModel.findOne({ _id: userId, userTypeId })
    if (user === null) {
      throw {
        message: 'Akses dilarang',
        errors: {}
      }
    }
    return true
  },

  getUserMemberByLogin: async (args: IUser) => {
    interface ICredential {
      userTypeId: number
      isActive: boolean
      email?: string
      username?: string
      phone?: string
    }
    const credential: ICredential = {
      userTypeId: userTypeConstant.USER_TYPE_MEMBER,
      isActive: true
    }

    let user = null
    const validEmail = validator.isEmail(args.email as string)
    if (validEmail) {
      credential.email = args.email
      user = await usersModel.findOne(credential)
    } else {
      credential.username = args.email
      user = await usersModel.findOne(credential)
      if (user === null) {
        user = await usersModel.findOne({
          phone: args.email,
          userTypeId: userTypeConstant.USER_TYPE_MEMBER,
          isActive: true
        })
      }
    }

    if (user == null) {
      throw {
        message: 'Terjadi kesalahan.',
        errors: {
          email: ['Email / Username / Telepon tidak ditemukan']
        }
      }
    }

    if ((await Bcrypt.check(args.password, user.password)) === false) {
      throw {
        message: 'Terjadi kesalahan.',
        errors: {
          password: ['Password salah']
        }
      }
    }
    return user
  },

  login: async (args: IUser) => {
    const valid = await loginValidation(args)

    const user = await Auth.getUserMemberByLogin(args)

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET as string
    )
    
    user.token = token
    await user.save()

    return {
      message: 'Login berhasil.',
      data: {
        Authorization: token
      }
    }
  },

  getOfficeLogin: async (authorization: string) => {
    const userId = await getUserIdFromJWT(authorization)

    const user = await usersModel.findOne({
      _id: userId,
      userTypeId: { $ne: userTypeConstant.USER_TYPE_MEMBER }
    })
    if (user === null) {
      throw {
        message: 'User tidak ditemukan',
        errors: {}
      }
    }

    return user
  },

  getMemberLogin: async (authorization: string) => {
    const userId = await getUserIdFromJWT(authorization)

    const user = await usersModel.findOne({
      _id: userId,
      userTypeId: userTypeConstant.USER_TYPE_MEMBER
    })
    if (user === null) {
      throw {
        message: 'User tidak ditemukan',
        errors: {}
      }
    }

    return user
  },
}

export default Auth
