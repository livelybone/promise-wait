declare function ejectPromise<T extends any = void>(): Promise<T> & {
  resolve: (_: T) => void
  reject: (_: any) => void
}
declare function wait(
  timeout: number,
): Promise<void> & {
  resolve: (_: void) => void
  reject: (_: any) => void
} & {
  stop: () => void
}
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
> & {
  resolve: (
    _:
      | T
      | {
          timeout: true
        },
  ) => void
  reject: (_: any) => void
} & {
  cancel: () => void
}

export {
  WaitUntilCallbackParams,
  WaitUntilOptions,
  ejectPromise,
  wait,
  waitUntil,
}
