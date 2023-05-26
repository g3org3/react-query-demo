import { useMutation, useQueryClient } from "@tanstack/react-query"
import { db } from "../utils/db"
import { getFromData } from "../utils/form"
import z from "zod"
import { v4 as uuid } from 'uuid'
import Alert from "./Alert"

const MessageInput  = () => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, isError } = useMutation(db.messages.create, {
    async onMutate(newmessage) {
      await queryClient.cancelQueries({queryKey: ['messages']})

      const prevmessages = queryClient.getQueryData(['messages'])

      queryClient.setQueryData(['messages'], (oldmessages: unknown) => {
        if (!oldmessages || !(oldmessages instanceof Array)) return [newmessage]
        return oldmessages.concat([newmessage])
      })

      return { prevmessages }
    },
    onError(_, newmessage) { // err, obj, ctx
      // queryClient.setQueryData(['messages'], context?.prevmessages)
      queryClient.setQueryData(['messages'], (old: unknown) => {
        if (!old || !(old instanceof Array)) return []
        return old.map(x => {
          if (x.id === newmessage.id) {
            return {
              ...x,
              errored: () => {
                queryClient.setQueryData(['messages'], (old: unknown) => {
                  if (!old || !(old instanceof Array)) return []
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
      queryClient.setQueryData(['messages'], (old: unknown) => {
        if (!old || !(old instanceof Array)) return [message]
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

  return <form className="bg-white shadow-md rounded flex flex-col" onSubmit={onSubmit}>
    <Alert status={isLoading ? 'loading' : isError ? 'failed' : 'standby'} />
    <div className="flex flex-col gap-2 p-4">
      <h2 className="text-2xl">Message Input</h2>
      <input autoComplete="off" placeholder="enter a name" disabled={isLoading && false} name="text" className='border p-2' />
    </div>
  </form>
}

export default MessageInput
