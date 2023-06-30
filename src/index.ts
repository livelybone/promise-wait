export function ejectPromise<T extends any = void>() {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  const callbacks = { resolve: (_: T) => {}, reject: (_: any) => {} }
  const pro = new Promise<T>((res, rej) => {
    callbacks.resolve = res
    callbacks.reject = rej
  })
  return Object.assign(pro, callbacks)
}

export function wait(timeout: number) {
  const promise = ejectPromise()
  const timer = setTimeout(promise.resolve, timeout)
  return Object.assign(promise, { stop: () => clearTimeout(timer) })
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
  const pro = ejectPromise<{ timeout: true } | T>()

  const timeout = options?.timeout ?? 10000
  let intervalTimer: any
  const timer = setTimeout(() => {
    clearTimeout(intervalTimer)
    return options?.resolveTimeout
      ? pro.resolve({ timeout: true })
      : pro.reject(new Error('waitUntil: timeout'))
  }, timeout)

  const interval = options?.interval ?? 50
  const startTime = Date.now()
  let count = 0
  const runInterval = () => {
    const passedTime = Date.now() - startTime
    const val = until({ count, passedTime })
    count += 1
    Promise.resolve(val)
      .then($val => {
        if ($val) {
          pro.resolve($val)
          clearTimeout(timer)
        } else if (passedTime < timeout) {
          intervalTimer = setTimeout(runInterval, interval)
        }
      })
      .catch(console.error)
  }

  runInterval()

  return Object.assign(pro, { cancel: () => clearTimeout(intervalTimer) })
}
