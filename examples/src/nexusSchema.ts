import { makeSchema } from 'nexus'
import * as types from './graphql'
import { nexusPluginValidate } from 'nexus-validate-plugin'
import { join } from 'path'

export const schema = makeSchema({
  types,
  plugins: [nexusPluginValidate],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context',
  },
})
