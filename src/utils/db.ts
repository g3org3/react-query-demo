export interface InputUser {
  id: string
  name: string
  createdAt: Date
}

export interface ServerUser extends InputUser {
  server: boolean
  errored: null | (() => Promise<void>)
}

const _db = {
  users: new Map<string, ServerUser>(),
  errored: new Map<string, boolean>()
} as const

export const delay = (t: number) => new Promise(r => setTimeout(r, t * 1000))

export const find = (entity: string) => async () => {
  await delay(3) 
  return Object.values(_db[entity])
}


export const create = <T extends {id:string;name:string}, G extends T>(entity: string) => async (item: T) => {
  await delay(6)

  if (!_db.errored.get(item.id) && item.name.toLowerCase().includes('error')) {
    _db.errored.set(item.id, true)
    throw new Error('cannot create')
  }
  
  const dbitem: G = { ...item, server: true, errored: null }
  _db[entity].set(item.id, dbitem)

  return dbitem
}

export const db = {
  users: {
    find: find('users'),
    create: create('users'),
  },
  messages: {
    find: find('messages'),
    create: create('messages'),
  },
}

