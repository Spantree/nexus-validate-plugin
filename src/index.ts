import { plugin } from '@nexus/schema'
import {
  printedGenTyping,
  printedGenTypingImport,
} from '@nexus/schema/dist/utils'
import { RootValue, GetGen, ArgsValue } from '@nexus/schema/dist/core'
import { GraphQLResolveInfo } from 'graphql'
import * as yup from 'yup'
import { UserInputError } from 'apollo-server'

const ValidateResolverImport = printedGenTypingImport({
  module: '@spantree/nexus-validation',
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
) => any

const ValidateArgsImport = printedGenTypingImport({
  module: '@spantree/nexus-validation',
  bindings: ['ValidateArgs'],
})

const validateArgs = printedGenTyping({
  optional: true,
  name: 'validate',
  description: `
  Resolve Reference
  `,
  type: 'ValidateArgs',
  imports: [ValidateArgsImport],
})

export type ValidateArgs = (options: {
  value: any
  yup: typeof yup
  context: GetGen<'context'>
}) => any

export const nexusPluginValidate = plugin({
  name: 'nexusPluginValidate',
  fieldDefTypes: [validateResolver],
  argTypeDefTypes: [validateArgs],
  onCreateFieldResolver(config) {
    return async (root, args, ctx, info, next) => {
      const validationErrors: { [key: string]: string } = {}

      // validate function
      const validate = config.fieldConfig.extensions.nexus.config.validate
      const name = config.fieldConfig.extensions.nexus.config.name
      if (validate) {
        try {
          const result = validate(root, args, ctx, info)

          if (result && result.validateSync) {
            result.validateSync(args)
          }

          if (typeof result === 'boolean' && !result) {
            throw new Error(`Validation failed on general validate function`)
          }

          if (typeof result === 'string' && result !== '') {
            throw new Error(result)
          }
        } catch (error) {
          validationErrors[name] = error.message
        }
      }

      // args fields validate
      const argsConfig = config.fieldConfig.extensions.nexus.config.args
      Object.keys(argsConfig).forEach((key) => {
        if (argsConfig[key].config.validate) {
          try {
            const result = argsConfig[key].config.validate({
              value: args[key],
              context: ctx,
              yup,
            })

            if (result && result.validateSync) {
              result.validateSync(args[key])
            }

            if (typeof result === 'boolean' && !result) {
              throw new Error(`Validation failed on this argument`)
            }

            if (typeof result === 'string' && result !== '') {
              throw new Error(result)
            }
          } catch (error) {
            validationErrors[key] = error.message
          }
        }
      })

      if (Object.keys(validationErrors).length > 0) {
        throw new UserInputError(
          'Failed to complete your request due to validation errors',
          { validationErrors },
        )
      }

      return await next(root, args, ctx, info)
    }
  },
})
