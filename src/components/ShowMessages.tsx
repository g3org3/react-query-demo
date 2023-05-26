import { useQuery } from "@tanstack/react-query"
import { db } from "../utils/db"
import { clx } from "../utils/tailwind"
import Alert from "./Alert"

const StatusBadgeButton = (props: { server: boolean, errored: null | VoidFunction }) => {
  if (props.server) {
    return <span className="bg-green-100 border border-green-400 rounded px-4 text-green-800">server</span>
  }

  if (typeof props.errored === 'function') {
    return <button onClick={props.errored} className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-400 rounded px-4 text-slate-800">
      resend?
    </button>

  }

  return <span className="bg-orange-100 border border-orange-400 rounded px-4 text-orange-800 animate-pulse">local</span>
}

const ShowMessages = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: db.messages.find,
    staleTime: 10 * 1000,
  })

  return <div className="flex flex-col flex-1 bg-white shadow-md overflow-auto">
    <Alert status={isLoading ? 'loading' : isFetching ? 'fetching' : isError ? 'failed' : 'standby'} />
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl">Messages</h2>
      <div className="flex flex-col flex-1 overflow-auto">
        {data?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(msg => (
          <div key={msg.id} className={clx({ 'bg-red-50 border-red-400 border': !!msg.errored }, "p-2 border-b flex")}>
            <span>{msg.text}</span>
            <span className="flex-1" />
            <StatusBadgeButton server={msg.server} errored={msg.errored} /> 
          </div>
        ))}
      </div>
    </div>
  </div>
}

export default ShowMessages
