type ErrorResolvable = Error | string

type Result<T, TError extends ErrorResolvable> = Ok<T> | Err<TError>

type Ok<T> = {
  __result: 'OK'
  data: T
  unwrap(): T
}

type Err<TError extends ErrorResolvable> = {
  __result: 'ERR'
  err: TError
  unwrap(): never
}

function ok(data: void): Ok<void>
function ok<T>(data: T): Ok<T>
function ok<T>(data: T | void): Ok<T | void> {
  return { __result: 'OK', data, unwrap: () => data }
}

function err<TError extends ErrorResolvable>(err: TError): Err<TError> {
  return {
    __result: 'ERR',
    err,
    unwrap: () => {
      if (typeof err === 'string') throw new Error(err)
      throw err
    },
  }
}

function isOk<T, TError extends ErrorResolvable>(r: Result<T, TError>): r is Ok<T> {
  return r.__result === 'OK'
}

function isErr<T, TError extends ErrorResolvable>(r: Result<T, TError>): r is Err<TError> {
  return r.__result === 'ERR'
}

export default Result
export { Ok, ok, isOk, Err, err, isErr }
