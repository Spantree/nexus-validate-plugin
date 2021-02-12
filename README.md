## nexus-validate-plugin

A [Nexus](https://nexusjs.org/) plugin to validate user input with
[yup](https://github.com/jquense/yup).

### Install


```shell
yarn add nexus-validate-plugin
# or
npm i nexus-validate-plugin
```

## API

**nexusPluginValidate** plugin

```ts
import { makeSchema } from '@nexus/schema'
import { nexusPluginValidate } from 'nexus-validate-plugin'

export const schema = makeSchema({
  types,
  plugins: [nexusPluginValidate], // add our plugin to your nexus schema config here
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context',
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
    t.nonNull.int('id')
    t.nonNull.string('email')
    t.string('name')
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
