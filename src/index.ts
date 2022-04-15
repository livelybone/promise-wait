export function wait(timeout: number) {
  return new Promise(res => setTimeout(res, timeout))
}

export interface WaitUntilOptions {
  /**
   * @default 10000
   * */
  timeout?: number
  /**
   * @desc whether resolve the promise that returned or not when timeout
   * */
  resolveTimeout?: boolean
  /**
   * @default 50
   * */
  interval?: number
}

export interface WaitUntilCallbackParams {
  /**
   * @desc How many times has this until callback been executed, start with 0
   * */
  count: number
  /**
   * @desc The passed time since waitUntil been called
   * */
  passedTime: number
}

export function waitUntil<T extends any>(
  until: (params: WaitUntilCallbackParams) => T | Promise<T>,
  options?: WaitUntilOptions,
) {
  let resolve: (val: any) => void
  let reject: (reason?: any) => void
  const pro = new Promise<{ timeout: true } | T>((res, rej) => {
    resolve = res
    reject = rej
  })

  const timeout = options?.timeout ?? 10000
  let intervalTimer: any
  const timer = setTimeout(() => {
    clearTimeout(intervalTimer)
    return options?.resolveTimeout
      ? resolve({ timeout: true })
      : reject(new Error('waitUntil: timeout'))
  }, timeout)

  const interval = options?.interval ?? 10000
  const startTime = Date.now()
  let count = 0
  const runInterval = () => {
    const passedTime = Date.now() - startTime
    const val = until({ count, passedTime })
    count += 1
    Promise.resolve(val).then($val => {
      if ($val) {
        resolve($val)
        clearTimeout(timer)
      } else if (passedTime < timeout) {
        intervalTimer = setTimeout(runInterval, interval)
      }
    })
  }

  runInterval()

  return pro
}
