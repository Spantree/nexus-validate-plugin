import { makeSchema } from '@nexus/schema'
import * as types from './graphql'
import { nexusPluginValidate } from '@spantree/nexus-validation'

export const schema = makeSchema({
  types,
  plugins: [nexusPluginValidate],
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
