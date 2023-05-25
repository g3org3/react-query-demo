export interface MessageInbound {
  id: string
  text: string
  createdAt: Date
}

export interface Message extends MessageInbound {
  server: boolean
  errored: null | (() => Promise<void>)
}

const fakedb = {
  messages: new Map<string, Message>(),
  errored: new Map<string, boolean>(),
}

export const delay = (t: number) => new Promise(r => setTimeout(r, t * 1000))

export const fetchMessages = async () => {
  await delay(5) 
  return Array.from(fakedb.messages.values())
}

export const createMessage = async (message: MessageInbound) => {
  await delay(5)

  if (!fakedb.errored.get(message.id) && message.text.toLowerCase().includes('error')) {
    fakedb.errored.set(message.id, true)
    throw new Error('cannot create message')
  }
  
  const dbmessage = { ...message, server: true, errored: null }
  fakedb.messages.set(dbmessage.id, dbmessage)

  return dbmessage
}

export const db = {
  messages: { find: fetchMessages, create: createMessage },
}
