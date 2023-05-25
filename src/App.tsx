import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { v4 as uuid } from 'uuid'
import z from 'zod'

import { db } from './utils/db'
import { getFromData } from './utils/form'
import { clx } from "./utils/tailwind"

const MessageInput  = () => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, isError } = useMutation(db.messages.create, {
    async onMutate(newmessage) {
      await queryClient.cancelQueries({queryKey: ['messages']})

      const prevmessages = queryClient.getQueryData(['messages'])

      queryClient.setQueryData(['messages'], (oldmessages: any) => {
        return oldmessages.concat([newmessage])
      })

      return { prevmessages }
    },
    onError(_, newmessage) { // err, obj, ctx
      // queryClient.setQueryData(['messages'], context?.prevmessages)
      queryClient.setQueryData(['messages'], (old: any) => {
        return old.map(x => {
          if (x.id === newmessage.id) {
            return {
              ...x,
              errored: () => {
                queryClient.setQueryData(['messages'], (old: any) => {
                  return old.filter(x => x.id !== newmessage.id)
                })
                return mutateAsync(newmessage) 
              }
            }
          }

          return x
        })
      })
    },
    onSuccess(message) {
      if (!message) return
      console.log('message')
      queryClient.setQueryData(['messages'], (old: any) => {
        return old.filter(u => u.id !== message.id).concat([message])
      })
    },
    onSettled() {
      // queryClient.invalidateQueries({queryKey: ['messages']}) 
    }
  })
  
  const onSubmit: React.FormEventHandler = (e) => {
    const { data, reset  } = getFromData(z.object({ text: z.string().min(1) }), e)
    if (data == null) return
    
    const message = {
      id: uuid(),
      text: data.text,
      createdAt: new Date(),
    }
    
    mutateAsync(message)
      // .finally(() => {
      reset()
      // })
  }

  return <form className="bg-white shadow rounded p-4 flex flex-col gap-2" onSubmit={onSubmit}>
    <h2 className="text-2xl">Create</h2>
    {isLoading ? (
      <span className="capitalize text-blue-600 border border-blue-400 flex-1 bg-blue-100 px-2">loading...</span> 
    ) : !isError ? (
      <span className="flex-1 border capitalize border-green-400 text-green-600 px-2 bg-green-100">standby</span>
    ) : (
      <span className="border border-red-400 capitalize text-red-600 bg-red-100 px-2 flex-1">errored</span>
    )}
    <input autoComplete="off" placeholder="enter a name" disabled={isLoading && false} name="text" className='border p-2' />
  </form>
}

const ShowMessages = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['messages'],
    queryFn: db.messages.find,
    staleTime: 10 * 1000,
  })

  console.log('> render messages')

  return <div className="flex flex-col gap-4 flex-1 bg-white shadow p-4 overflow-auto">
    <h2 className="text-2xl">Messages</h2>
    <div className="flex gap-2">
      {!isLoading && !isFetching && <span className="flex-1 border capitalize border-green-400 text-green-600 px-2 bg-green-100">loaded</span>}
      {isLoading && <span className="border border-red-400 capitalize text-red-600 bg-red-100 px-2 flex-1">loading...</span>}
      {!isLoading && isFetching && <span className="capitalize text-blue-600 border border-blue-400 flex-1 bg-blue-100 px-2">fethching...</span>}
    </div>
    <div className="flex flex-col flex-1 overflow-auto">
    {data?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(msg => (
      <div key={msg.id} className={clx({ 'bg-red-50 border-red-400 border': !!msg.errored }, "p-2 border-b flex")}>
        <span>{msg.text}</span>
        <span className="flex-1" />
        {msg.server ? (
          <span className="bg-green-100 border border-green-400 rounded px-4 text-green-800">server</span>
        ): !msg.errored ? (
          <span className="bg-orange-100 border border-orange-400 rounded px-4 text-orange-800">local</span>
        ) : (
          <button onClick={msg.errored} className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-400 rounded px-4 text-slate-800">
            resend?
          </button>
        )}
      </div>
    ))}
    </div>
  </div>
}

function App() {
  return (
    <div className="bg-slate-100 h-screen flex gap-2 flex-col pb-5">
      <div className="flex bg-white shadow items-center">
        <div className="container mx-auto px-4 py-2 font-bold">
          react-query demo chat
        </div>
      </div>
      <div className='container mx-auto flex flex-col flex-1 overflow-auto py-4 gap-6'>
        <MessageInput />
        <ShowMessages />
      </div>
    </div>
  )
}

export default App
