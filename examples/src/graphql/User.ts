import { objectType, queryField, intArg, stringArg } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('email')
    t.string('name')
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
