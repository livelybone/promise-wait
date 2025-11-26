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

/**
 * Options for `waitUntil` polling behavior.
 *
 * - `timeout` controls the overall maximum wait time.
 * - `resolveTimeout` changes timeout behavior from reject to a resolved marker.
 * - `interval` controls how frequently the `until` callback is evaluated.
 */
export interface WaitUntilOptions {
  /**
   * Overall timeout in milliseconds before giving up.
   * @default 10000
   */
  timeout?: number
  /**
   * Whether to resolve instead of reject on timeout. If `true`, the promise resolves with `{ timeout: true }` when the
   * overall `timeout` is reached. If `false` or omitted, the promise rejects with `Error('waitUntil: timeout')`.
   */
  resolveTimeout?: boolean
  /**
   * Polling interval in milliseconds between executions of the `until` callback.
   * @default 50
   */
  interval?: number
}

/**
 * Parameters passed to the `until` callback in `waitUntil`.
 */
export interface WaitUntilCallbackParams {
  /**
   * How many times the `until` callback has been executed (starts at 0).
   */
  count: number
  /**
   * Milliseconds elapsed since `waitUntil` was called.
   */
  passedTime: number
}

/**
 * @param until
 * @param options
 * @returns
 */
/**
 * Repeatedly evaluates the `until` callback until it returns a truthy value, then resolves with that value.
 *
 * Field logic and behavior:
 * - The `until` callback may be synchronous or return a Promise. Its return is evaluated by JS truthiness:
 *   - If the resolved/returned value is truthy, the promise resolves immediately with that value.
 *   - If falsy (`false`, `0`, `''`, `null`, `undefined`, `NaN`), polling continues until the condition is met or timed out.
 * - `options.timeout` (ms, default 10000): the maximum total wait time.
 * - `options.interval` (ms, default 50): delay between `until` evaluations.
 * - `options.resolveTimeout` (default false):
 *   - `true`  → resolve with `{ timeout: true }` when hitting timeout.
 *   - `false` → reject with `Error('waitUntil: timeout')` when hitting timeout.
 * - Cancellation: the returned promise has `cancel()` to stop further interval polling; the overall timeout timer is not
 *   cleared by `cancel()`, so final resolution/rejection still follows the timeout behavior above.
 * - Errors: if `until` throws synchronously or returns a rejected Promise, the error is logged and the returned promise
 *   rejects immediately; no further polling occurs. This rejection is independent of `timeout`/`resolveTimeout`.
 *
 * @param until Function invoked every interval with `{ count, passedTime }`.
 * @param options Polling configuration; see details above.
 * @returns A promise resolving to `T` (truthy value from `until`) or `{ timeout: true }` (when `resolveTimeout` is true),
 *          plus a `cancel()` method to stop interval polling.
 */
export function waitUntil<T extends any>(
  until: (params: WaitUntilCallbackParams) => T | Promise<T>,
  options?: WaitUntilOptions,
) {
  const pro = ejectPromise<{ timeout: true } | T>()

  const timeout = options?.timeout ?? 10000
  const timeoutErr = new Error('waitUntil: timeout')

  let intervalTimer: any
  const timer = setTimeout(() => {
    clearTimeout(intervalTimer)
    return options?.resolveTimeout
      ? pro.resolve({ timeout: true })
      : pro.reject(timeoutErr)
  }, timeout)

  const interval = options?.interval ?? 50
  const startTime = Date.now()
  let count = 0
  const runInterval = () => {
    const passedTime = Date.now() - startTime
    count += 1
    Promise.resolve()
      .then(() => until({ count, passedTime }))
      .then($val => {
        if ($val) {
          pro.resolve($val)
          clearTimeout(timer)
        } else if (passedTime < timeout) {
          intervalTimer = setTimeout(runInterval, interval)
        }
      })
      .catch(err => {
        clearTimeout(intervalTimer)
        pro.reject(err)
      })
  }

  runInterval()

  return Object.assign(pro, { cancel: () => clearTimeout(intervalTimer) })
}
