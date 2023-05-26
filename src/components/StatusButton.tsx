interface Props {
 server: boolean,
  errored: null | (() => Promise<void>) 
}

export default function StatusBadgeButton (props: Props) {
  if (props.server) {
    return <span className="bg-green-100 border border-green-400 rounded px-4 text-green-800">server</span>
  }

  if (typeof props.errored === 'function') {
    return <button onClick={props.errored} className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-400 rounded px-4 text-slate-800">
      resend?
    </button>

  }

  return <span className="bg-orange-100 border border-orange-400 rounded px-4 text-orange-800 animate-pulse">
    local
  </span>
}
