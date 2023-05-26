import { clx } from "../utils/tailwind"

const colorsByStatus = {
  loading: 'blue',
  standby: 'green',
  failed: 'red',
  fetching: 'teal',
} as const

type Status = keyof typeof colorsByStatus


export default function Alert(props: { status: Status }) {
  const color = colorsByStatus[props.status]
  
  return (
    <span className={clx({ 'animate-pulse': props.status === 'loading'}, `capitalize rounded text-${color}-600 border border-${color}-400 bg-${color}-100 px-2`)}>
      {props.status}
    </span> 
  )
}
