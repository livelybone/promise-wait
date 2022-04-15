declare function wait(timeout: number): Promise<unknown>
interface WaitUntilOptions {
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
interface WaitUntilCallbackParams {
  /**
   * @desc How many times has this until callback been executed, start with 0
   * */
  count: number
  /**
   * @desc The passed time since waitUntil been called
   * */
  passedTime: number
}
declare function waitUntil<T extends any>(
  until: (params: WaitUntilCallbackParams) => T | Promise<T>,
  options?: WaitUntilOptions,
): Promise<
  | T
  | {
      timeout: true
    }
>

export { WaitUntilCallbackParams, WaitUntilOptions, wait, waitUntil }
