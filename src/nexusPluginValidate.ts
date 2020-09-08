import { plugin } from '@nexus/schema'
import {
  printedGenTyping,
  printedGenTypingImport,
} from '@nexus/schema/dist/utils'
import { RootValue, GetGen, ArgsValue } from '@nexus/schema/dist/core'
import { GraphQLResolveInfo } from 'graphql'
import * as yup from 'yup'

const ValidateResolverImport = printedGenTypingImport({
  module: '../nexusPluginValidate',
  bindings: ['ValidateResolver'],
})

const validateResolver = printedGenTyping({
  optional: true,
  name: 'validate',
  description: `
  Resolve Reference
  `,
  type: 'ValidateResolver<TypeName, FieldName>',
  imports: [ValidateResolverImport],
})

export type ValidateResolver<
  TypeName extends string,
  FieldName extends string
> = (
  root: RootValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  context: GetGen<'context'>,
  info: GraphQLResolveInfo,
) => boolean | { errors: string[] }

export const nexusPluginValidate = plugin({
  name: 'nexusPluginValidate',
  fieldDefTypes: [validateResolver],
  onCreateFieldResolver(config) {
    return async (root, args, ctx, info, next) => {
      // validate function
      const validate = config.fieldConfig.extensions.nexus.config.validate
      if (validate) {
        const result = validate(root, args, ctx, info)
      }

      // args fields validate
      const argsConfig = config.fieldConfig.extensions.nexus.config.args
      Object.keys(argsConfig).forEach((key) => {
        if (argsConfig[key].validate) {
          const result = argsConfig[key].validate({
            value: args[key],
            context: ctx,
            yup,
          })
        }
      })

      return await next(root, args, ctx, info)
    }
  },
})
