import {
  arg as defaultArg,
  booleanArg as defaultBooleanArg,
  stringArg as defaultStringArg,
  idArg as defaultIdArg,
  floatArg as defaultFloatArg,
  intArg as defaultIntArg,
  AllInputTypes,
} from '@nexus/schema'
import {
  ScalarArgConfig,
  NexusArgConfigType,
  NexusArgConfig,
  NexusArgDef,
  GetGen,
} from '@nexus/schema/dist/core'
import * as yup from 'yup'

type Validate = {
  validate?: (options: {
    value: any
    yup: typeof yup
    context: GetGen<'context'>
  }) => any
}

export function arg<T extends AllInputTypes>(
  options: {
    type: NexusArgConfigType<T>
  } & NexusArgConfig<T> &
    Validate,
): NexusArgDef<T> {
  return defaultArg(options)
}

export function stringArg(
  options?: ScalarArgConfig<string> & Validate,
): NexusArgDef<'String'> {
  return defaultStringArg(options)
}

export function intArg(
  options?: ScalarArgConfig<number> & Validate,
): NexusArgDef<'Int'> {
  return defaultIntArg(options)
}

export function floatArg(
  options?: ScalarArgConfig<number> & Validate,
): NexusArgDef<'Float'> {
  return defaultFloatArg(options)
}

export function idArg(
  options?: ScalarArgConfig<string> & Validate,
): NexusArgDef<'ID'> {
  return defaultIdArg(options)
}

export function booleanArg(
  options?: ScalarArgConfig<boolean> & Validate,
): NexusArgDef<'Boolean'> {
  return defaultBooleanArg(options)
}
