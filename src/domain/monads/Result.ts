type Result<T, TError> = Ok<T> | Err<TError>

type Ok<T> = {
  __result: 'OK'
  data: T
  unwrap(): T
}

type Err<TError> = {
  __result: 'ERR'
  err: TError
  unwrap(): never
}

function ok(data: void): Ok<void>
function ok<T>(data: T): Ok<T>
function ok<T>(data: T | void): Ok<T | void> {
  return { __result: 'OK', data, unwrap: () => data }
}

function err<TError>(err: TError): Err<TError> {
  return {
    __result: 'ERR',
    err,
    unwrap: () => {
      if (err instanceof Error) throw err
      else throw new Error(String(err))
    },
  }
}

function isOk<T, TError>(r: Result<T, TError>): r is Ok<T> {
  return r.__result === 'OK'
}

function isErr<T, TError>(r: Result<T, TError>): r is Err<TError> {
  return r.__result === 'ERR'
}

export default Result
export { ok, err, isOk, isErr }
