import * as yup from 'yup'

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

export function createContext(): Context {
  return {
    db,
    yup,
  }
}
