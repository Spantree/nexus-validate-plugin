import { objectType, queryField } from '@nexus/schema'
import { arg } from '../args'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id', { nullable: false })
    t.string('email', { nullable: false })
    t.string('name', { nullable: true })
  },
})

export const Query = queryField('me', {
  type: 'User',
  validate(root, args, ctx, info) {
    return true
  },
  args: {
    id: arg({
      type: 'String',
      validate({ value, yup }) {
        return yup.number().min(2).max(3).isValidSync(value)
      },
    }),
  },
})
