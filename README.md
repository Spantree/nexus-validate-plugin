## @spantree/nexus-validation

It's a private nexus plugin package to add validation on user input values using [yup](https://github.com/jquense/yup) package or any other package

### Install

You must have an account in @spantree Org to install this plugin

```shell
yarn add @spantree/nexus-validation
or
npm i @spantree/nexus-validation
```

## API

**nexusPluginValidate** plugin

```ts
import { makeSchema } from 'nexus'
import { nexusPluginValidate } from '@spantree/nexus-validation'

export const schema = makeSchema({
  types,
  plugins: [nexusPluginValidate], // add our plugin to your nexus schema config here
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    sources: [
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
    contextType: 'Context.Context',
  },
})
```

**Args**

## Usage

```ts
import { objectType, queryField, intArg, stringArg } from 'nexus'

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
    // return yup schema and plugin will call schema.validateSync(args)
    return yup.object({
      id: yup.number().min(2).max(3),
      name: yup.string().min(2).max(3),
    })
  },
  args: {
    id: intArg({
      validate({ value, yup }) {
        // do validation by your self and when throw error plugin will catch it
        return yup.number().min(2).max(3).validateSync(value)
      },
    }),
    name: stringArg({
      validate({ value, yup }) {
        // return boolean. if false will throw fixed message "Validation failed on this argument"
        return yup.string().min(2).max(3).isValidSync(value)
      },
    }),
    email: stringArg({
      validate({ value }) {
        // do a custom validation and return error message as string if failure. and do not return anything if success
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
```
