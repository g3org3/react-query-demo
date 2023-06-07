import MessageInput from "./components/MessageInput"
import ShowMessages from "./components/ShowMessages"

export default function App() {
  return (
    <div className="bg-slate-100 h-[100dvh] flex gap-2 flex-col pb-5 dark:bg-slate-900">
      <div className="flex bg-white shadow items-center dark:bg-slate-800 dark:text-slate-300">
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

