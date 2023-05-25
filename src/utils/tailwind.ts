export const clx = (ctl: Record<string, boolean>, cl: string) => {
  return [cl].concat(Object.keys(ctl).filter(k => ctl[k])).join(' ')
}
