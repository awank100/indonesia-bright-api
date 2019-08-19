import { Model } from 'mongoose'
import Bcrypt from './Bcrypt'
import { isEmail } from '../helpers/global'

interface IMessage {
  message: string
}

interface IRulesRequired extends IMessage {
  rule: 'required'
}

interface IRulesRequiredArray extends IMessage {
  rule: 'required_array'
}

interface IRulesIsInteger extends IMessage {
  rule: 'is_integer'
}

interface IRulesMinChar extends IMessage {
  rule: 'min_char'
  min_char: number
}

interface IRulesMaxChar extends IMessage {
  rule: 'max_char'
  max_char: number
}

interface IRulesNotHasSpace extends IMessage {
  rule: 'not_has_space'
}

interface IRulesMultipleValue extends IMessage {
  rule: 'multiple_value'
  multiple_value: number
}

interface IRulesMinimumValue extends IMessage {
  rule: 'minimum_value'
  minimum_value: number
}

interface IRulesMaximumValue extends IMessage {
  rule: 'maximum_value'
  maximum_value: number
}

interface IRulesEmail extends IMessage {
  rule: 'email'
}

interface IRulesEqualsWith extends IMessage {
  rule: 'equals_with'
  equals_with: string
}

interface IRulesEqualsWithBcrypt extends IMessage {
  rule: 'equals_with_bcrypt'
  equals_with: string
}

interface IRulesUnique extends IMessage {
  rule: 'unique'
  query: object
  on_collection: Model<any>
}

interface IRulesInEnum extends IMessage {
  rule: 'in_enum'
  enum: any[]
}
type TFieldsRules =
  | IRulesUnique
  | IRulesEqualsWithBcrypt
  | IRulesEqualsWith
  | IRulesEmail
  | IRulesMinimumValue
  | IRulesMaximumValue
  | IRulesRequired
  | IRulesMinChar
  | IRulesMaxChar
  | IRulesNotHasSpace
  | IRulesMultipleValue
  | IRulesInEnum
  | IRulesIsInteger
  | IRulesRequiredArray

export interface IFields {
  key: string
  value: any
  rules: TFieldsRules[]
}

export default {
  check: async (fields: IFields[]) => {
    const result: any = {}
    let error = false

    for (let i = 0; i < fields.length; i++) {
      const messages = []
      for (let j = 0; j < fields[i].rules.length; j++) {
        const value = fields[i].value
        if (fields[i].rules[j].rule === 'required') {
          if (!value || String(value).trim().length === 0) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (fields[i].rules[j].rule === 'required_array') {
          if (Array.isArray(value) === false) {
            messages.push(fields[i].rules[j].message)
          } else if (value.length === 0) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'is_integer') {
          if (isNaN(parseInt(value, 10)) === true) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'min_char') {
          const rule = fields[i].rules[j] as IRulesMinChar
          if (value.length < rule.min_char) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'max_char') {
          const rule = fields[i].rules[j] as IRulesMaxChar
          if (value.length > rule.max_char) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'not_has_space') {
          if (/\s/.test(value)) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'multiple_value') {
          const rule = fields[i].rules[j] as IRulesMultipleValue
          if (value % rule.multiple_value !== 0) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'minimum_value') {
          const rule = fields[i].rules[j] as IRulesMinimumValue
          if (value < rule.minimum_value) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'maximum_value') {
          const rule = fields[i].rules[j] as IRulesMaximumValue
          if (value > rule.maximum_value) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'email') {
          if (!isEmail(value)) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (fields[i].rules[j].rule === 'equals_with') {
          const rule = fields[i].rules[j] as IRulesEqualsWith
          if (value !== rule.equals_with) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (fields[i].rules[j].rule === 'equals_with_bcrypt') {
          const rule = fields[i].rules[j] as IRulesEqualsWithBcrypt
          if (value && !(await Bcrypt.check(value, rule.equals_with))) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'unique') {
          const rule = fields[i].rules[j] as IRulesUnique
          const findData = await rule.on_collection.find(rule.query)
          if (findData.length > 0) {
            messages.push(fields[i].rules[j].message)
          }
        }

        if (value && fields[i].rules[j].rule === 'in_enum') {
          const rule = fields[i].rules[j] as IRulesInEnum
          if (value && rule.enum.includes(value) === false) {
            messages.push(fields[i].rules[j].message)
          }
        }
      }
      if (messages.length > 0) {
        error = true
        result[fields[i].key] = messages
      }
    }
    if (error) {
      throw {
        message: 'Terjadi kesalahan',
        errors: result
      }
    } else {
      return true
    }
  }
}
