import { ApolloServer } from 'apollo-server'
import { objectType, queryField, intArg, stringArg, makeSchema } from 'nexus'
import { nexusPluginValidate } from '../index'
import { join } from 'path'
import * as yup from 'yup'

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('body')
  },
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('email')
    t.string('name')
  },
})

const Query = queryField('test', {
  type: 'Int',
  validate(root, args, { yup }, info) {
    return yup.object({
      id: yup.number().min(1).max(10),
      name: yup.string().min(5).max(15),
    })
  },
  args: {
    id: intArg({
      validate({ value, yup }) {
        return yup.number().min(1).max(10).validateSync(value)
      },
    }),
    name: stringArg({
      validate({ value, yup }) {
        return yup.string().min(5).max(15).isValidSync(value)
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

const schema = makeSchema({
  types: [User, Post, Query],
  plugins: [nexusPluginValidate],
  outputs: {
    schema: false,
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: join(__dirname, 'server.ts'),
    export: 'Context',
  },
})

export interface Context {
  yup: typeof yup
  db: {
    users: {
      id: string
      name: string
      email: string
    }[]
    posts: {
      id: string
      body: string
    }[]
  }
}

const db: Context['db'] = { users: [], posts: [] }

function createContext(): Context {
  return {
    db,
    yup,
  }
}

export const server = new ApolloServer({
  schema,
  context: createContext,
})
