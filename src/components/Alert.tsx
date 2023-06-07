import { clx } from "../utils/tailwind"

type Status = 'loading' | 'standby' | 'failed' | 'fetching'

export default function Alert(props: { status: Status }) {
  const className = `px-2 border rounded`
  
  return (
    <span className={clx({ 
      'animate-pulse': props.status === 'loading',
      'dark:text-green-300 text-green-600 border-green-400 bg-green-100 dark:bg-green-800' : props.status === 'standby',
      'dark:text-blue-300 text-blue-600 border-blue-400 bg-blue-100 dark:bg-blue-800' : props.status === 'loading',
      'dark:text-cyan-300 text-cyan-600 border-cyan-400 bg-cyan-100 dark:bg-cyan-800' : props.status === 'fetching',
      'dark:text-red-300 text-red-600 border-red-400 bg-red-100 dark:bg-red-800' : props.status === 'failed',
    }, className)}>
      {props.status}
    </span> 
  )
}
