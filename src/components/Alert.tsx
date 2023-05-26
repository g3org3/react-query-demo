import { clx } from "../utils/tailwind"

type Status = 'loading' | 'standby' | 'failed' | 'fetching'

export default function Alert(props: { status: Status }) {
  const className = `px-2 border rounded`
  
  return (
    <span className={clx({ 
      'animate-pulse': props.status === 'loading',
      'text-green-600 border-green-400 bg-green-100' : props.status === 'standby',
      'text-blue-600 border-blue-400 bg-blue-100' : props.status === 'loading',
      'text-teal-600 border-teal-400 bg-teal-100' : props.status === 'fetching',
      'text-red-600 border-red-400 bg-red-100' : props.status === 'failed',
    }, className)}>
      {props.status}
    </span> 
  )
}
