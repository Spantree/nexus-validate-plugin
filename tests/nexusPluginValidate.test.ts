import { gql } from 'apollo-server'
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'

import { server } from './server'

describe('Integration tests', () => {
  let client: ApolloServerTestClient

  beforeAll(() => {
    client = createTestClient(server)
  })

  test('Server should return the id value', async () => {
    const query = gql`
      query {
        test(id: 1, name: "Ahmed", email: "ahmed@test.com")
      }
    `

    const result = await client.query({ query })

    expect(result.data.test).toEqual(1)
  })

  test('Server should return the id validate error', async () => {
    const query = gql`
      query {
        test(id: 11, name: "Ahmed", email: "ahmed@test.com")
      }
    `

    const result = await client.query({ query })
    expect(result.errors[0].extensions.validationErrors.id).toEqual(
      'this must be less than or equal to 10',
    )
  })

  test('Server should return the name validate error', async () => {
    const query = gql`
      query {
        test(id: 1, name: "Ahk", email: "ahmed@test.com")
      }
    `

    const result = await client.query({ query })
    expect(result.errors[0].extensions.validationErrors.name).toEqual(
      'Validation failed on this argument',
    )
  })

  test('Server should return the email validate error', async () => {
    const query = gql`
      query {
        test(id: 1, name: "Ahmed", email: "ahmedtest.com")
      }
    `

    const result = await client.query({ query })
    expect(result.errors[0].extensions.validationErrors.email).toEqual(
      'invalid email',
    )
  })
})
