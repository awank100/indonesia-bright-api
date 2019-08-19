import jwt from 'jsonwebtoken'
import validator from 'validator'
import usersModel, { IUserModel, IUser } from '../../../models/users'
// Validations
import registerValidation from '../validations/auth/registerValidation'
// Services
import Bcrypt from '../../../services/Bcrypt'
// Constants
import { userTypeConstant, EnumGender } from '../../../constants'

const User = {
  setFire: async (user: IUserModel, args: IUser) => {
    if (validator.isEmpty(args.firebaseToken)) {
      throw {
        message: 'Token Firebase tidak boleh kosong',
        errors: {}
      }
    }
    user.firebaseToken = args.firebaseToken
    await user.save()

    return {
      message: 'Berhasil',
      data: {}
    }
  },

  register: async (args: IUser) => {
    const valid = await registerValidation(args)

    const user = new usersModel()
    user.userTypeId = userTypeConstant.USER_TYPE_MEMBER
    user.name = args.name
    user.gender = EnumGender.male
    user.username = args.username
    user.password = await Bcrypt.encrypt(args.password)
    user.avatar = `https://api.adorable.io/avatars/285/${
      user.username
    }@adorable.io.png`
    await user.save()

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET as string
    )

    user.token = token
    await user.save()

    return {
      message: 'Berhasil',
      data: {
        Authorization: user.token
      }
    }
  },

  getProfile: async (id: string) => {
    const user = await usersModel
      .findOne({
        _id: id,
        userTypeId: userTypeConstant.USER_TYPE_MEMBER,
        isActive: true
      })
      .select(
        '-token -firebaseToken -password -createdAt -updatedAt -__v -isActive'
      )
      .populate([
        {
          path: 'categoryInterests',
          select: 'code name'
        }
      ])
    if (user === null) {
      throw {
        message: 'User tidak ditemukan',
        errors: {}
      }
    }

    return {
      message: 'Berhasil',
      data: user
    }
  },

  setInterests: async (user: IUserModel, args: IUser) => {
    if (!args.categoryInterests || args.categoryInterests.length < 3) {
      throw {
        message: 'Silahkan pilih minimal 3',
        errors: {}
      }
    }
    user.categoryInterests = args.categoryInterests
    await user.save()

    return {
      message: 'Berhasil',
      data: {}
    }
  }
}

export default User
