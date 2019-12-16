export const throttle = (func: (...args: any[]) => any, limit: number) => {
  let inThrottle: boolean = false
  return function(..._args: any[]) {
    // @ts-ignore
    const context = this
    if (!inThrottle) {
      func.apply(context, _args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
