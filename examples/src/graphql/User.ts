import { objectType, queryField } from '@nexus/schema'
import { intArg, stringArg } from '@spantree/nexus-validation'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id', { nullable: false })
    t.string('email', { nullable: false })
    t.string('name', { nullable: true })
  },
})

export const Query = queryField('me', {
  type: 'Int',
  validate(root, args, { yup }, info) {
    return yup.object({
      id: yup.number().min(2).max(3),
      name: yup.string().min(2).max(3),
    })
  },
  args: {
    id: intArg({
      validate({ value, yup }) {
        return yup.number().min(2).max(3).validateSync(value)
      },
    }),
    name: stringArg({
      validate({ value, yup }) {
        return yup.string().min(2).max(3).isValidSync(value)
      },
    }),
    email: stringArg({
      validate({ value }) {
        if (!value.includes('@')) {
          return 'invalid email'
        }
      },
    }),
  },
  resolve(_root, { id }) {
    return id
  },
})
