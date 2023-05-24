import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { v4 as uuid } from 'uuid'
import { db } from './utils/db'

export const clx = (ctl: Record<string, boolean>, cl: string) => {
  return [cl].concat(Object.keys(ctl).filter(k => ctl[k])).join(' ')
}

const AddInput  = () => {
  const queryClient = useQueryClient()
  const { mutateAsync, isLoading, isError } = useMutation(db.users.create, {
    async onMutate(newUser) {
      await queryClient.cancelQueries({queryKey: ['users']})

      const prevUsers = queryClient.getQueryData(['users'])

      queryClient.setQueryData(['users'], (oldUsers) => {
        return oldUsers.concat([newUser])
      })

      return { prevUsers }
    },
    onError(err, newUser, context) {
      // queryClient.setQueryData(['users'], context?.prevUsers)
      queryClient.setQueryData(['users'], (old) => {
        return old.map(x => {
          if (x.id === newUser.id) {
            return {
              ...x, errored: () => {
                queryClient.setQueryData(['users'], (old) => {
                  return old.filter(x => x.id !== newUser.id)
                })
                return mutateAsync(newUser) 
              }
            }
          }

          return x
        })
      })
    },
    onSuccess(user) {
      if (!user) return
      queryClient.setQueryData(['users'], (oldusers) => {
        return oldusers.filter(u => u.id !== user.id).concat([user])
      })
    },
    onSettled() {
      // queryClient.invalidateQueries({queryKey: ['users']}) 
    }
  })
  
  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    const inputs = Array.from(e.target as never).filter(x => typeof x === 'object' && x != null && "name" in x && x.name) as HTMLInputElement[]
    const form = inputs.reduce<Record<string, HTMLInputElement>>((byName, x) => ({ ...byName, [x.name]: x }), {})
    const user = { id: uuid(), name: form.name.value, createdAt: new Date() }
    mutateAsync(user)
    // mutateAsync(user).finally(() => {
      form.name.value = ''
      setTimeout(() => form.name.focus(), 0)
    // })
  }

  return <form className="flex flex-col gap-2" onSubmit={onSubmit}>
    <h2 className="text-2xl">Create</h2>
    {isLoading ? (
      <span className="capitalize text-blue-600 border border-blue-400 flex-1 bg-blue-100 px-2">loading...</span> 
    ) : !isError ? (
      <span className="flex-1 border capitalize border-green-400 text-green-600 px-2 bg-green-100">standby</span>
    ) : (
      <span className="border border-red-400 capitalize text-red-600 bg-red-100 px-2 flex-1">errored</span>
    )}
    <input autoComplete="off" placeholder="enter a name" disabled={isLoading && false} name="name" className='border p-2' />
  </form>
}

const ShowUsers = () => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: db.users.find,
    staleTime: 10 * 1000,
  })

  console.log('> render users')

  return <div className="flex flex-col gap-4">
    <h2 className="text-2xl">Users</h2>
    <div className="flex gap-2">
      {!isLoading && !isFetching && <span className="flex-1 border capitalize border-green-400 text-green-600 px-2 bg-green-100">loaded</span>}
      {isLoading && <span className="border border-red-400 capitalize text-red-600 bg-red-100 px-2 flex-1">loading...</span>}
      {!isLoading && isFetching && <span className="capitalize text-blue-600 border border-blue-400 flex-1 bg-blue-100 px-2">fethching...</span>}
    </div>
    <div className="flex flex-col">
    {data?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(user => (
      <div key={user.id} className={clx({ 'bg-red-50 border-red-400 border': user.errored}, "p-2 border-b flex")}>
        <span>{user.name}</span>
        <span className="flex-1" />
        {user.server ? (
          <span className="bg-green-100 border border-green-400 rounded px-4 text-green-800">server</span>
        ): !user.errored ? (
          <span className="bg-orange-100 border border-orange-400 rounded px-4 text-orange-800">local</span>
        ) : (
          <button onClick={() => user.errored()} className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-400 rounded px-4 text-slate-800">
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
      <div className="flex h-[32px] bg-white shadow items-center p-2">example</div>
      <div className='container mx-auto flex flex-col flex-1 shadow bg-white overflow-auto p-4 gap-6'>
        <AddInput />
        <hr />
        <ShowUsers />
      </div>
    </div>
  )
}

export default App
