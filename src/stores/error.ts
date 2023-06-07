import { create } from 'zustand'

export interface MessageInbound {
  id: string
  text: string
  createdAt: Date
}

export interface Message extends MessageInbound {
  server?: boolean
  errored: null | (() => Promise<Message>)
}

interface State {
  errors: Message[]
  push: (error: Message) => void
  remove: (id: string) => void
}

export const useErrorStore = create<State>((set) => ({
  errors: [],
  push: e => set(old => ({
    errors: old.errors.concat(e),
  })),
  remove: id => set(old => ({
    errors: old.errors.filter((e) => e.id !== id),
  })),
}))
