import { useQuery } from "@tanstack/react-query"

import { db } from "../utils/db"
import { useErrorStore } from "../stores/error"
import { clx } from "../utils/tailwind"

import Alert from "./Alert"
import StatusBadgeButton from "./StatusButton"

const ShowMessages = () => {
  const errors = useErrorStore(s => s.errors)
  
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: db.messages.find,
    staleTime: 10 * 1000,
  })

  // @ts-ignore
  const messages = errors.concat(data || []).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return <div className="flex flex-col flex-1 bg-white shadow-md overflow-auto dark:bg-slate-800 dark:text-slate-300">
    <Alert status={isLoading ? 'loading' : isFetching ? 'fetching' : isError ? 'failed' : 'standby'} />
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl">Messages</h2>
      <div className="flex flex-col flex-1 overflow-auto">
        {messages.map(msg => (
          <div key={msg.id} className={clx({ 'bg-red-50 border-red-400 border dark:bg-red-800': !!msg.errored }, "p-2 border-b dark:border-slate-500 flex")}>
            <span>{msg.text}</span>
            <span className="flex-1" />
            {/* @ts-ignore  */}
            <StatusBadgeButton server={msg.server} errored={msg.errored} /> 
          </div>
        ))}
        {!data?.length && <div className="text-3xl self-center text-gray-300">no messages.</div>}
      </div>
    </div>
  </div>
}

export default ShowMessages
