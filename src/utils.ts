export function debounce(callback: (...args: any[]) => any, wait: number) {
  let timeout: number
  return (...args: any[]) => {
    // @ts-ignore
    const context = this
    window.clearTimeout(timeout)
    timeout = window.setTimeout(() => callback.apply(context, args), wait)
  }
}
