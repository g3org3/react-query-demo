import MessageInput from "./components/MessageInput"
import ShowMessages from "./components/ShowMessages"

export default function App() {
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

